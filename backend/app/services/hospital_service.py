import httpx
import math
from operator import itemgetter

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def rank_hospital(distance, rating, specialist_match, emergency):
    distance_score = max(0, 10 - distance)
    rating_score = rating
    specialist_score = 5 if specialist_match else 2
    emergency_score = 5 if emergency else 1
    score = (
        distance_score * 0.4
        + rating_score * 0.3
        + specialist_score * 0.2
        + emergency_score * 0.1
    )
    return round(score, 2)

async def get_nearby_hospitals(user_lat, user_lon, specialist):
    query = f"""
        [out:json];
        (
        node["amenity"="hospital"](around:5000,{user_lat},{user_lon});
        node["healthcare:speciality"="{specialist}"](around:5000,{user_lat},{user_lon});
        );
        out;
    """
    url = "https://overpass-api.de/api/interpreter"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params={"data": query})
        data = response.json()

    hospitals = []
    for el in data.get("elements", []):
        tags = el.get("tags", {})
        lat = el["lat"]
        lon = el["lon"]
        distance = calculate_distance(user_lat, user_lon, lat, lon)
        rating = float(tags.get("stars", 3))
        emergency = tags.get("emergency", "no") == "yes"
        specialist_match = specialist.lower() in str(tags).lower()
        score = rank_hospital(distance, rating, specialist_match, emergency)
        hospital = {
            "name": tags.get("name", "Hospital"),
            "address": tags.get("addr:full", "Address not available"),
            "lat": lat,
            "lon": lon,
            "rating": rating,
            "distance_km": distance,
            "specialist_match": specialist_match,
            "emergency_available": emergency,
            "score": score,
            "directions_url": f"https://www.google.com/maps/dir/{user_lat},{user_lon}/{lat},{lon}"
        }
        hospitals.append(hospital)
    hospitals.sort(key=itemgetter("score"), reverse=True)
    return hospitals[:10]

