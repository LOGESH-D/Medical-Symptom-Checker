from pydantic import BaseModel


class Hospital(BaseModel):
    name: str
    address: str
    lat: float
    lon: float
    rating: float
    distance_km: float
    specialist_match: bool
    emergency_available: bool
    score: float
    directions_url: str