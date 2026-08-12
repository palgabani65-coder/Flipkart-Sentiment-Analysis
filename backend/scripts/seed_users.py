import sys
from pathlib import Path

# Add backend to sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import config
from database import db_manager
import auth

def seed_users():
    """Seeds or updates initial Admin and Regular User accounts in MongoDB Atlas."""
    if not db_manager.is_connected():
        print("[Error] Could not connect to MongoDB Atlas. Ensure credentials in atlas-credentials.env are valid.")
        return False

    initial_users = [
        {
            "name": "Pal Gabani (Admin)",
            "email": "palgabani65@gmail.com",
            "password": "12345678",
            "role": "admin"
        },
        {
            "name": "Pal Gabani",
            "email": "palgabani1@gmail.com",
            "password": "12345678",
            "role": "user"
        }
    ]

    collection = db_manager.db[config.USERS_COLLECTION]

    for user_info in initial_users:
        email = user_info["email"].lower().strip()
        pwd_hash = auth.hash_password(user_info["password"])
        
        user_doc = {
            "name": user_info["name"],
            "email": email,
            "password_hash": pwd_hash,
            "role": user_info["role"],
            "created_at": "2026-08-11T20:42:00Z"
        }

        # Upsert user document by email
        result = collection.replace_one({"email": email}, user_doc, upsert=True)
        if result.upserted_id:
            print(f"[MongoDB Atlas] Created new {user_info['role'].upper()} account: {email}")
        else:
            print(f"[MongoDB Atlas] Updated existing {user_info['role'].upper()} account: {email}")

    print("[Success] All initial user accounts seeded successfully in MongoDB Atlas!")
    return True

if __name__ == "__main__":
    seed_users()
