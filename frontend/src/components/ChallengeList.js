import React, { useEffect, useState } from "react";

const ChallengeList = ({ token, onSelect }) => {
  const [category, setCategory] = useState(null); // "software" or "hardware"
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) {
      setChallenges([]);
      return;
    }

    const fetchChallenges = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:5000/api/challenges?category=${category}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setChallenges(data);
        } else {
          setError(data.message || "Failed to load challenges");
          setChallenges([]);
        }
      } catch {
        setError("Network error");
        setChallenges([]);
      }
      setLoading(false);
    };

    fetchChallenges();
  }, [category, token]);

  return (
    <div>
      <h2>Challenges</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setCategory("software")}>Software Errors</button>
        <button onClick={() => setCategory("hardware")}>Hardware Errors</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!category && <p>Please select a category.</p>}

      {loading && <p>Loading challenges...</p>}

      {!loading && category && (
        <>
          {challenges.length === 0 ? (
            <p>No challenges found for {category}.</p>
          ) : (
            <ul>
              {challenges.map((challenge) => (
                <li
                  key={challenge._id}
                  style={{ cursor: "pointer", marginBottom: 10 }}
                  onClick={() => onSelect(challenge._id)}
                >
                  <strong>{challenge.title}</strong> - {challenge.description}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ChallengeList;
