from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.symptom_model import SymptomInput
from app.services.ai_service import analyze_symptoms
from app.services.hospital_service import get_nearby_hospitals
from app.database import reports_collection
from app.utils.auth_utils import get_current_user

router = APIRouter()

@router.post("/analyze")
async def analyze(data: SymptomInput, user_id: str = Depends(get_current_user)):
    ai_report = analyze_symptoms(data)
    specialist = "general"
    if ai_report["possible_conditions"]:
        specialist = ai_report["possible_conditions"][0]["recommended_specialist"]
    hospitals = await get_nearby_hospitals(
        data.latitude,
        data.longitude,
        specialist
    )
    report = {
        "user_id": user_id,
        "symptoms_input": data.dict(),
        "ai_report": ai_report,
        "hospitals": hospitals,
        "created_at": datetime.utcnow()
    }
    result = reports_collection.insert_one(report)
    report["_id"] = str(result.inserted_id)
    return report