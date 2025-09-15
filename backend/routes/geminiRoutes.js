import express from "express";
import { generateBuggyCode } from "../controllers/geminiController.js";
const router = express.Router();

router.post("/generate-bug", generateBuggyCode);

export default router;
