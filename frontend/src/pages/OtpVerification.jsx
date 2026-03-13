import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email, password } = location.state;
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/verify-otp", {
        email,
        otp,
      });
      await API.post("/auth/register", {
        name,
        email,
        password,
      });
      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      setTimer(120);
      alert("OTP resent successfully");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={verifyOtp} className="bg-white p-6 shadow rounded w-96">
        <h2 className="text-xl mb-4 font-bold">Verify OTP</h2>
        <p className="mb-3 text-sm">
          Enter the OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="border p-2 w-full mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Verify OTP
        </button>

        <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-sm">Resend OTP in {timer}s</p>
          ) : (
            <button type="button" onClick={resendOtp} className="text-blue-600">
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default OtpVerification;
