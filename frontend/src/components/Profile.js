import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = ({ token, onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setError(data.message || "Failed to fetch profile");
          if (response.status === 401) {
            onLogout();
          }
        }
      } catch {
        setError("Network error");
      }
    };

    fetchProfile();
  }, [token, onLogout]);

  if (!user) return null;

  return (
    <div>
      {error && <p style={{color: "red"}}>{error}</p>}
      <div className="profile-container profile-top">
        <div className="profile-card">
          <div className="profile-avatar">
            <svg height="64" viewBox="0 0 24 24" width="64" fill="#4b3c6e">
              <circle cx="12" cy="8" r="4" />
              <ellipse cx="12" cy="17" rx="7" ry="5" />
            </svg>
          </div>
          <div className="profile-info">
            <h2>{user.name || user.username}</h2>
            <div className="profile-email">{user.email}</div>
            <div className="profile-stats">
              <div>
                <span className="profile-stat-value">{user.points || 0}</span>
                <span className="profile-stat-label">POINTS</span>
              </div>
              <div>
                <span className="profile-stat-value">{user.challengesSolved || 0}</span>
                <span className="profile-stat-label">CHALLENGES</span>
              </div>
              <div>
                <span className="profile-stat-value">#{user.rank || 1}</span>
                <span className="profile-stat-label">RANK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
