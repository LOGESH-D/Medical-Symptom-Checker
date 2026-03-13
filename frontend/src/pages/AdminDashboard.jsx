import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">All Users</h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded">
                    View
                  </button>

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
