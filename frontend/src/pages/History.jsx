import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/reports/history");

        setReports(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="p-10">Loading history...</p>;
  }

  if (reports.length === 0) {
    return (
      <div className="p-10">
        <h2 className="text-xl">No previous reports found.</h2>
      </div>
    );
  }

  return (
    <div className="p-10">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6">Your Health Analysis History</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Link key={report._id} to={`/report/${report._id}`}>
            <div className="border p-5 rounded shadow hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">Symptoms</h3>

              <p className="text-gray-700 mb-3">
                {report.symptoms_input.symptoms}
              </p>

              <p>Duration: {report.symptoms_input.duration_days} days</p>

              <p>Severity: {report.symptoms_input.severity}</p>

              <p className="mt-2 font-semibold">
                Risk Level:
                <span className="ml-2 text-blue-600">
                  {report.ai_report.risk_level}
                </span>
              </p>

              {/* <p className="text-sm text-gray-500 mt-3">
                {new Date(report.created_at).toLocaleString()}
              </p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default History;
