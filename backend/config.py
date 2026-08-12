import os
import sys
from pathlib import Path

# Project paths configuration
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

# Ensure backend folder is in Python path for smooth imports
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

def _load_env(filepath: Path):
    if filepath.exists():
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k and k not in os.environ:
                        os.environ[k] = v
        except Exception as e:
            print(f"[Config Warning] Could not load env file {filepath}: {e}")

_load_env(BACKEND_DIR / "atlas-credentials.env")
_load_env(BACKEND_DIR / "atlas_credential.env")
_load_env(BACKEND_DIR / ".env")
_load_env(PROJECT_ROOT / ".env")

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
DB_NAME = os.getenv("DB_NAME", "FlipSentiment")
REVIEWS_COLLECTION = "reviews"
EDA_METRICS_COLLECTION = "eda_metrics"
USERS_COLLECTION = "users"


# JWT Authentication Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "flipkart_sentiment_jwt_secret_key_2026_secure")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# OTP & Email SMTP Configuration
OTPS_COLLECTION = "otps"
OTP_EXPIRE_MINUTES = 10
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "palgabani65@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

# Thirdwatch MCP & Product Data API Configuration
THIRDWATCH_API_KEY = os.getenv("THIRDWATCH_API_KEY", "tw_live_HC61kBco-d6eD4sf4UFWRPWh5arBUneptN8BgF47L_o")




