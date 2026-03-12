import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex2 = form.email.endsWith("@gmail.com");
    if (!emailRegex2 || !emailRegex1.test(form.email)) {
      alert("Enter a valid email address");
      return;
    }
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.detail);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-96"
      >
        <h2 className="text-xl mb-4">Login</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-3"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-600 text-white w-full py-2">Register</button>
        <span>
          If you have an account,{" "}
          <Link to="/login" className="text-red-600">
            login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Register;
