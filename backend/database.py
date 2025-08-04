"""
MongoDB Atlas Database Service
Handles all database operations for storing user predictions
"""
import os
import logging
from datetime import datetime
from typing import Optional, Dict, List
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class DatabaseService:
    """MongoDB Atlas service for storing predictions"""
    
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.predictions_collection = None
        self.users_collection = None
        
    async def connect(self):
        """Connect to MongoDB Atlas"""
        try:
            # Get MongoDB URI from environment
            mongo_uri = os.getenv("MONGODB_URI")
            if not mongo_uri:
                logger.error("❌ MONGODB_URI not found in environment variables")
                return False
                
            # Create async client
            self.client = AsyncIOMotorClient(mongo_uri)
            
            # Test connection
            await self.client.admin.command('ping')
            
            # Select database and collections
            db_name = os.getenv("DATABASE_NAME", "destiny_engine")
            self.db = self.client[db_name]
            self.predictions_collection = self.db.predictions
            self.users_collection = self.db.users
            
            logger.info("✅ MongoDB Atlas connected successfully")
            return True
            
        except ConnectionFailure as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Database setup error: {e}")
            return False
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("📴 MongoDB disconnected")
    
    async def save_prediction(self, user_input: Dict, prediction_result: Dict) -> Optional[str]:
        """Save a user prediction to database"""
        try:
            # Create prediction document
            prediction_doc = {
                "timestamp": datetime.utcnow(),
                "user_input": {
                    "name": user_input.get("name"),
                    "age": user_input.get("age"),
                    "university": user_input.get("university"),
                    "aspiration": user_input.get("aspiration"),
                    "country": user_input.get("country")
                },
                "prediction_result": {
                    "predicted_lifetime_nw": prediction_result.get("predicted_lifetime_nw"),
                    "predicted_10_year_nw": prediction_result.get("predicted_10_year_nw"),
                    "rank_band": prediction_result.get("rank_band"),
                    "college_tier": prediction_result.get("college_tier"),
                    "college_rank": prediction_result.get("college_rank"),
                    "success_probability": prediction_result.get("success_probability"),
                    "oracle_confidence": prediction_result.get("oracle_confidence")
                },
                "reasoning": prediction_result.get("reasoning", ""),
                "session_id": user_input.get("session_id", "unknown"),
                "ip_address": user_input.get("ip_address", "unknown"),
                "user_agent": user_input.get("user_agent", "unknown")
            }
            
            # Insert into database
            result = await self.predictions_collection.insert_one(prediction_doc)
            prediction_id = str(result.inserted_id)
            
            logger.info(f"💾 Prediction saved to database: {prediction_id}")
            return prediction_id
            
        except Exception as e:
            logger.error(f"❌ Failed to save prediction: {e}")
            return None
    
    async def get_prediction_stats(self) -> Dict:
        """Get database statistics"""
        try:
            total_predictions = await self.predictions_collection.count_documents({})
            
            # Get most common aspirations
            pipeline = [
                {"$group": {"_id": "$user_input.aspiration", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]
            top_aspirations = await self.predictions_collection.aggregate(pipeline).to_list(10)
            
            # Get most common universities
            pipeline = [
                {"$group": {"_id": "$user_input.university", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]
            top_universities = await self.predictions_collection.aggregate(pipeline).to_list(10)
            
            # Get average predictions by country
            pipeline = [
                {"$group": {
                    "_id": "$user_input.country",
                    "avg_lifetime": {"$avg": "$prediction_result.predicted_lifetime_nw"},
                    "count": {"$sum": 1}
                }},
                {"$sort": {"count": -1}}
            ]
            country_stats = await self.predictions_collection.aggregate(pipeline).to_list(20)
            
            return {
                "total_predictions": total_predictions,
                "top_aspirations": top_aspirations,
                "top_universities": top_universities,
                "country_stats": country_stats,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to get stats: {e}")
            return {"error": str(e)}
    
    async def get_recent_predictions(self, limit: int = 50) -> List[Dict]:
        """Get recent predictions"""
        try:
            cursor = self.predictions_collection.find(
                {},
                {
                    "user_input.name": 1,
                    "user_input.aspiration": 1,
                    "user_input.university": 1,
                    "prediction_result.predicted_lifetime_nw": 1,
                    "prediction_result.rank_band": 1,
                    "timestamp": 1
                }
            ).sort("timestamp", -1).limit(limit)
            
            predictions = await cursor.to_list(limit)
            
            # Convert ObjectId to string
            for pred in predictions:
                pred["_id"] = str(pred["_id"])
            
            return predictions
            
        except Exception as e:
            logger.error(f"❌ Failed to get recent predictions: {e}")
            return []

# Global database instance
database_service = DatabaseService()
