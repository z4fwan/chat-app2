import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/users", {
        withCredentials: true, // ✅ important if using cookies for auth
      });
      console.log("Fetched users:", res.data); // ✅ log the response
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch error:", err); // ✅ log the error
      toast.error("Failed to load users");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Error deleting user");
    }
  };

  const toggleBlock = async (id) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/block`);
      fetchUsers();
    } catch {
      toast.error("Error blocking user");
    }
  };

  const toggleVerify = async (id) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/verify`);
      fetchUsers();
    } catch {
      toast.error("Error verifying user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-t">
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.isBlocked ? (
                    <span className="text-red-600">Blocked</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>
                <td className="p-2">
                  {user.isVerified ? (
                    <span className="text-blue-500">✅ Verified</span>
                  ) : (
                    <span className="text-gray-500">❌</span>
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-red-500 px-2 py-1 text-white rounded"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-yellow-500 px-2 py-1 text-white rounded"
                    onClick={() => toggleBlock(user._id)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="bg-blue-500 px-2 py-1 text-white rounded"
                    onClick={() => toggleVerify(user._id)}
                  >
                    {user.isVerified ? "Unverify" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

