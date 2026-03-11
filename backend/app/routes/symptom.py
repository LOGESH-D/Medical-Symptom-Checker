from fastapi import APIRouter
from datetime import datetime
from app.models.symptom_model import SymptomInput
from app.services.ai_service import analyze_symptoms
from app.services.hospital_service import get_nearby_hospitals
from app.database import reports_collection

router = APIRouter()


@router.post("/analyze")
def analyze(data: SymptomInput):
    ai_report = analyze_symptoms(data)
    specialist = ai_report["possible_conditions"][0]["recommended_specialist"]
    hospitals = get_nearby_hospitals(
        data.latitude,
        data.longitude,
        specialist
    )
    report = {
        "symptoms_input": data.dict(),
        "ai_report": ai_report,
        "hospitals": hospitals,
        "created_at": datetime.utcnow()
    }
    result = reports_collection.insert_one(report)
    report["_id"] = str(result.inserted_id)
    return report