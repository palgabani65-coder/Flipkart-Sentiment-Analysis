# FlipSentiment — Model Evaluation & Performance Report

## 1. Executive Summary
This document provides the formal machine learning model evaluation for the **FlipSentiment – Flipkart Product Review Sentiment Analysis** project. 

Evaluation is divided into two distinct components:
1. **Primary Evaluation**: Metric performance on the **5,994 held-out Kaggle test reviews** (20% stratified test split).
2. **Stress Test & Error Analysis**: Error analysis on a custom benchmark of **25 complex mixed-sentiment and contrastive reviews**.

---

## 2. Primary Held-Out Test Set Evaluation (5,994 Reviews)

Hyperparameters were selected using 3-fold `GridSearchCV` on the training set only. After selecting the best hyperparameters, each classifier was evaluated once on the untouched 5,994-review held-out test set.

| Rank | Model | Accuracy | Precision (Weighted) | Recall (Weighted) | Weighted F1-Score | Macro F1-Score | Training Time |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🥇 | **Class-Balanced Logistic Regression** (`C=0.5`) | **0.8353** | **0.8582** | **0.8353** | **0.8442** | **0.7558** | 3.82s |
| 🥈 | **Multinomial Naive Bayes** (`alpha=0.1`) | 0.8333 | 0.8140 | 0.8333 | 0.8210 | 0.6887 | 2.37s |
| 🥉 | **LinearSVC** | 0.8298 | 0.8018 | 0.8298 | 0.8104 | 0.6641 | 1.08s |
| 4th | **Random Forest** | 0.7886 | 0.7703 | 0.7886 | 0.7788 | 0.6232 | 130.38s |

> **Selected Primary Model**: **Class-Balanced Logistic Regression (`C=0.5`, `class_weight='balanced'`)** achieved the highest weighted F1-score (**84.42%**) and highest precision (**85.82%**), providing strong predictive performance with low computational cost and fast inference.

---

## 3. Mixed-Sentiment Stress Test & Error Analysis

To understand the boundary limitations of traditional TF-IDF feature extraction, a stress test of **25 complex contrastive reviews** was conducted as a diagnostic error analysis (separate from primary model selection).

### Stress Test Evaluation & Key Findings
- **Baseline TF-IDF (Unigram + Bigram)**: `56.00%` accuracy (14/25 passed)
- **Enhanced TF-IDF (Unigram + Bigram + Trigram + Contrast Weighting)**: `60.00%` accuracy (15/25 passed)

1. **Bag-of-Words Context Limitation**: TF-IDF weights individual terms independently. High-frequency positive adjectives (`"excellent"`, `"good"`) often overpower negative clause adjectives (`"terrible"`, `"disappointing"`), regardless of contrastive conjunctions (`"but"`, `"however"`).
2. **Probability Distribution Interpretation**: Predicted class probabilities (e.g., `Positive: 43.45%`) represent the model's estimated probability distribution across the sentiment classes. They should not be interpreted as model accuracy or guaranteed confidence.
3. **Fragility of Rule-Based Overrides**: Attempting to force clause-splitting rules (e.g. taking the final clause after `"but"`) fails on counter-examples like:
   > *"The product is terrible, but after contacting customer support they replaced it and everything works perfectly."*

---

## 4. End-to-End End-User Application Architecture & Workflows

### Workflow 1: Single Review Sentiment Analysis
```
Raw Review Text
       ↓
Backend API (/api/v1/analyze-review)
       ↓
CleanTextPipeline Preprocessing
       ↓
Saved TF-IDF Vectorizer (tfidf_vectorizer.pkl)
       ↓
Saved Logistic Regression Model (best_sentiment_model.pkl)
       ↓
Predicted Sentiment + Confidence Breakdown
       ↓
Store in MongoDB & Return API Response
```

### Workflow 2: Flipkart Product URL Batch Analysis
```
Flipkart Product URL
       ↓
Review Acquisition / Compliant Web Scraper Layer
       ↓
Extract Product Reviews Batch
       ↓
Batch CleanTextPipeline Preprocessing
       ↓
Saved TF-IDF Vectorizer (tfidf_vectorizer.pkl)
       ↓
Saved Logistic Regression Model (best_sentiment_model.pkl)
       ↓
Batch Predictions & Aggregated Analytics (Positive / Neutral / Negative %)
       ↓
Store Aggregate Metrics in MongoDB
       ↓
Display Product Sentiment Breakdown on React Dashboard
```

> **Architectural Decoupling**: No model retraining occurs during inference; the pre-trained model (`best_sentiment_model.pkl`) and fitted TF-IDF vectorizer (`tfidf_vectorizer.pkl`) are loaded at application startup and reused for subsequent predictions. The ML prediction layer remains 100% independent of the review acquisition mechanism.

---

## 5. Key Project Results & Research Findings

### 🏆 Key Project Result
> **FlipSentiment's Class-Balanced Logistic Regression model (`C=0.5`, `class_weight='balanced'`), using TF-IDF features (1–3 grams), achieved 83.53% accuracy and 84.42% weighted F1-score on 5,994 previously unseen test reviews.**

### 🔬 Research Finding
> **The additional 25-review stress test demonstrated that traditional TF-IDF models remain less effective on complex contrastive/mixed-sentiment language, motivating future exploration of transformer-based models such as DistilBERT or RoBERTa.**

