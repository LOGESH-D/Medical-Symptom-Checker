import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function HospitalMap({ hospitals, userLocation }) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lon]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hospitals.map((h, index) => (
        <Marker key={index} position={[h.lat, h.lon]}>
          <Popup>
            <div>
              <h3 className="font-bold">{h.name}</h3>

              <p>{h.address}</p>

              <p>⭐ Rating: {h.rating}</p>

              <p>📍 Distance: {h.distance_km} km</p>

              <a
                href={h.directions_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default HospitalMap;
