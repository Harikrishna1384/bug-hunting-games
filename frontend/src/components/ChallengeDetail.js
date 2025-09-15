import React, { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

const ChallengeDetail = ({ token, challengeId, onBack, onPointsUpdate }) => {
  const [challenge, setChallenge] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBuggy, setLoadingBuggy] = useState(false);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const defaultCodeRef = useRef("");

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:5000/api/challenges/${challengeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setChallenge(data);
          defaultCodeRef.current = data.defaultCode || "";
          setUserCode(data.defaultCode || "");
        } else {
          setError(data.message || "Failed to load challenge");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId, token]);

  const handleValidate = async () => {
    setValidating(true);
    setValidationMessage("");
    try {
      const response = await fetch(`http://localhost:5000/api/challenges/${challengeId}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userCode }),
      });
      const data = await response.json();
      setValidationMessage(data.message || "");
      if (data.pointsAwarded && onPointsUpdate) {
        onPointsUpdate(data.totalPoints);
      }
    } catch {
      setValidationMessage("Network error during validation");
    } finally {
      setValidating(false);
    }
  };

  const handleGenerateBuggyCode = async () => {
  if (!challenge?.correctCode || !challenge?.errorType) {
    setValidationMessage("Challenge data incomplete for generating buggy code.");
    return;
  }

  setLoadingBuggy(true);
  setValidationMessage("");

  try {
    const response = await fetch("http://localhost:5001/generate-bug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Remove Authorization header since your current backend doesn't require it
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        correctCode: challenge.correctCode,
        errorType: challenge.errorType,
      }),
    });

    const data = await response.json();

    if (response.ok && data.buggyCode) {
      setUserCode(data.buggyCode);
      setValidationMessage("Buggy code generated successfully.");
    } else {
      setValidationMessage(data.error || data.message || "Failed to generate buggy code");
    }
  } catch (error) {
    console.error("Error generating buggy code:", error);
    setValidationMessage("Network error while generating buggy code");
  } finally {
    setLoadingBuggy(false);
  }
};


  if (loading) return <p>Loading challenge...</p>;

  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={onBack}>Back to List</button>
      </div>
    );

  if (!challenge) return null;

  return (
    <div>
      <button onClick={onBack}>Back to List</button>
      <h2>{challenge.title}</h2>
      <p>
        <b>Category:</b> {challenge.category || "-"} &nbsp; | &nbsp;
        <b>Error Type:</b> {challenge.errorType || "-"}
      </p>
      <p>{challenge.description}</p>
      {challenge.hints && challenge.hints.length > 0 && (
        <div>
          <h4>Hints:</h4>
          <ul>
            {challenge.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}
      <h4>Your Code:</h4>
      <AceEditor
        mode="python"
        theme="github"
        onChange={setUserCode}
        value={userCode.replace(/\\n/g, "\n")}
        name="user-code-editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="300px"
        fontSize={14}
        showPrintMargin={true}
        setOptions={{ useWorker: false }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleValidate} disabled={validating || loadingBuggy}>
          {validating ? "Validating..." : "Validate Code"}
        </button>
        <button
          onClick={handleGenerateBuggyCode}
          disabled={loadingBuggy || validating}
          style={{ marginLeft: "10px" }}
        >
          {loadingBuggy ? "Generating Buggy Code..." : "Generate Buggy Code"}
        </button>
        {validationMessage && <p>{validationMessage}</p>}
      </div>
    </div>
  );
};

export default ChallengeDetail;
