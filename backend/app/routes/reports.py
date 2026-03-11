from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import reports_collection
from app.utils.auth_utils import get_current_user

router = APIRouter()

@router.get("/history")
async def get_history(user_id: str = Depends(get_current_user)):
    reports = list(
        reports_collection
        .find({"user_id": user_id})
        .sort("created_at", -1))
    for r in reports:
        r["_id"] = str(r["_id"])
    return reports

@router.get("/{report_id}")
async def get_report(report_id: str, user_id: str = Depends(get_current_user)):
    report = reports_collection.find_one({
        "_id": ObjectId(report_id),
        "user_id": user_id
    })
    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )
    report["_id"] = str(report["_id"])
    return report