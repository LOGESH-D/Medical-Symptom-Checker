from pydantic import BaseModel, Field

class SymptomInput(BaseModel):
    symptoms: str = Field(..., example="Fever, Cough, Headache")
    duration_days: int = Field(..., example=2)
    severity: str = Field(..., example="Mild")
    action_taken: str = Field(..., example="Took paracetamol and rested")
    notes: str = Field(default="")
    latitude: float
    longitude: float