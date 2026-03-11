from pydantic import BaseModel

class Hospital(BaseModel):
    name: str
    lat: float
    lon: float
    address: str
    rating: str
    distance_km: float