from pymongo import MongoClient
from config import Config
import bcrypt
from datetime import datetime


class User:
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client.registration_db
        self.collection = self.db.users

    def create_user(self, user_data):
        """Create a new user in the database"""
        # Hash the password
        hashed_password = bcrypt.hashpw(
            user_data["password"].encode("utf-8"), bcrypt.gensalt()
        )

        # Prepare user document
        user_doc = {
            "full_name": user_data["fullName"],
            "email": user_data["email"],
            "phone": user_data["phone"],
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "is_active": True,
        }

        # Insert user into database
        result = self.collection.insert_one(user_doc)
        return str(result.inserted_id)

    def find_user_by_email(self, email):
        """Find user by email address"""
        return self.collection.find_one({"email": email})

    def email_exists(self, email):
        """Check if email already exists"""
        return self.collection.find_one({"email": email}) is not None
