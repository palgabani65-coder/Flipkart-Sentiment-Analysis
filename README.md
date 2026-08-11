# Flipkart Sentiment Analysis - Data Preprocessing & EDA Pipeline

This project performs full-scale Data Preprocessing, Text Normalization, Lemmatization, and Exploratory Data Analysis (EDA) on a **merged dataset of 394,926 raw Flipkart product reviews** (`Data.csv` + `flipkart_product.csv`).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure Python 3.8+ is installed on your system. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

### 2. Model Training & Evaluation

To train and evaluate multiple sentiment classification models (Multinomial Naive Bayes, Logistic Regression, Random Forest, SVC) and export serialized backend artifacts:

```bash
python backend/scripts/train_model.py
```

Or open and run the self-contained Kaggle Notebook: **`FlipSentiment_Model_Training.ipynb`**.

---

## 🏃 Running the Full Merged Pipeline

To execute data merging, deduplication, lemmatization, EDA chart generation, and report building in a single command, run:

```bash
python backend/scripts/run_pipeline.py
```

### What this script does:
1. **Loads & Merges Datasets**: Reads both `Data.csv` (205,052 reviews) and `flipkart_product.csv` (189,874 reviews) = **394,926 raw reviews**.
2. **Global Deduplication & Cleaning**: Removes 337,392 duplicate rows across both files, leaving **57,534 clean unique reviews**.
3. **NLP Normalization**: Strips garbage symbols (e.g. `??????`), lowercases text, removes stopwords, and applies WordNet Lemmatization.
4. **Saves Clean Dataset**: Exports the unified dataset to `cleaned_flipkart_reviews.csv`.
5. **Generates Visualizations**: Saves 6 high-resolution charts & word clouds into `reports/visualizations/`.
6. **Builds EDA Report**: Updates `reports/eda_report.md`.
7. **MongoDB Sync**: Syncs metrics to MongoDB Atlas/local server if available, or operates smoothly in offline mode.

---

## 🌐 Running the FastAPI Server

To launch the interactive REST API backend server:

```bash
uvicorn backend.main:app --reload --port 8000
```

Access Swagger UI interactive docs at: `http://localhost:8000/docs`.

---

## 🤖 ML Model Artifacts & Backend Integration

Running `python backend/scripts/train_model.py` produces deployment-ready artifacts in `backend/models/`:

- **`backend/models/best_sentiment_model.pkl`**: Winning trained classifier (joblib binary).
- **`backend/models/tfidf_vectorizer.pkl`**: Fitted TF-IDF vectorizer (joblib binary).
- **`backend/models/model_metadata.json`**: Evaluation metrics, parameters, and training metadata.

---

## 📊 Merged Dataset Statistics Summary

| Metric | Value |
| :--- | :--- |
| **Combined Raw Input Rows** | **394,926** |
| **Duplicates Removed** | **337,392** |
| **Final Merged Unique Reviews** | **57,534** |
| **Average Customer Rating** | **3.56 / 5.0** |
| **Average Review Length** | **10.0 words** (90.8 characters) |
| **Positive Reviews** | **37,424** (65.0%) |
| **Negative Reviews** | **15,052** (26.2%) |
| **Neutral Reviews** | **5,058** (8.8%) |

---

## 🍃 MongoDB Atlas Configuration (Optional)

To connect to a live MongoDB Atlas cluster:

1. Create a `.env` file in the project root:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=flipkart_sentiment_db
   ```
2. Re-run `python backend/scripts/run_pipeline.py`.

---

## 📂 Project Output Structure

```
Flipkart Sentiment Analysis/
├── README.md                         # Project documentation
├── .gitignore                        # Git ignore patterns
├── frontend/                         # Frontend application directory
└── backend/                          # Self-Contained Backend Folder
    ├── __init__.py                   # Package initializer
    ├── config.py                     # Project paths & settings
    ├── database.py                   # MongoDB manager with local fallback
    ├── predict.py                    # Sentiment predictor class & CLI
    ├── main.py                       # FastAPI REST API web server
    ├── requirements.txt              # Backend dependencies
    ├── data/                         # Raw & cleaned CSV datasets
    │   ├── Data.csv                  # Dataset 1 (205,052 rows)
    │   ├── flipkart_product.csv      # Dataset 2 (189,874 rows)
    │   └── cleaned_flipkart_reviews.csv # Merged & cleaned dataset
    ├── models/                       # Saved ML Artifacts
    │   ├── best_sentiment_model.pkl  # Trained classifier checkpoint
    │   ├── tfidf_vectorizer.pkl      # Fitted TF-IDF Vectorizer
    │   └── model_metadata.json       # Evaluation metrics & metadata
    ├── notebooks/                    # Self-contained Jupyter Notebooks
    │   ├── FlipSentiment_Model_Training.ipynb
    │   └── test.ipynb
    ├── pipeline/
    │   ├── __init__.py
    │   ├── preprocess.py             # Multi-dataset loader & lemmatizer
    │   ├── eda.py                    # Visual chart & report generator
    │   └── train.py                  # ML model training & evaluation
    ├── reports/                      # EDA reports & generated visual charts
    │   ├── eda_report.md             # Markdown EDA Report
    │   └── visualizations/           # Generated PNG charts & word clouds
    └── scripts/
        ├── run_pipeline.py           # Preprocessing & EDA script
        ├── train_model.py            # ML Model training execution script
        └── test_mixed_sentiments.py  # Mixed sentiment benchmark test
```


