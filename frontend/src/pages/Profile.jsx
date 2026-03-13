import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get("/user/profile");
      setProfile(res.data);
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex justify-center mt-20">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          User Profile
        </h2>
        <div className="space-y-3 text-gray-700">
          <p><span className="font-semibold">Name:</span> {profile.name}</p>
          <p><span className="font-semibold">Email:</span> {profile.email}</p>
          <p><span className="font-semibold">Total Analysis:</span>{" "}{profile.analysis_count}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
