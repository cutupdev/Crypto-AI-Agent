# MongoDB connection
from pymongo import MongoClient
from core.logger import logger
from config import config

try:
    client = MongoClient(config.MONGODB_URL)
    client.server_info()  # will raise an exception if connection fails
    db = client.user_db
    users_collection = db.users
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    raise Exception(e)
