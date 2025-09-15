import React, { useEffect, useState } from "react";

const Profile = ({ token, onLogout }) => {
  const [profile, setProfile] = useState(null);
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
          setProfile(data);
        } else {
          setError(data.message || "Failed to fetch profile");
          if (response.status === 401) {
            onLogout(); // Token invalid or expired
          }
        }
      } catch {
        setError("Network error");
      }
    };

    fetchProfile();
  }, [token, onLogout]);

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      {profile ? (
        <div>
  <p><strong>Name:</strong> {profile.name}</p>
  <p><strong>Email:</strong> {profile.email}</p>
  <p>
    <strong>Joined:</strong>{" "}
    {profile.createdAt
      ? new Date(profile.createdAt).toLocaleDateString()
      : "N/A"}
  </p>
  <button onClick={onLogout}>Logout</button>
</div>

      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
