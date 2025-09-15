import axios from "axios";
import Challenge from "../models/Challenge.js";
import User from "../models/User.js";

// Fetch all challenges, with optional category filter, without revealing correctCode
export const getChallenges = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    // Do not send correctCode for challenge list view
    const challenges = await Challenge.find(filter).select("-correctCode");
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ message: "Error fetching challenges" });
  }
};

// Fetch individual challenge by ID, include default code and user latest submission
export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).lean();
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const userId = req.user._id.toString();

    // Include latest user submission if available
    if (challenge.userSubmissions && challenge.userSubmissions.length > 0) {
      const submissions = challenge.userSubmissions.filter(
        (s) => s.userId.toString() === userId
      );
      if (submissions.length > 0) {
        challenge.latestUserCode = submissions[submissions.length - 1].code;
      }
    }

    // Remove user submissions to protect privacy
    delete challenge.userSubmissions;

    // Select defaultCode prioritizing buggyCodes, latest user code, then correctCode
    if (challenge.buggyCodes && challenge.buggyCodes.length > 0) {
      challenge.defaultCode = challenge.buggyCodes[0];
    } else if (challenge.latestUserCode) {
      challenge.defaultCode = challenge.latestUserCode;
    } else {
      challenge.defaultCode = challenge.correctCode || "";
    }

    // Ensure buggyCodes is always an array
    challenge.buggyCodes = challenge.buggyCodes || [];

    // Important: include correctCode and errorType for Gemini AI usage
    // If you want to hide correctCode from frontend for security, do not delete this line
    // Here we include them as is:
    challenge.correctCode = challenge.correctCode || "";
    challenge.errorType = challenge.errorType || "";

    res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ message: "Error fetching challenge" });
  }
};

// Validate submitted userCode against challenge test cases
export const validateUserCode = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { userCode } = req.body;

  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    if (!challenge.testCases || challenge.testCases.length === 0) {
      return res.status(400).json({ message: "No test cases defined for this challenge" });
    }

    // Run code using Piston API
    const engine = "python3";
    const version = "3.10.0";

    const runCode = async (code, input) => {
      try {
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: engine,
            version,
            files: [{ name: "main.py", content: code }],
            stdin: input,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        return response.data.run?.stdout?.trim() || "";
      } catch (error) {
        console.error("Piston API error:", error.response?.data || error.message);
        throw error;
      }
    };

    // Validate userCode for each test case
    for (const testCase of challenge.testCases) {
      const output = await runCode(userCode, testCase.input);
      if (output.trim() !== testCase.expectedOutput.trim()) {
        return res.json({
          isCorrect: false,
          message: `Failed test case: input (${testCase.input}) produced output (${output}), expected (${testCase.expectedOutput})`,
          pointsAwarded: 0,
        });
      }
    }

    // Find user and update points if first solve
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.solvedChallenges = user.solvedChallenges || [];
    const alreadySolved = user.solvedChallenges.some(
      (sc) => sc.challengeId.toString() === id
    );

    if (alreadySolved) {
      return res.json({
        isCorrect: true,
        message: "Correct! You already earned points for this challenge.",
        pointsAwarded: 0,
      });
    }

    const pointsMap = { easy: 10, medium: 20, hard: 30 };
    const pointsEarned = pointsMap[challenge.difficulty] || 10;

    user.points = (user.points || 0) + pointsEarned;
    user.solvedChallenges.push({ challengeId: id, solvedAt: new Date() });
    await user.save();

    res.json({
      isCorrect: true,
      message: `Correct! You passed all test cases and earned ${pointsEarned} points.`,
      pointsAwarded: pointsEarned,
      totalPoints: user.points,
    });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({ message: "Server error during validation." });
  }
};
