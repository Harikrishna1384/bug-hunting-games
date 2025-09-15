import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app;
