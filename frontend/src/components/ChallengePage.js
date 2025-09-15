import React, { useState } from "react";
import ChallengeHome from "./ChallengeHome";
import ChallengeDetail from "./ChallengeDetail";

const ChallengesPage = ({ token }) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);

  const handleSelectChallenge = (challengeId) => {
    setSelectedChallengeId(challengeId);
  };

  const handleBackToList = () => {
    setSelectedChallengeId(null);
  };

  return (
    <div>
      {!selectedChallengeId ? (
        <ChallengeHome token={token} onSelectChallenge={handleSelectChallenge} />
      ) : (
        <ChallengeDetail
          token={token}
          challengeId={selectedChallengeId}
          onBack={handleBackToList}
          onPointsUpdate={(points) => {
            // Handle points update globally if needed
          }}
        />
      )}
    </div>
  );
};

export default ChallengesPage;
