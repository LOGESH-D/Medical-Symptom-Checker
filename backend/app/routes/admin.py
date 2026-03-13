from fastapi import APIRouter, Depends
from app.database import user_collection
from app.services.admin_auth import get_admin_user
from bson import ObjectId
from app.database import reports_collection

router = APIRouter()

@router.get("/users")
def get_all_users(admin=Depends(get_admin_user)):
    users = list(user_collection.find({"role": {"$ne": "admin"}}, {"password": 0}))
    for user in users:
        user["_id"] = str(user["_id"])
    return users

@router.get("/users/{user_id}")
def get_user_profile(user_id: str, admin=Depends(get_admin_user)):
    user = user_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password": 0}
    )
    user["_id"] = str(user["_id"])
    return user

@router.get("/users/{user_id}/history")
def get_user_history(user_id: str, admin=Depends(get_admin_user)):
    reports = list(reports_collection.find({
        "user_id": user_id
    }))
    for report in reports:
        report["_id"] = str(report["_id"])
    return reports

@router.delete("/users/{user_id}")
def delete_user(user_id: str, admin=Depends(get_admin_user)):
    user_collection.delete_one({
        "_id": ObjectId(user_id)
    })
    reports_collection.delete_many({
        "user_id": user_id
    })
    return {"message": "User deleted successfully"}