import sys
import uuid
import json
import datetime
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, SQLAlchemyError

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import config

class PostgreSQLManager:
    """Manages PostgreSQL connection, schema initialization, and fallback connections."""
    def __init__(self, uri=config.POSTGRES_URI):
        self.uri = uri
        self.engine = None
        self._connected = False
        self._connect()

    def _connect(self):
        try:
            # Short connect_timeout so API/pipeline boots instantly if Postgres is offline
            self.engine = create_engine(
                self.uri,
                pool_pre_ping=True,
                pool_timeout=3,
                connect_args={"connect_timeout": 3}
            )
            # Ping database
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            self._connected = True
            print(f"[PostgreSQL] Successfully connected to database: {config.POSTGRES_DB}")
            self.create_tables()
        except (OperationalError, Exception) as e:
            print(f"[PostgreSQL Warning] Could not connect to PostgreSQL ({e}). Operating in offline mode.")
            self.engine = None
            self._connected = False

    def is_connected(self) -> bool:
        """Return boolean connection status."""
        if not self._connected or self.engine is None:
            return False
        try:
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception:
            self._connected = False
            return False

    def create_tables(self):
        """Automatically initialize tables (users, otps, eda_metrics, reviews) from backend/schema.sql if not existing."""
        if not self._connected or self.engine is None:
            return

        schema_path = config.BACKEND_DIR / "schema.sql"
        if schema_path.exists():
            try:
                with open(schema_path, "r", encoding="utf-8") as f:
                    schema_sql = f.read()

                # Filter out CREATE DATABASE or \c commands if any
                clean_lines = [
                    line for line in schema_sql.splitlines()
                    if not line.strip().lower().startswith("create database") and not line.strip().startswith("\\c")
                ]
                clean_sql = "\n".join(clean_lines)

                with self.engine.begin() as conn:
                    conn.execute(text(clean_sql))
                print("[PostgreSQL] Schema applied successfully from backend/schema.sql.")
                return
            except Exception as e:
                print(f"[PostgreSQL Warning] Could not apply schema.sql directly ({e}). Falling back to internal SQL statements.")
        
        users_sql = """
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """
        
        otps_sql = """
        CREATE TABLE IF NOT EXISTS otps (
            email VARCHAR(255) PRIMARY KEY,
            otp VARCHAR(20) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expires_at);
        """

        eda_sql = """
        CREATE TABLE IF NOT EXISTS eda_metrics (
            id VARCHAR(64) PRIMARY KEY DEFAULT 'eda_summary',
            metrics JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """

        reviews_sql = """
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR(512),
            product_price NUMERIC(10, 2),
            rate INTEGER,
            review TEXT,
            summary TEXT,
            cleaned_review TEXT,
            full_review TEXT,
            sentiment VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
        CREATE INDEX IF NOT EXISTS idx_reviews_rate ON reviews(rate);
        """

        try:
            with self.engine.begin() as conn:
                conn.execute(text(users_sql))
                conn.execute(text(otps_sql))
                conn.execute(text(eda_sql))
                conn.execute(text(reviews_sql))
            print("[PostgreSQL] Database tables initialized successfully.")
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to create tables: {e}")

    def save_eda_metrics(self, metrics: dict) -> bool:
        """Save/upsert EDA summary metrics to eda_metrics table."""
        if not self.is_connected():
            print("[PostgreSQL] Offline - Skipping EDA metrics upload.")
            return False
        
        try:
            metrics_json = json.dumps(metrics)
            sql = """
            INSERT INTO eda_metrics (id, metrics, updated_at)
            VALUES ('eda_summary', :metrics::jsonb, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE 
            SET metrics = EXCLUDED.metrics, updated_at = CURRENT_TIMESTAMP;
            """
            with self.engine.begin() as conn:
                conn.execute(text(sql), {"metrics": metrics_json})
            print("[PostgreSQL] EDA summary metrics stored/updated successfully.")
            return True
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to save EDA metrics: {e}")
            return False

    def insert_sample_reviews(self, reviews_list: list, limit: int = 1000) -> bool:
        """Insert processed reviews sample into PostgreSQL reviews table."""
        if not self.is_connected():
            print("[PostgreSQL] Offline - Skipping reviews bulk upload.")
            return False
        
        try:
            sample_docs = reviews_list[:limit]
            if not sample_docs:
                return True

            with self.engine.begin() as conn:
                conn.execute(text("TRUNCATE TABLE reviews;"))
                insert_sql = """
                INSERT INTO reviews (product_name, product_price, rate, review, summary, cleaned_review, full_review, sentiment)
                VALUES (:product_name, :product_price, :rate, :review, :summary, :cleaned_review, :full_review, :sentiment);
                """
                formatted_records = []
                for r in sample_docs:
                    formatted_records.append({
                        "product_name": str(r.get("product_name_clean") or r.get("product_name") or "Unknown Product")[:512],
                        "product_price": float(r.get("product_price_clean") or r.get("product_price") or 0.0) if r.get("product_price_clean") or r.get("product_price") else None,
                        "rate": int(r.get("Rate_clean") or r.get("Rate") or 0) if r.get("Rate_clean") or r.get("Rate") else None,
                        "review": str(r.get("Review") or ""),
                        "summary": str(r.get("Summary") or ""),
                        "cleaned_review": str(r.get("cleaned_review") or ""),
                        "full_review": str(r.get("full_review") or ""),
                        "sentiment": str(r.get("Sentiment") or "").lower()[:50]
                    })
                conn.execute(text(insert_sql), formatted_records)
            print(f"[PostgreSQL] Successfully inserted {len(sample_docs)} sample reviews into table 'reviews'.")
            return True
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to insert sample reviews: {e}")
            return False

    def get_user_by_email(self, email: str):
        """Find user by email address."""
        if not self.is_connected():
            return None
        try:
            sql = "SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE LOWER(email) = :email;"
            with self.engine.connect() as conn:
                result = conn.execute(text(sql), {"email": email.lower().strip()}).mappings().first()
                if result:
                    user_dict = dict(result)
                    user_dict["_id"] = user_dict["id"]  # Compatibility alias
                    return user_dict
                return None
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to find user by email: {e}")
            return None

    def create_user(self, user_data: dict):
        """Insert new user row into users table."""
        if not self.is_connected():
            return None
        try:
            user_id = user_data.get("id") or f"usr_{uuid.uuid4().hex[:12]}"
            email = user_data["email"].lower().strip()
            name = user_data.get("name", email.split("@")[0].capitalize())
            password_hash = user_data.get("password_hash", "")
            role = user_data.get("role", "user")

            sql = """
            INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
            VALUES (:id, :name, :email, :password_hash, :role, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, name, email, password_hash, role, created_at, updated_at;
            """
            with self.engine.begin() as conn:
                row = conn.execute(text(sql), {
                    "id": user_id,
                    "name": name,
                    "email": email,
                    "password_hash": password_hash,
                    "role": role
                }).mappings().first()
                res = dict(row)
                res["_id"] = res["id"]
                print(f"[PostgreSQL] User created successfully: {email}")
                return res
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to create user: {e}")
            return None

    def get_user_by_id(self, user_id: str):
        """Find user by string ID."""
        if not self.is_connected():
            return None
        try:
            sql = "SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE id = :user_id;"
            with self.engine.connect() as conn:
                row = conn.execute(text(sql), {"user_id": str(user_id)}).mappings().first()
                if row:
                    user_dict = dict(row)
                    user_dict["_id"] = user_dict["id"]
                    return user_dict
                return None
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to find user by ID: {e}")
            return None

    def save_otp(self, email: str, otp_code: str, expire_minutes: int = 10) -> bool:
        """Store OTP code and expiration timestamp in otps table."""
        if not self.is_connected():
            return False
        try:
            email_clean = email.lower().strip()
            expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=expire_minutes)
            sql = """
            INSERT INTO otps (email, otp, created_at, expires_at)
            VALUES (:email, :otp, CURRENT_TIMESTAMP, :expires_at)
            ON CONFLICT (email) DO UPDATE
            SET otp = EXCLUDED.otp, created_at = CURRENT_TIMESTAMP, expires_at = EXCLUDED.expires_at;
            """
            with self.engine.begin() as conn:
                conn.execute(text(sql), {
                    "email": email_clean,
                    "otp": str(otp_code),
                    "expires_at": expires_at
                })
            print(f"[PostgreSQL] OTP '{otp_code}' saved for {email_clean}")
            return True
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to save OTP: {e}")
            return False

    def verify_otp(self, email: str, otp_code: str) -> bool:
        """Verify matching OTP code and expiration timestamp."""
        if not self.is_connected():
            return True  # Fallback for dev mode
        try:
            email_clean = email.lower().strip()
            sql = "SELECT email, otp, expires_at FROM otps WHERE LOWER(email) = :email;"
            with self.engine.connect() as conn:
                row = conn.execute(text(sql), {"email": email_clean}).mappings().first()
                if not row:
                    print(f"[OTP Verify] No OTP record found for {email_clean}")
                    return False
                
                record = dict(row)
                if str(record.get("otp")).strip() != str(otp_code).strip():
                    print(f"[OTP Verify] Invalid OTP code for {email_clean}")
                    return False

                expires_at = record.get("expires_at")
                if expires_at:
                    now = datetime.datetime.now(datetime.timezone.utc)
                    if expires_at.tzinfo is None:
                        expires_at = expires_at.replace(tzinfo=datetime.timezone.utc)
                    if now > expires_at:
                        print(f"[OTP Verify] Expired OTP code for {email_clean}")
                        return False

            # Delete verified OTP
            with self.engine.begin() as conn:
                conn.execute(text("DELETE FROM otps WHERE LOWER(email) = :email;"), {"email": email_clean})
            return True
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to verify OTP: {e}")
            return False

    def update_user_password(self, email: str, password_hash: str) -> bool:
        """Update password_hash for user by email address."""
        if not self.is_connected():
            return False
        try:
            email_clean = email.lower().strip()
            sql = """
            UPDATE users 
            SET password_hash = :password_hash, updated_at = CURRENT_TIMESTAMP 
            WHERE LOWER(email) = :email;
            """
            with self.engine.begin() as conn:
                res = conn.execute(text(sql), {"password_hash": password_hash, "email": email_clean})
                if res.rowcount > 0:
                    print(f"[PostgreSQL] Password updated successfully for {email_clean}")
                    return True
            return False
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to update password for {email}: {e}")
            return False

    def get_all_users(self):
        """Fetch all registered users from users table."""
        if not self.is_connected():
            return []
        try:
            sql = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC;"
            with self.engine.connect() as conn:
                rows = conn.execute(text(sql)).mappings().all()
                return [dict(r) for r in rows]
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to fetch users: {e}")
            return []

    def get_database_stats(self) -> dict:
        """Fetch overall PostgreSQL database statistics."""
        if not self.is_connected():
            return {
                "connected": False,
                "message": "PostgreSQL is currently disconnected or in offline mode."
            }
        try:
            with self.engine.connect() as conn:
                users_cnt = conn.execute(text("SELECT COUNT(*) FROM users;")).scalar() or 0
                reviews_cnt = conn.execute(text("SELECT COUNT(*) FROM reviews;")).scalar() or 0
                otps_cnt = conn.execute(text("SELECT COUNT(*) FROM otps;")).scalar() or 0
                users_list = [dict(r) for r in conn.execute(text("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 50;")).mappings().all()]

    def update_user_details(self, user_id: str, name: Optional[str] = None, email: Optional[str] = None, role: Optional[str] = None) -> bool:
        """Update user name, email, or role by user_id."""
        if not self.is_connected():
            return False
        try:
            updates = []
            params = {"user_id": str(user_id)}
            if name:
                updates.append("name = :name")
                params["name"] = name.strip()
            if email:
                updates.append("email = :email")
                params["email"] = email.lower().strip()
            if role:
                updates.append("role = :role")
                params["role"] = role.strip().lower()

            if not updates:
                return False

            updates.append("updated_at = CURRENT_TIMESTAMP")
            sql = f"UPDATE users SET {', '.join(updates)} WHERE id = :user_id;"
            with self.engine.begin() as conn:
                res = conn.execute(text(sql), params)
                return res.rowcount > 0
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to update user {user_id}: {e}")
            return False

    def delete_user(self, user_id: str) -> bool:
        """Delete user by user_id."""
        if not self.is_connected():
            return False
        try:
            sql = "DELETE FROM users WHERE id = :user_id;"
            with self.engine.begin() as conn:
                res = conn.execute(text(sql), {"user_id": str(user_id)})
                return res.rowcount > 0
        except Exception as e:
            print(f"[PostgreSQL Error] Failed to delete user {user_id}: {e}")
            return False

db_manager = PostgreSQLManager()
