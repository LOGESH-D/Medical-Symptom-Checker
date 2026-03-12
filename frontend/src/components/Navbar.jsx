import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        AI Medical Checker
      </Link>

      <div className="flex gap-6 items-center">

        {isAuthPage && <Link to="/">Home</Link>}

        {!isAuthPage && token && (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <Link to="/analysis">Analyze</Link>

            <Link to="/history">History</Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

        {!isAuthPage && !token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
