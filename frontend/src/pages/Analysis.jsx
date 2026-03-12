import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Analysis() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    symptoms: "",
    duration_days: "",
    severity: "",
    actions_taken: "",
    notes: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const payload = {
            ...form,
            duration_days: Number(form.duration_days),
            latitude,
            longitude,
          };

          const res = await API.post("/symptom/analyze", payload);

          const reportId = res.data._id;

          navigate(`/report/${reportId}`);
        } catch (error) {
          alert("Error analyzing symptoms");
        } finally {
          setLoading(false);
        }
      },

      () => {
        alert("Location permission is required to find nearby hospitals.");
        setLoading(false);
      },
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Symptom Analysis</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="symptoms"
          placeholder="Describe your symptoms"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="duration_days"
          placeholder="Duration (days)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <select
          name="severity"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        >
          <option value="">Select Severity</option>
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>

        <input
          name="actions_taken"
          placeholder="Actions taken (medication, rest, etc.)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Additional notes"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded w-full">
          {loading ? "Analyzing..." : "Analyze Symptoms"}
        </button>
      </form>
    </div>
  );
}

export default Analysis;
