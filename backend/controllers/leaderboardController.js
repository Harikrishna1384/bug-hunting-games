import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ points: -1 })
      .limit(20)
      .select("username email points challengesSolved solvedChallenges challenges"); // Add all possible fields

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};
