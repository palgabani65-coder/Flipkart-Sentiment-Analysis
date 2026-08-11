"""
Flipkart Sentiment Analysis - FastAPI Backend Application
"""

import os
import sys
import json
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel, Field

# Ensure backend directory is in sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import config
from database import db_manager
from predict import SentimentPredictor

try:
    from fastapi import FastAPI, HTTPException, Request
    from fastapi.middleware.cors import CORSMiddleware
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False

if FASTAPI_AVAILABLE:
    app = FastAPI(
        title="Flipkart Review Sentiment Analysis API",
        description="Production REST API for analyzing sentiment in Flipkart customer reviews using ML models and MongoDB.",
        version="1.0.0"
    )

    # Enable CORS for frontend applications
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global predictor instance
    try:
        predictor = SentimentPredictor()
    except Exception as e:
        print(f"[Warning] Predictor initialization deferred: {e}")
        predictor = None

    class ReviewRequest(BaseModel):
        text: str = Field(..., description="Review text to analyze", example="Great quality product, fast shipping!")

    class BatchReviewRequest(BaseModel):
        reviews: List[str] = Field(..., description="List of review strings", example=["Product is awesome!", "Terrible experience."])

    class SentimentResponse(BaseModel):
        review: str
        sentiment: str
        confidence: dict

    @app.get("/")
    def read_root():
        return {
            "status": "online",
            "message": "Welcome to Flipkart Sentiment Analysis API",
            "docs_url": "/docs",
            "endpoints": [
                "/api/health",
                "/api/predict",
                "/api/predict/batch",
                "/api/metrics"
            ]
        }

    @app.get("/api/health")
    def health_check():
        db_connected = db_manager.is_connected()
        model_loaded = predictor is not None and predictor.model is not None
        return {
            "status": "healthy" if model_loaded else "degraded",
            "database_connected": db_connected,
            "model_loaded": model_loaded,
            "database_name": config.DB_NAME
        }

    @app.post("/api/predict", response_model=SentimentResponse)
    def predict_sentiment_endpoint(req: ReviewRequest):
        global predictor
        if not req.text or not req.text.strip():
            raise HTTPException(status_code=400, detail="Review text cannot be empty.")
        
        if predictor is None:
            try:
                predictor = SentimentPredictor()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Model loading failed: {str(e)}")

        res = predictor.predict(req.text)
        return res

    @app.post("/api/predict/batch")
    def predict_batch_endpoint(req: BatchReviewRequest):
        global predictor
        if not req.reviews:
            raise HTTPException(status_code=400, detail="Reviews list cannot be empty.")
        
        if predictor is None:
            try:
                predictor = SentimentPredictor()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Model loading failed: {str(e)}")

        results = [predictor.predict(text) for text in req.reviews if text.strip()]
        return {"total": len(results), "predictions": results}

    @app.get("/api/metrics")
    def get_model_metrics():
        if not config.METADATA_PATH.exists():
            raise HTTPException(status_code=404, detail="Model metadata file not found.")
        try:
            with open(config.METADATA_PATH, "r") as f:
                data = json.load(f)
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading metadata: {str(e)}")

    if __name__ == "__main__":
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
