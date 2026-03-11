import requests
import math


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return round(R * c, 2)


def get_nearby_hospitals(lat, lon, specialist):
    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:5000,{lat},{lon});
      node["healthcare:speciality"="{specialist}"](around:5000,{lat},{lon});
    );
    out;
    """
    url = "https://overpass-api.de/api/interpreter"
    response = requests.get(url, params={"data": query})
    data = response.json()
    hospitals = []
    for el in data["elements"]:
        h_lat = el["lat"]
        h_lon = el["lon"]
        hospitals.append({
            "name": el["tags"].get("name", "Hospital"),
            "lat": h_lat,
            "lon": h_lon,
            "address": el["tags"].get("addr:full", "Not available"),
            "rating": el["tags"].get("stars", "N/A"),
            "distance_km": calculate_distance(lat, lon, h_lat, h_lon)
        })
    return hospitals