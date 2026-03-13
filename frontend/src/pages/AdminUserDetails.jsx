import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get(`/admin/users/${id}`);
        setUser(userRes.data);

        const historyRes = await API.get(`/admin/users/${id}/history`);
        setHistory(historyRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>

      <div className="bg-white shadow rounded p-6 mb-6">
        <p>
          <b>Name:</b> {user.name}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Role:</b> {user.role}
        </p>
        <p>
          <b>Total Analysis:</b> {history.length}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Analysis History</h2>

      <div className="bg-white shadow rounded p-6">
        {history.length === 0 ? (
          <p>No analysis history</p>
        ) : (
          history.map((report) => (
            <div key={report._id} className="border p-5 rounded shadow mb-4">
              <h3 className="font-bold text-lg mb-2">Symptoms</h3>
              <p className="text-gray-700 mb-3">
                {report.symptoms_input?.symptoms}
              </p>
              <p>Duration: {report.symptoms_input?.duration_days} days</p>
              <p>Severity: {report.symptoms_input?.severity}</p>
              <p className="mt-2 font-semibold">
                Risk Level:
                <span className="ml-2 text-blue-600">
                  {report.ai_report?.risk_level}
                </span>
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Analysis Date:{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminUserDetails;
