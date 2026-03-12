import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

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
