import React, { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ChallengeList from "./components/ChallengeList";
import ChallengeDetail from "./components/ChallengeDetail";
import Leaderboard from "./components/Leaderboard"; // Import Leaderboard component

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showProfile, setShowProfile] = useState(true);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // Leaderboard view state
  const [points, setPoints] = useState(0);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState("");

  // Fetch user points when token changes (login/logout)
  useEffect(() => {
    if (!token) {
      setPoints(0);
      return;
    }

    const fetchUserPoints = async () => {
      setPointsLoading(true);
      setPointsError("");
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points || 0);
        } else {
          setPointsError(data.message || "Failed to load points");
        }
      } catch {
        setPointsError("Network error while loading points");
      }
      setPointsLoading(false);
    };

    fetchUserPoints();
  }, [token]);

  const handleLogin = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setShowProfile(true);
    setSelectedChallengeId(null);
    setShowLeaderboard(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setShowProfile(false);
    setSelectedChallengeId(null);
    setShowLeaderboard(false);
    setPoints(0);
  };

  const handleSelectChallenge = (id) => {
    setSelectedChallengeId(id);
    setShowProfile(false);
    setShowLeaderboard(false);
  };

  const handleBackToList = () => {
    setSelectedChallengeId(null);
    setShowProfile(false);
    setShowLeaderboard(false);
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
    setSelectedChallengeId(null);
    setShowProfile(false);
  };

  const handleBackFromLeaderboard = () => {
    setShowLeaderboard(false);
  };

  // Callback to update points after user solves a challenge
  const handlePointsUpdate = (newPoints) => {
    setPoints(newPoints);
  };

  const renderMainContent = () => {
    if (showProfile) {
      return <Profile token={token} onLogout={handleLogout} />;
    }
    if (showLeaderboard) {
      return <Leaderboard token={token} onBack={handleBackFromLeaderboard} />;
    }
    if (selectedChallengeId) {
      return (
        <ChallengeDetail
          token={token}
          challengeId={selectedChallengeId}
          onBack={handleBackToList}
          onPointsUpdate={handlePointsUpdate}
        />
      );
    }
    return <ChallengeList token={token} onSelect={handleSelectChallenge} />;
  };

  return (
    <div>
      {!token ? (
        <>
          <Register />
          <hr />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
          <nav style={{ padding: "10px", backgroundColor: "#eee", marginBottom: "10px" }}>
            <button
              onClick={() => {
                setShowProfile(true);
                setSelectedChallengeId(null);
                setShowLeaderboard(false);
              }}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setShowProfile(false);
                setSelectedChallengeId(null);
                setShowLeaderboard(false);
              }}
            >
              Challenges
            </button>
            <button onClick={handleShowLeaderboard}>Leaderboard</button>
            <button onClick={handleLogout}>Logout</button>
            <span style={{ float: "right", fontWeight: "bold" }}>
              Points: {pointsLoading ? "Loading..." : pointsError ? `Error: ${pointsError}` : points}
            </span>
          </nav>
          {renderMainContent()}
        </>
      )}
    </div>
  );
};

export default App;
