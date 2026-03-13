from fastapi import APIRouter, Depends
from app.database import user_collection, reports_collection
from app.utils.auth_utils import get_current_user
from bson import ObjectId

router = APIRouter()

@router.get("/profile")
async def get_profile(current_user=Depends(get_current_user)):
    user_id = current_user
    user = user_collection.find_one({
        "_id": ObjectId(user_id)
    })
    total_analysis = reports_collection.count_documents({
        "user_id": user_id
    })
    return {
        "name": user.get("name"),
        "email": user.get("email"),
        "analysis_count": total_analysis
    }