import sys
import re
import joblib
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import config

from pipeline.train import CleanTextPipeline

class SentimentPredictor:
    def __init__(self, model_path=config.MODEL_PATH, vectorizer_path=config.VECTORIZER_PATH):
        print(f"[Loading Artifacts] Model: {model_path.name} | Vectorizer: {vectorizer_path.name}")
        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)
        self.cleaner = CleanTextPipeline()

    def predict(self, review_text: str):
        """Predict sentiment category and confidence breakdown for any review string."""
        cleaned = self.cleaner.preprocess(review_text)
        if not cleaned.strip():
            cleaned = str(review_text).lower().strip()

        vectorized = self.vectorizer.transform([cleaned])
        prediction = self.model.predict(vectorized)[0]

        probabilities = {}
        if hasattr(self.model, "predict_proba"):
            probas = self.model.predict_proba(vectorized)[0]
            probabilities = {cls: round(float(prob) * 100, 2) for cls, prob in zip(self.model.classes_, probas)}

        return {
            'review': review_text,
            'sentiment': prediction,
            'confidence': probabilities
        }

if __name__ == "__main__":
    predictor = SentimentPredictor()

    if len(sys.argv) > 1:
        # One-shot command line mode: python predict.py "Review text..."
        user_input = " ".join(sys.argv[1:])
        result = predictor.predict(user_input)
        print("\n" + "=" * 65)
        print(f"Review:     \"{result['review']}\"")
        print(f"Sentiment:  -> {result['sentiment'].upper()}")
        if result['confidence']:
            conf_str = ", ".join([f"{k.capitalize()}: {v}%" for k, v in result['confidence'].items()])
            print(f"Confidence: [{conf_str}]")
        print("=" * 65)
    else:
        # Interactive prompt mode
        print("\n" + "=" * 65)
        print("     🛒 FLIPKART REVIEW SENTIMENT PREDICTOR — INTERACTIVE MODE     ")
        print("=" * 65)
        print("Type any review text to analyze its sentiment (or type 'q' or 'exit' to quit).\n")
        
        while True:
            try:
                user_input = input("Enter Flipkart review text > ").strip()
                if not user_input:
                    continue
                if user_input.lower() in ['q', 'quit', 'exit']:
                    print("Exiting predictor. Goodbye!")
                    break

                res = predictor.predict(user_input)
                print("\n" + "-" * 60)
                print(f"  Review:     \"{res['review']}\"")
                print(f"  Sentiment:  -> {res['sentiment'].upper()}")
                if res['confidence']:
                    conf_str = ", ".join([f"{k.capitalize()}: {v}%" for k, v in res['confidence'].items()])
                    print(f"  Confidence: [{conf_str}]")
                print("-" * 60 + "\n")
            except (KeyboardInterrupt, EOFError):
                print("\nExiting predictor. Goodbye!")
                break

