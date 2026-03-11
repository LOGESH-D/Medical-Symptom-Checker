from pydantic import BaseModel
from typing import List

class Condition(BaseModel):
    condition: str
    probability: str
    description: str
    recommended_specialist: str

class AIReport(BaseModel):
    symptoms_summary: str
    possible_conditions: List[Condition]
    risk_level: str
    recommended_actions: List[str]
    when_to_consult_doctor: str
    emergency_warning: str