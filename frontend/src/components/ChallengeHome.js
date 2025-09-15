import React, { useState, useEffect } from "react";

const ChallengeHome = ({ token, onSelectChallenge }) => {
  const [category, setCategory] = useState(null); // "software" or "hardware"
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/api/challenges?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load challenges");
        setLoading(false);
      });
  }, [category, token]);

  return (
    <div>
      <h2>Challenges</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setCategory("software")}>Software Errors</button>
        <button onClick={() => setCategory("hardware")}>Hardware Errors</button>
      </div>

      {!category && <p>Please select a category.</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Loading challenges...</p>}

      {!loading && category && (
        <ul>
          {challenges.length === 0 && <li>No challenges found.</li>}
          {challenges.map((challenge) => (
            <li
              key={challenge._id}
              style={{ cursor: "pointer", margin: "8px 0" }}
              onClick={() => onSelectChallenge(challenge._id)}
            >
              {challenge.title} [{challenge.errorType}]
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChallengeHome;
