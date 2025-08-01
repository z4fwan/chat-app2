import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const AdminPanel = () => {
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    try {
      await axiosInstance.put(`/admin/block/${id}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (err) {
      alert("Error toggling block status");
    }
  };

  const toggleVerify = async (id) => {
    try {
      await axiosInstance.put(`/admin/verify/${id}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isVerified: !user.isVerified } : user
        )
      );
    } catch (err) {
      alert("Error toggling verification");
    }
  };

  const deleteUser = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      await axiosInstance.delete(`/admin/delete/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      alert("Error deleting user");
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="pt-20 max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Blocked</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>@{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${user.isBlocked ? "badge-error" : "badge-success"}`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${user.isVerified ? "badge-primary" : ""}`}
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => toggleBlock(user._id)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => toggleVerify(user._id)}
                  >
                    {user.isVerified ? "Unverify" : "Verify"}
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteUser(user._id)}
                  >
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
};

export default AdminPanel;
