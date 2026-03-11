from pydantic import BaseModel
from typing import List
from datetime import datetime
from .symptom_model import SymptomInput
from .ai_model import AIReport
from .hospital_model import Hospital

class Report(BaseModel):
    user_id: str
    symptoms_input: SymptomInput
    ai_report: AIReport
    hospitals: List[Hospital]
    created_at: datetime