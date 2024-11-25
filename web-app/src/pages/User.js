import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../styles/User.module.css";

const User = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  axios.defaults.baseURL = "http://localhost:5002";

  const fetchUserData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setFormData((prev) => ({
        ...prev,
        email: response.data.email,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      await axios.put(
        "/api/user/update",
        {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      fetchUserData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>User Dashboard</h2>

        {error && <div className={styles.error}>{error}</div>}

        {!isEditing ? (
          <div className={styles.infoSection}>
            <p className={styles.info}>
              <strong>Email:</strong> {user?.email}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.primaryButton}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              required
            />

            <label htmlFor="currentPassword" className={styles.label}>
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={styles.input}
              required
            />

            <label htmlFor="newPassword" className={styles.label}>
              New Password (optional)
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={styles.input}
            />

            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              disabled={!formData.newPassword}
            />

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.primaryButton}>
                Save Changes
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }));
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default User;
