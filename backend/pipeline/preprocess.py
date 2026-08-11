import re
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import config

class FlipkartDataPreprocessor:
    def __init__(self, raw_datasets=config.RAW_DATASETS, cleaned_filepath=config.CLEANED_DATA_PATH):
        self.raw_datasets = raw_datasets
        self.cleaned_filepath = cleaned_filepath
        self.stop_words = set()
        self.lemmatizer = None
        self._init_nltk()

    def _init_nltk(self):
        """Ensure required NLTK data resources are downloaded."""
        resources = ['stopwords', 'wordnet', 'omw-1.4']
        for resource in resources:
            try:
                nltk.download(resource, quiet=True)
            except Exception as e:
                print(f"[NLTK Warning] Failed to download {resource}: {e}")
        
        try:
            self.stop_words = set(stopwords.words('english'))
            negation_words = {'not', 'no', 'nor', 'neither', 'never', 'barely', 'hardly'}
            self.stop_words = self.stop_words - negation_words
        except Exception:
            self.stop_words = set()

        try:
            self.lemmatizer = WordNetLemmatizer()
        except Exception:
            self.lemmatizer = None

    def clean_price(self, price):
        """Extract clean numeric value from product price."""
        if pd.isna(price):
            return np.nan
        price_str = str(price)
        clean_str = re.sub(r'[^\d.]', '', price_str)
        try:
            return float(clean_str) if clean_str else np.nan
        except ValueError:
            return np.nan

    def clean_rating(self, rating):
        """Coerce ratings to integers between 1 and 5."""
        if pd.isna(rating):
            return np.nan
        try:
            val = float(str(rating).strip())
            if 1.0 <= val <= 5.0:
                return int(round(val))
            return np.nan
        except ValueError:
            return np.nan

    def clean_text(self, text):
        """Comprehensive NLP text cleaner: lowercase, remove punctuation, stopwords, lemmatize."""
        if pd.isna(text) or not str(text).strip():
            return ""

        text_str = str(text).lower()
        # Remove URLs
        text_str = re.sub(r'https?://\S+|www\.\S+', '', text_str)
        # Remove repeated question marks / garbage unicode symbols
        text_str = re.sub(r'[\?]+', ' ', text_str)
        # Remove special characters, numbers, and punctuation
        text_str = re.sub(r'[^a-zA-Z\s]', ' ', text_str)
        words = text_str.split()

        cleaned_tokens = []
        for w in words:
            if w not in self.stop_words and len(w) > 1:
                if self.lemmatizer:
                    w = self.lemmatizer.lemmatize(w)
                cleaned_tokens.append(w)

        return " ".join(cleaned_tokens)

    def load_and_standardize(self, filepath) -> pd.DataFrame:
        """Load a CSV file with encoding fallback and standardize column names."""
        full_path = config.DATA_DIR / filepath
        print(f"[Preprocessing] Loading dataset: {full_path}")
        
        try:
            df = pd.read_csv(full_path, encoding='utf-8', on_bad_lines='skip')
        except (UnicodeDecodeError, Exception):
            df = pd.read_csv(full_path, encoding='latin1', on_bad_lines='skip')

        # Column Name Standardization
        column_mapping = {
            'ProductName': 'product_name',
            'Price': 'product_price',
            'Rate': 'Rate',
            'Review': 'Review',
            'Summary': 'Summary',
            'Sentiment': 'Sentiment'
        }
        df = df.rename(columns=column_mapping)
        df['source_file'] = str(filepath)
        return df

    def process_dataset(self) -> pd.DataFrame:
        dfs = []
        total_raw_rows = 0

        for dataset_filename in self.raw_datasets:
            full_p = config.DATA_DIR / dataset_filename
            if full_p.exists():
                df_item = self.load_and_standardize(dataset_filename)
                total_raw_rows += len(df_item)
                dfs.append(df_item)
            else:
                print(f"[Preprocessing Warning] File {dataset_filename} not found. Skipping.")

        if not dfs:
            raise FileNotFoundError("No raw datasets were found to process.")

        # Merge datasets
        df = pd.concat(dfs, ignore_index=True)
        print(f"[Preprocessing] Total combined raw records loaded: {total_raw_rows}")

        # Drop rows missing Review
        df = df.dropna(subset=['Review']).copy()
        
        # Clean Rate column
        df['Rate_clean'] = df['Rate'].apply(self.clean_rating)
        df = df.dropna(subset=['Rate_clean']).copy()

        # Standardize / Derive Sentiment column
        def resolve_sentiment(row):
            s = str(row.get('Sentiment', '')).lower().strip()
            if s in ['positive', 'negative', 'neutral']:
                return s
            r = row['Rate_clean']
            if r >= 4:
                return 'positive'
            elif r <= 2:
                return 'negative'
            else:
                return 'neutral'

        df['Sentiment'] = df.apply(resolve_sentiment, axis=1)

        # Clean product_name if available
        if 'product_name' in df.columns:
            df['product_name_clean'] = df['product_name'].astype(str).apply(lambda x: re.sub(r'[\?]+', '', x).strip())
        else:
            df['product_name_clean'] = "Unknown Product"

        # Global deduplication across merged datasets
        df = df.drop_duplicates(subset=['Review', 'product_name_clean', 'Rate_clean']).copy()
        dedup_count = len(df)
        print(f"[Preprocessing] Records after combined deduplication: {dedup_count} (Removed {total_raw_rows - dedup_count} duplicates)")

        # Clean Price
        if 'product_price' in df.columns:
            df['product_price_clean'] = df['product_price'].apply(self.clean_price)
        
        print("[Preprocessing] Cleaning review texts & lemmatizing (vectorized batching)...")
        summary_text = df['Summary'].fillna("").astype(str) if 'Summary' in df.columns else ""
        df['full_review'] = df['Review'].astype(str) + " " + summary_text
        df['cleaned_review'] = df['full_review'].apply(self.clean_text)

        # Feature engineering
        df['review_char_len'] = df['full_review'].apply(lambda x: len(str(x)))
        df['review_word_count'] = df['cleaned_review'].apply(lambda x: len(str(x).split()))

        # Filter out empty cleaned reviews
        df = df[df['cleaned_review'].str.strip().str.len() > 0].copy()
        final_count = len(df)
        print(f"[Preprocessing] Final merged cleaned records count: {final_count}")

        # Export cleaned CSV
        df.to_csv(self.cleaned_filepath, index=False, encoding='utf-8')
        print(f"[Preprocessing] Cleaned dataset saved to: {self.cleaned_filepath}")
        return df

if __name__ == "__main__":
    processor = FlipkartDataPreprocessor()
    df_clean = processor.process_dataset()
