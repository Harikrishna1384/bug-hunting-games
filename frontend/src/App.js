import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ChallengeList from "./components/ChallengeList";
import ChallengeDetail from "./components/ChallengeDetail";
import Leaderboard from "./components/Leaderboard"; // Import Leaderboard component
import ChallengeHome from "./components/ChallengeHome";
import "./App.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [rank, setRank] = useState(""); // Add rank state
  const [showProfile, setShowProfile] = useState(true);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // Leaderboard view state
  const [points, setPoints] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState(0); // New state for challenges solved
  const [activeNav, setActiveNav] = useState("profile"); // default active


  // Fetch user points, rank, and challenges solved when token changes (login/logout)
  useEffect(() => {
    if (!token) {
      setPoints(0);
      setRank("");
      setChallengesSolved(0);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points || 0);
          setRank(data.rank || "");
          setChallengesSolved(data.challengesSolved || 0);
        } else {
          console.error(data.message || "Failed to load profile data");
        }
      } catch {
        console.error("Network error while loading profile data");
      }
    };

    fetchUserProfile();
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
    setRank("");
    setChallengesSolved(0);
    setActiveNav("logout");
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

  const handleProfile = () => {
    setShowProfile(true);
    setSelectedChallengeId(null);
    setShowLeaderboard(false);
    setActiveNav("profile");
  };

  const handleChallenges = () => {
    setShowProfile(false);
    setSelectedChallengeId(null);
    setShowLeaderboard(false);
    setActiveNav("challenges");
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
    setSelectedChallengeId(null);
    setShowProfile(false);
    setActiveNav("leaderboard");
  };

  const handleBackFromLeaderboard = () => {
    setShowLeaderboard(false);
    setShowProfile(true);
    setActiveNav("profile");
  };

  // Callback to update points after user solves a challenge
  const handlePointsUpdate = (newPoints) => {
    setPoints(newPoints);
  };

  const renderMainContent = () => {
    if (showProfile) {
      return (
        <Profile
          token={token}
          rank={rank} // Pass rank as a prop to Profile
          points={points}
          challengesSolved={challengesSolved}
          onLogout={handleLogout}
        />
      );
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
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              !token ? (
                <Login onLogin={handleLogin} />
              ) : (
                <>
                  <nav className="simple-navbar">
                    <span className="navbar-title">Bug Hunting Games</span>
                    <div className="navbar-buttons">
                      <button
                        className={`nav-btn${
                          activeNav === "profile" ? " active" : ""
                        }`}
                        onClick={handleProfile}
                      >
                        Profile
                      </button>
                      <button
                        className={`nav-btn${
                          activeNav === "challenges" ? " active" : ""
                        }`}
                        onClick={handleChallenges}
                      >
                        Challenges
                      </button>
                      <button
                        className={`nav-btn${
                          activeNav === "leaderboard" ? " active" : ""
                        }`}
                        onClick={handleShowLeaderboard}
                      >
                        Leaderboard
                      </button>
                      <button
                        className={`nav-btn${
                          activeNav === "logout" ? " active" : ""
                        }`}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </nav>
                  {renderMainContent()}
                </>
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<ChallengeHome />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
