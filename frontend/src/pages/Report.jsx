import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import HospitalMap from "../components/HospitalMap";

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await API.get(`/reports/${id}`);

      setReport(res.data);
    };

    fetchReport();
  }, [id]);

  if (!report) return <p className="p-10">Loading report...</p>;

  const ai = report.ai_report;

  return (
    <div className="p-10 space-y-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold">Health Analysis Report</h1>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Symptoms Summary</h2>

        <p>{ai.symptoms_summary}</p>
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-3">Possible Conditions</h2>

        {ai.possible_conditions.map((c, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-bold">{c.condition}</h3>

            <p>{c.description}</p>

            <p>
              Probability: <b>{c.probability}</b>
            </p>

            <p>
              Specialist: <b>{c.recommended_specialist}</b>
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold">Risk Level</h2>

        <p className="text-lg">{ai.risk_level}</p>
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-3">Recommended Actions</h2>

        <ul className="list-disc ml-5">
          {ai.recommended_actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold">When to Consult Doctor</h2>

        <p>{ai.when_to_consult_doctor}</p>
      </div>

      <div className="bg-red-100 p-6 rounded">
        <h2 className="text-xl font-semibold text-red-700">
          Emergency Warning
        </h2>

        <p>{ai.emergency_warning}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Nearby Hospitals</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.hospitals.map((h, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <h3 className="font-bold">{h.name}</h3>

              <p>{h.address}</p>

              <p>Rating: {h.rating}</p>

              <p>Distance: {h.distance_km} km</p>

              <a
                href={h.directions_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                Navigate
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Hospital Map</h2>

        <HospitalMap
          hospitals={report.hospitals}
          userLocation={{
            lat: report.symptoms_input.latitude,
            lon: report.symptoms_input.longitude,
          }}
        />
      </div>
    </div>
  );
}

export default Report;
