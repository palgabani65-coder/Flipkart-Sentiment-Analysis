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
        # Try standard connection with certifi if available
        tls_kwargs = {}
        try:
            import certifi
            tls_kwargs['tlsCAFile'] = certifi.where()
        except ImportError:
            pass

        try:
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=4000, **tls_kwargs)
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            print(f"[MongoDB] Successfully connected to database: {self.db_name}")
            return
        except Exception as primary_err:
            # Fallback with tlsAllowInvalidCertificates=True for SSL handshake issues
            try:
                self.client = MongoClient(self.uri, serverSelectionTimeoutMS=4000, tlsAllowInvalidCertificates=True)
                self.client.admin.command('ping')
                self.db = self.client[self.db_name]
                print(f"[MongoDB] Connected to database: {self.db_name} (using SSL fallback)")
                return
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

    def get_user_by_email(self, email: str):
        """Find user by email address."""
        if not self.is_connected():
            return None
        try:
            collection = self.db[config.USERS_COLLECTION]
            return collection.find_one({"email": email.lower().strip()})
        except Exception as e:
            print(f"[MongoDB Error] Failed to find user by email: {e}")
            return None

    def create_user(self, user_data: dict):
        """Insert new user document into users collection."""
        if not self.is_connected():
            return None
        try:
            collection = self.db[config.USERS_COLLECTION]
            user_data["email"] = user_data["email"].lower().strip()
            result = collection.insert_one(user_data)
            user_data["_id"] = str(result.inserted_id)
            print(f"[MongoDB] User created successfully: {user_data['email']}")
            return user_data
        except Exception as e:
            print(f"[MongoDB Error] Failed to create user: {e}")
            return None

    def get_user_by_id(self, user_id: str):
        """Find user by string ID or ObjectId."""
        if not self.is_connected():
            return None
        try:
            from bson.objectid import ObjectId
            collection = self.db[config.USERS_COLLECTION]
            try:
                query = {"_id": ObjectId(user_id)}
            except Exception:
                query = {"_id": user_id}
            return collection.find_one(query)
        except Exception as e:
            print(f"[MongoDB Error] Failed to find user by ID: {e}")
            return None

    def save_otp(self, email: str, otp_code: str, expire_minutes: int = 10):
        """Store OTP code and expiration timestamp in otps collection."""
        if not self.is_connected():
            return False
        try:
            import datetime
            collection = self.db[config.OTPS_COLLECTION]
            email_clean = email.lower().strip()
            expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=expire_minutes)
            
            otp_doc = {
                "email": email_clean,
                "otp": str(otp_code),
                "created_at": datetime.datetime.utcnow(),
                "expires_at": expires_at
            }
            collection.replace_one({"email": email_clean}, otp_doc, upsert=True)
            print(f"[MongoDB] OTP '{otp_code}' saved for {email_clean}")
            return True
        except Exception as e:
            print(f"[MongoDB Error] Failed to save OTP: {e}")
            return False

    def verify_otp(self, email: str, otp_code: str) -> bool:
        """Verify matching OTP code and expiration timestamp."""
        if not self.is_connected():
            return True  # Fallback for dev mode
        try:
            import datetime
            collection = self.db[config.OTPS_COLLECTION]
            email_clean = email.lower().strip()
            record = collection.find_one({"email": email_clean})
            
            if not record:
                print(f"[OTP Verify] No OTP record found for {email_clean}")
                return False
                
            if str(record.get("otp")).strip() != str(otp_code).strip():
                print(f"[OTP Verify] Invalid OTP code for {email_clean}")
                return False
                
            expires_at = record.get("expires_at")
            if expires_at and datetime.datetime.utcnow() > expires_at:
                print(f"[OTP Verify] Expired OTP code for {email_clean}")
                return False
                
            # Clear used OTP
            collection.delete_one({"email": email_clean})
            return True
        except Exception as e:
            print(f"[MongoDB Error] Failed to verify OTP: {e}")
            return False

    def update_user_password(self, email: str, password_hash: str) -> bool:
        """Update password_hash for user by email address."""
        if not self.is_connected():
            return False
        try:
            collection = self.db[config.USERS_COLLECTION]
            email_clean = email.lower().strip()
            result = collection.update_one(
                {"email": email_clean},
                {"$set": {"password_hash": password_hash, "updated_at": "2026-08-11T21:19:00Z"}}
            )
            if result.modified_count > 0 or result.matched_count > 0:
                print(f"[MongoDB] Password updated successfully for {email_clean}")
                return True
            return False
        except Exception as e:
            print(f"[MongoDB Error] Failed to update password for {email}: {e}")
            return False

db_manager = MongoDBManager()



