import React, { useEffect, useState } from "react";
import "./ChallengeList.css";

const categories = [
  { key: "software", label: "Software Bugs", icon: "💻" },
  { key: "hardware", label: "Hardware/IoT Bugs", icon: "🔧" },
];

const ChallengeList = ({ token, onSelect }) => {
  const [category, setCategory] = useState("software");
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
    <div className="challenge-list-container">
      <div className="challenge-header-row">
        <span className="challenge-trophy" role="img" aria-label="trophy">🏆</span>
        <span className="challenge-header-title">Coding Challenges</span>
      </div>
      <div className="challenge-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`challenge-tab${category === cat.key ? " active" : ""}`}
            onClick={() => setCategory(cat.key)}
          >
            <span className="tab-icon">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading challenges...</p>}

      {!loading && category && (
        <div className="challenge-cards">
          {challenges.map((challenge) => (
            <div className="challenge-card" key={challenge._id}>
              <div className="challenge-card-header">
                <h3>{challenge.title}</h3>
                <span className={`difficulty ${challenge.difficulty ? challenge.difficulty.toUpperCase() : ""}`}>
                  {challenge.difficulty ? challenge.difficulty.toUpperCase() : ""}
                </span>
              </div>
              <div className="challenge-desc">{challenge.description}</div>
              <div className="challenge-card-footer">
                <span className="challenge-points">
                  <span role="img" aria-label="star">⭐</span> 
                  {challenge.points || 
                    (challenge.difficulty === "easy" ? 10 : 
                     challenge.difficulty === "medium" ? 20 : 
                     challenge.difficulty === "hard" ? 30 : 0)
                  } pts
                </span>
                <button className="solve-btn" onClick={() => onSelect(challenge._id)}>
                  Solve Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeList;
