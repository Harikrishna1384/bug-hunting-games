import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(20)
      .select("email name points") // select the fields explicitly
      .lean();

    res.json(topUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error fetching leaderboard" });
  }
};
