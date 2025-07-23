import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService"; // Adjust the path as necessary
import { Shield, Check, AlertCircle, Loader } from "lucide-react";
import "./UserManagement.css"; // We will create this file next

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promotingId, setPromotingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await apiService.users.getAll();
        setUsers(fetchedUsers);
        setError("");
      } catch (err) {
        setError("Failed to load users. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    if (
      window.confirm("Are you sure you want to promote this user to Admin?")
    ) {
      setPromotingId(userId);
      try {
        const updatedUser = await apiService.users.promote(userId);
        setUsers(users.map((u) => (u.id === userId ? updatedUser.user : u)));
      } catch (err) {
        alert("Failed to promote user: " + err.message);
      } finally {
        setPromotingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="animate-spin" /> Fetching users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle /> {error}
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <h1>User Management</h1>
      <p>
        Promote users to administrators. Admins can approve or reject incidents.
      </p>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <div className="user-role">
              {user.role === "admin" ? (
                <span className="role-admin">
                  <Check /> Admin
                </span>
              ) : (
                <button
                  onClick={() => handlePromote(user.id)}
                  disabled={promotingId === user.id}
                  className="promote-button"
                >
                  {promotingId === user.id ? (
                    <Loader className="animate-spin-fast" size={16} />
                  ) : (
                    <Shield size={16} />
                  )}
                  Promote to Admin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
