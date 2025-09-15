import React, { useEffect, useState } from "react";

const Leaderboard = ({ token, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Leaderboard data:", data); // Debug log
          setUsers(data);
        } else {
          setError(data.message || "Failed to fetch leaderboard");
        }
      } catch {
        setError("Network error");
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={onBack}>Back</button>
      </div>
    );

  return (
    <div>
      <h2>Leaderboard - Top 20 Users</h2>
      <button onClick={onBack}>Back</button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc" }}>Rank</th>
            <th style={{ borderBottom: "1px solid #ccc" }}>Email</th>
            <th style={{ borderBottom: "1px solid #ccc" }}>Name</th>
            <th style={{ borderBottom: "1px solid #ccc" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{index + 1}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{user.email || "-"}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{user.name || "-"}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Leaderboard;
