from fastapi import Depends, HTTPException
from bson import ObjectId
from app.utils.auth_utils import get_current_user
from app.database import user_collection


def get_admin_user(current_user=Depends(get_current_user)):
    user = user_collection.find_one({
        "_id": ObjectId(current_user)
    })
    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return user