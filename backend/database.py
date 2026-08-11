import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import config

class MongoDBManager:
    """Manages MongoDB Atlas and local fallback connections."""
    def __init__(self, uri=config.MONGODB_URI, db_name=config.DB_NAME):
        self.uri = uri
        self.db_name = db_name
        self.client = None
        self.db = None
        self._connect()

    def _connect(self):
        try:
            # Set a 3-second server selection timeout to avoid long waits if MongoDB is offline
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=3000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            print(f"[MongoDB] Successfully connected to database: {self.db_name}")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            print(f"[MongoDB Warning] Could not connect to MongoDB ({e}). Operating in offline mode.")
            self.client = None
            self.db = None

    def is_connected(self):
        return self.db is not None

    def save_eda_metrics(self, metrics: dict):
        """Save EDA summary metrics to eda_metrics collection."""
        if not self.is_connected():
            print("[MongoDB] Offline - Skipping EDA metrics upload.")
            return False
        
        try:
            collection = self.db[config.EDA_METRICS_COLLECTION]
            collection.replace_one({"_id": "eda_summary"}, metrics, upsert=True)
            print("[MongoDB] EDA summary metrics stored/updated successfully.")
            return True
        except Exception as e:
            print(f"[MongoDB Error] Failed to save EDA metrics: {e}")
            return False

    def insert_sample_reviews(self, reviews_list: list, limit: int = 1000):
        """Insert processed reviews sample into MongoDB collection."""
        if not self.is_connected():
            print("[MongoDB] Offline - Skipping reviews bulk upload.")
            return False
        
        try:
            collection = self.db[config.REVIEWS_COLLECTION]
            # Clear existing sample data
            collection.delete_many({})
            sample_docs = reviews_list[:limit]
            if sample_docs:
                collection.insert_many(sample_docs)
                print(f"[MongoDB] Successfully inserted {len(sample_docs)} sample reviews into collection '{config.REVIEWS_COLLECTION}'.")
                return True
        except Exception as e:
            print(f"[MongoDB Error] Failed to insert sample reviews: {e}")
            return False

db_manager = MongoDBManager()
