import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl mb-6">Dashboard</h1>

      <div className="flex gap-4">
        <Link
          to="/analysis"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Analyze Symptoms
        </Link>

        <Link
          to="/history"
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          View History
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
