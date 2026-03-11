import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-300">
      <h1 className="text-4xl font-bold mb-4">AI Medical Symptom Checker</h1>
      <p className="mb-6">
        Analyze symptoms and find nearby hospitals instantly
      </p>
      <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded">
        Get Started
      </Link>
    </div>
  );
}

export default Landing;
