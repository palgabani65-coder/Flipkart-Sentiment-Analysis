import json
import time
import re
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, f1_score,
    classification_report, confusion_matrix
)

import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import config

class CleanTextPipeline:
    """Standardized text preprocessor with contrastive clause weighting for mixed-sentiment accuracy."""
    CONTRAST_WORDS = {'but', 'however', 'although', 'yet', 'despite', 'nevertheless', 'nonetheless', 'whereas', 'while', 'instead'}
    NEGATION_WORDS = {'not', 'no', 'nor', 'neither', 'never', 'barely', 'hardly'}

    def __init__(self):
        self.stop_words = set()
        self.lemmatizer = None
        self._init_nltk()

    def _init_nltk(self):
        """Initialize NLTK resources safely."""
        for resource in ['stopwords', 'wordnet', 'omw-1.4']:
            try:
                nltk.download(resource, quiet=True)
            except Exception as e:
                print(f"[NLTK Warning] Failed to download {resource}: {e}")
        try:
            # Keep negations and contrastive words out of stop_words
            self.stop_words = set(stopwords.words('english')) - self.NEGATION_WORDS - self.CONTRAST_WORDS
        except Exception:
            self.stop_words = set()
        try:
            self.lemmatizer = WordNetLemmatizer()
        except Exception:
            self.lemmatizer = None

    def preprocess(self, text: str) -> str:
        """Clean and normalize raw review text, giving boosted weight to clauses after contrast conjunctions."""
        if pd.isna(text) or not str(text).strip():
            return ""
        text_str = str(text).lower()
        # Remove URLs
        text_str = re.sub(r'https?://\S+|www\.\S+', '', text_str)
        # Remove garbage symbols / repeated question marks
        text_str = re.sub(r'[\?]+', ' ', text_str)
        # Keep alphabetic tokens
        text_str = re.sub(r'[^a-zA-Z\s]', ' ', text_str)
        words = text_str.split()
        
        cleaned_tokens = []
        has_contrast = False
        
        for w in words:
            if w in self.CONTRAST_WORDS:
                has_contrast = True
                cleaned_tokens.append(w)
                continue

            if w not in self.stop_words and len(w) > 1:
                w_lemma = self.lemmatizer.lemmatize(w) if self.lemmatizer else w
                cleaned_tokens.append(w_lemma)
                # If token occurs AFTER contrast conjunction ('but', 'however'), duplicate token (2.5x clause weight)
                if has_contrast:
                    cleaned_tokens.append(w_lemma)
                    cleaned_tokens.append(f"post_{w_lemma}")

        return " ".join(cleaned_tokens)


class FlipkartModelTrainer:
    """Complete machine learning model training & evaluation pipeline for Flipkart review sentiment analysis."""

    def __init__(self, data_path=config.CLEANED_DATA_PATH, random_state=42):
        self.data_path = Path(data_path)
        self.random_state = random_state
        self.text_cleaner = CleanTextPipeline()
        self.df = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.vectorizer = None
        self.X_train_tfidf = None
        self.X_test_tfidf = None
        self.trained_models = {}
        self.evaluation_results = {}
        self.best_model_name = None
        self.best_model = None

    def load_and_inspect_data(self) -> pd.DataFrame:
        """Step 1: Load and inspect dataset, handling fallback column names and invalid records."""
        print("=" * 70)
        print("STEP 1: LOAD AND INSPECT DATASET")
        print("=" * 70)

        if not self.data_path.exists():
            raise FileNotFoundError(f"Dataset file not found at: {self.data_path}")

        print(f"[Data] Loading dataset from: {self.data_path}")
        self.df = pd.read_csv(self.data_path)

        print(f"[Data] Dataset Shape: {self.df.shape}")
        print(f"[Data] Columns: {list(self.df.columns)}")

        # Column resolution
        text_col = None
        for col in ['cleaned_review', 'full_review', 'review', 'Review', 'Summary']:
            if col in self.df.columns:
                text_col = col
                break
        
        target_col = None
        for col in ['Sentiment', 'sentiment', 'label', 'Label']:
            if col in self.df.columns:
                target_col = col
                break

        if not text_col or not target_col:
            raise KeyError(f"Could not resolve text column ({text_col}) or sentiment target column ({target_col}).")

        print(f"[Data] Identified Review Text Column: '{text_col}', Sentiment Target Column: '{target_col}'")

        # Apply Contrast-Aware NLP Cleaning across all reviews
        print("[Data] Applying Contrast-Aware NLP Preprocessing to review texts...")
        self.df['review'] = self.df[text_col].astype(str).apply(self.text_cleaner.preprocess)
        self.df['sentiment'] = self.df[target_col].astype(str).str.lower().str.strip()

        # Filter valid sentiment classes
        valid_sentiments = ['positive', 'negative', 'neutral']
        self.df = self.df[self.df['sentiment'].isin(valid_sentiments)].copy()

        # Ensure text is non-empty
        self.df = self.df[self.df['review'].str.strip().str.len() > 0].copy()

        # Remove duplicate reviews
        initial_len = len(self.df)
        self.df = self.df.drop_duplicates(subset=['review', 'sentiment']).copy()
        dedup_len = len(self.df)
        print(f"[Data] Deduplication removed {initial_len - dedup_len} exact duplicates. Remaining records: {dedup_len}")

        print("\n[Data] Missing Values Check:")
        print(self.df[['review', 'sentiment']].isnull().sum())

        print("\n[Data] Sentiment Class Distribution:")
        dist = self.df['sentiment'].value_counts()
        dist_pct = self.df['sentiment'].value_counts(normalize=True) * 100
        dist_df = pd.DataFrame({'Count': dist, 'Percentage (%)': dist_pct.round(2)})
        print(dist_df)

        print("\n[Data] Sample Records:")
        print(self.df[['review', 'sentiment']].head(3))

        return self.df

    def split_data(self, test_size=0.2):
        """Step 2: Train/Test Split with stratification."""
        print("\n" + "=" * 70)
        print("STEP 2: TRAIN / TEST SPLIT (80% Train, 20% Test)")
        print("=" * 70)

        X = self.df['review']
        y = self.df['sentiment']

        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=self.random_state,
            stratify=y
        )

        print(f"[Split] Training set size: {len(self.X_train)} samples")
        print(f"[Split] Testing set size:  {len(self.X_test)} samples")

        train_dist = self.y_train.value_counts(normalize=True) * 100
        test_dist = self.y_test.value_counts(normalize=True) * 100
        split_comparison = pd.DataFrame({'Train %': train_dist.round(2), 'Test %': test_dist.round(2)})
        print("\n[Split] Stratified Class Distribution Check:")
        print(split_comparison)

    def extract_tfidf_features(self):
        """Step 3: TF-IDF Feature Extraction (Fit ONLY on training set to prevent data leakage)."""
        print("\n" + "=" * 70)
        print("STEP 3: TF-IDF FEATURE EXTRACTION (Unigram + Bigram + Trigram)")
        print("=" * 70)

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=25000,
            min_df=2,
            max_df=0.85,
            sublinear_tf=True
        )

        print("[TF-IDF] Fitting vectorizer on X_train ONLY...")
        start_t = time.time()
        self.X_train_tfidf = self.vectorizer.fit_transform(self.X_train)
        self.X_test_tfidf = self.vectorizer.transform(self.X_test)
        elapsed = time.time() - start_t

        print(f"[TF-IDF] Feature Extraction Complete in {elapsed:.2f}s")
        print(f"[TF-IDF] Train Feature Matrix Shape: {self.X_train_tfidf.shape}")
        print(f"[TF-IDF] Test Feature Matrix Shape:  {self.X_test_tfidf.shape}")
        print(f"[TF-IDF] Total Vocabulary Size:      {len(self.vectorizer.vocabulary_)} terms")

    def train_and_tune_models(self):
        """Step 4: Train & Tune Multiple Classifiers using GridSearchCV."""
        print("\n" + "=" * 70)
        print("STEP 4: TRAIN MULTIPLE MODELS WITH HYPERPARAMETER TUNING")
        print("=" * 70)

        model_configs = {
            'Multinomial Naive Bayes': {
                'model': MultinomialNB(),
                'params': {
                    'alpha': [0.1, 0.5, 1.0]
                }
            },
            'Logistic Regression': {
                'model': LogisticRegression(max_iter=1000, random_state=self.random_state, class_weight='balanced'),
                'params': {
                    'C': [0.5, 1.0, 5.0],
                    'solver': ['lbfgs']
                }
            },
            'Support Vector Classifier': {
                'model': CalibratedClassifierCV(LinearSVC(C=1.0, class_weight='balanced', random_state=self.random_state, max_iter=2000)),
                'params': {}
            },
            'Random Forest': {
                'model': RandomForestClassifier(random_state=self.random_state, n_jobs=-1),
                'params': {
                    'n_estimators': [100, 150],
                    'max_depth': [25, None]
                }
            }
        }

        for model_name, cfg in model_configs.items():
            print(f"\n--- Training {model_name} ---")
            start_t = time.time()
            if cfg['params']:
                grid = GridSearchCV(
                    estimator=cfg['model'],
                    param_grid=cfg['params'],
                    cv=3,
                    scoring='f1_weighted',
                    n_jobs=-1
                )
                grid.fit(self.X_train_tfidf, self.y_train)
                best_clf = grid.best_estimator_
                best_params = grid.best_params_
                print(f"[Tuning] Best Parameters: {best_params}")
            else:
                best_clf = cfg['model']
                best_clf.fit(self.X_train_tfidf, self.y_train)
                best_params = "Default"

            elapsed = time.time() - start_t
            print(f"[Training] Completed in {elapsed:.2f}s")
            self.trained_models[model_name] = {
                'model': best_clf,
                'params': best_params,
                'train_time_sec': round(elapsed, 2)
            }

    def evaluate_models(self):
        """Step 5 & 6: Evaluate all models, generate plots, and select the best model."""
        print("\n" + "=" * 70)
        print("STEP 5: MODEL EVALUATION & COMPARISON")
        print("=" * 70)

        results_list = []

        for model_name, item in self.trained_models.items():
            clf = item['model']
            y_pred = clf.predict(self.X_test_tfidf)

            acc = accuracy_score(self.y_test, y_pred)
            prec, rec, f1_w, _ = precision_recall_fscore_support(self.y_test, y_pred, average='weighted', zero_division=0)
            _, _, f1_m, _ = precision_recall_fscore_support(self.y_test, y_pred, average='macro', zero_division=0)

            cm = confusion_matrix(self.y_test, y_pred, labels=['positive', 'neutral', 'negative'])
            clf_rep = classification_report(self.y_test, y_pred, output_dict=True, zero_division=0)

            self.evaluation_results[model_name] = {
                'accuracy': acc,
                'precision': prec,
                'recall': rec,
                'f1_weighted': f1_w,
                'f1_macro': f1_m,
                'confusion_matrix': cm,
                'report': clf_rep,
                'predictions': y_pred
            }

            results_list.append({
                'Model': model_name,
                'Accuracy': round(acc, 4),
                'Precision': round(prec, 4),
                'Recall': round(rec, 4),
                'F1-Score': round(f1_w, 4),
                'Macro F1': round(f1_m, 4)
            })

            print(f"\n>>> {model_name} Results <<<")
            print(f"Accuracy:  {acc:.4f}")
            print(f"Precision: {prec:.4f}")
            print(f"Recall:    {rec:.4f}")
            print(f"F1-Score (Weighted): {f1_w:.4f}")
            print(f"F1-Score (Macro):    {f1_m:.4f}")

        # Summary Table
        summary_df = pd.DataFrame(results_list).sort_values(by='F1-Score', ascending=False)
        print("\n" + "=" * 70)
        print("FINAL MODEL COMPARISON TABLE")
        print("=" * 70)
        print(summary_df.to_string(index=False))

        # Select Best Model
        best_row = summary_df.iloc[0]
        self.best_model_name = best_row['Model']
        self.best_model = self.trained_models[self.best_model_name]['model']

        print("\n" + "=" * 70)
        print(f"WINNING MODEL: {self.best_model_name.upper()}")
        print(f"Selected based on highest Weighted F1-Score: {best_row['F1-Score']}")
        print("=" * 70)

        # Generate Visualizations
        self.generate_visualizations(summary_df)

        return summary_df

    def generate_visualizations(self, summary_df: pd.DataFrame):
        """Generate presentation-ready plots."""
        sns.set_theme(style="whitegrid", palette="muted")
        config.VISUALIZATIONS_DIR.mkdir(parents=True, exist_ok=True)

        # 1. Sentiment Distribution Plot
        plt.figure(figsize=(8, 5))
        ax = sns.countplot(x=self.df['sentiment'], order=['positive', 'neutral', 'negative'], palette=['#2ecc71', '#f1c40f', '#e74c3c'])
        plt.title("Flipkart Review Sentiment Distribution", fontsize=14, fontweight='bold', pad=12)
        plt.xlabel("Sentiment Class", fontsize=12)
        plt.ylabel("Review Count", fontsize=12)
        for p in ax.patches:
            height = p.get_height()
            ax.annotate(f'{int(height):,}', (p.get_x() + p.get_width() / 2., height / 2),
                        ha='center', va='center', fontsize=11, color='white', fontweight='bold')
        plt.tight_layout()
        plot_path1 = config.VISUALIZATIONS_DIR / "sentiment_distribution_train.png"
        plt.savefig(plot_path1, dpi=300)
        plt.close()

        # 2. Accuracy & F1-Score Comparison Plot
        plt.figure(figsize=(10, 5))
        melted_df = summary_df.melt(id_vars=['Model'], value_vars=['Accuracy', 'F1-Score'], var_name='Metric', value_name='Score')
        ax = sns.barplot(data=melted_df, x='Model', y='Score', hue='Metric', palette=['#3498db', '#9b59b6'])
        plt.title("Model Performance Comparison (Accuracy vs F1-Score)", fontsize=14, fontweight='bold', pad=12)
        plt.ylim(0.5, 1.0)
        plt.ylabel("Score", fontsize=12)
        plt.xlabel("Classifier Model", fontsize=12)
        for p in ax.patches:
            h = p.get_height()
            if h > 0:
                ax.annotate(f'{h:.4f}', (p.get_x() + p.get_width() / 2., h - 0.04),
                            ha='center', va='bottom', fontsize=9, color='white', fontweight='bold', rotation=90)
        plt.tight_layout()
        plot_path2 = config.VISUALIZATIONS_DIR / "model_comparison_metrics.png"
        plt.savefig(plot_path2, dpi=300)
        plt.close()

        # 3. Best Model Confusion Matrix Heatmap
        best_cm = self.evaluation_results[self.best_model_name]['confusion_matrix']
        plt.figure(figsize=(7, 6))
        labels = ['Positive', 'Neutral', 'Negative']
        sns.heatmap(best_cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels, cbar=False, annot_kws={"size": 12, "weight": "bold"})
        plt.title(f"Confusion Matrix — Best Model ({self.best_model_name})", fontsize=13, fontweight='bold', pad=12)
        plt.xlabel("Predicted Sentiment Label", fontsize=11)
        plt.ylabel("Actual True Label", fontsize=11)
        plt.tight_layout()
        plot_path3 = config.VISUALIZATIONS_DIR / "best_model_confusion_matrix.png"
        plt.savefig(plot_path3, dpi=300)
        plt.close()

        print(f"[Visualizations] Clean presentation-ready plots saved to: {config.VISUALIZATIONS_DIR}")

    def test_sample_predictions(self):
        """Step 7: Test predict_sentiment function on raw sample reviews."""
        print("\n" + "=" * 70)
        print("STEP 7: TEST ON NEW / REAL-TIME FLIPKART REVIEWS")
        print("=" * 70)

        test_reviews = [
            "The air cooler is absolutely amazing! Cooling performance is fast, low power consumption and totally worth the money.",
            "Very bad product. It stopped working after 3 days. Extremely noisy and cheap plastic quality. Waste of money!",
            "It is an average product. Air flow is okay for a small room, but nothing extraordinary.",
            "Superb build quality! Delivery was super quick by Flipkart. Highly recommended!",
            "Defective product delivered. Product box was broken and fan blade was cracked. Extremely dissatisfied with seller service."
        ]

        print(f"Testing sentiment prediction using best model: '{self.best_model_name}'...\n")

        for idx, raw_review in enumerate(test_reviews, 1):
            pred_sentiment, proba_dict = self.predict_sentiment(raw_review)
            print(f"Review #{idx}: \"{raw_review}\"")
            print(f"  -> Predicted Sentiment: {pred_sentiment.upper()}")
            if proba_dict:
                prob_str = ", ".join([f"{k}: {v*100:.1f}%" for k, v in proba_dict.items()])
                print(f"  -> Confidence Scores:  [{prob_str}]")
            print("-" * 65)

    def predict_sentiment(self, review_text: str):
        """Predict sentiment for any raw review text."""
        cleaned_text = self.text_cleaner.preprocess(review_text)
        if not cleaned_text.strip():
            # Fallback if text is empty after cleaning
            cleaned_text = str(review_text).lower().strip()

        vectorized_text = self.vectorizer.transform([cleaned_text])
        pred_label = self.best_model.predict(vectorized_text)[0]

        proba_dict = None
        if hasattr(self.best_model, "predict_proba"):
            try:
                probas = self.best_model.predict_proba(vectorized_text)[0]
                classes = self.best_model.classes_
                proba_dict = {cls: float(prob) for cls, prob in zip(classes, probas)}
            except Exception:
                proba_dict = None

        return pred_label, proba_dict

    def save_artifacts(self):
        """Step 8 & 9: Save model artifacts using joblib for backend deployment."""
        print("\n" + "=" * 70)
        print("STEP 8 & 9: SAVE MODEL ARTIFACTS FOR BACKEND INTEGRATION")
        print("=" * 70)

        config.MODELS_DIR.mkdir(parents=True, exist_ok=True)

        # Save Best Model & Vectorizer
        joblib.dump(self.best_model, config.MODEL_PATH)
        joblib.dump(self.vectorizer, config.VECTORIZER_PATH)

        # Save Metadata
        best_eval = self.evaluation_results[self.best_model_name]
        metadata = {
            'best_model_name': self.best_model_name,
            'best_params': str(self.trained_models[self.best_model_name]['params']),
            'accuracy': float(best_eval['accuracy']),
            'precision': float(best_eval['precision']),
            'recall': float(best_eval['recall']),
            'f1_weighted': float(best_eval['f1_weighted']),
            'f1_macro': float(best_eval['f1_macro']),
            'num_training_samples': len(self.X_train),
            'num_testing_samples': len(self.X_test),
            'vocabulary_size': len(self.vectorizer.vocabulary_),
            'saved_at': time.strftime("%Y-%m-%d %H:%M:%S")
        }

        with open(config.METADATA_PATH, 'w') as f:
            json.dump(metadata, f, indent=4)

        print(f"[Artifacts Saved Successfully]")
        print(f" - Model Artifact:      {config.MODEL_PATH}")
        print(f" - TF-IDF Vectorizer:   {config.VECTORIZER_PATH}")
        print(f" - Metadata JSON:       {config.METADATA_PATH}")

    def run_full_pipeline(self):
        """Execute the entire end-to-end ML pipeline."""
        start_t = time.time()
        self.load_and_inspect_data()
        self.split_data()
        self.extract_tfidf_features()
        self.train_and_tune_models()
        summary_df = self.evaluate_models()
        self.test_sample_predictions()
        self.save_artifacts()
        total_time = time.time() - start_t
        print("\n" + "=" * 70)
        print(f"ML MODEL TRAINING PIPELINE COMPLETED IN {total_time:.2f} SECONDS")
        print("=" * 70)
        return summary_df


if __name__ == "__main__":
    trainer = FlipkartModelTrainer()
    trainer.run_full_pipeline()
