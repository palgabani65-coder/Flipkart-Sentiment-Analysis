import os
import sys
from pathlib import Path

# Project paths configuration
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

# Ensure backend folder is in Python path for smooth imports
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

DATA_DIR = BACKEND_DIR / "data"

# Dataset file choices: list of datasets to merge
RAW_DATASETS = ["Data.csv", "flipkart_product.csv"]
CLEANED_DATA_PATH = DATA_DIR / "cleaned_flipkart_reviews.csv"

# Reports & Models Configuration
REPORTS_DIR = BACKEND_DIR / "reports"
VISUALIZATIONS_DIR = REPORTS_DIR / "visualizations"
EDA_REPORT_PATH = REPORTS_DIR / "eda_report.md"

MODELS_DIR = BACKEND_DIR / "models"
MODEL_PATH = MODELS_DIR / "best_sentiment_model.pkl"
VECTORIZER_PATH = MODELS_DIR / "tfidf_vectorizer.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
VISUALIZATIONS_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Database Configuration (MongoDB Atlas with local fallback)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "flipkart_sentiment_db")
REVIEWS_COLLECTION = "reviews"
EDA_METRICS_COLLECTION = "eda_metrics"


