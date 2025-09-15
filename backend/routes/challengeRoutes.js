import express from "express";
import {
  getChallenges,
  getChallengeById,
  validateUserCode,
} from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getChallenges);
router.get("/:id", protect, getChallengeById);
router.post("/:id/validate", protect, validateUserCode);

export default router;
