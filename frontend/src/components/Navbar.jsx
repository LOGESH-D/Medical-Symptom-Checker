import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get("/user/profile");
          setUser(res.data);
        } catch (error) {
          console.log("Failed to fetch user");
        }
      }
    };

    fetchUser();
  }, [token]);

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

        {user?.role === "admin" && <Link to="/admin/users">Admin Dashboard</Link>}

        {!isAuthPage && token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/analysis">Analyze</Link>
            <Link to="/history">History</Link>
            <Link to="/profile">Profile</Link>

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
