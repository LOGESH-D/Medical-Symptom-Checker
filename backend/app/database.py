import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["medical_symptom_checker"]


user_collection = db["users"]
reports_collection = db["reports"]