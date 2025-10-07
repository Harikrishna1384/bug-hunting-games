import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

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
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">
        <span role="img" aria-label="trophy">🏆</span> Leaderboard
      </h1>
      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>USERNAME</th>
              <th>POINTS</th>
              <th>CHALLENGES COMPLETED</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id || user.email}>
                <td>#{idx + 1}</td>
                <td><b>{user.username || user.name || user.email.split("@")[0]}</b></td>
                <td><b>{user.points}</b></td>
                <td>
                  {/* Use the same field as profile page */}
                  {user.challengesSolved !== undefined
                    ? user.challengesSolved
                    : user.solvedChallenges !== undefined
                    ? user.solvedChallenges.length
                    : user.challenges && Array.isArray(user.challenges)
                    ? user.challenges.length
                    : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
