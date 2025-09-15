import mongoose from "mongoose";

const challengeSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    correctCode: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    category: { type: String, enum: ["software", "hardware"], required: true },
    errorType: { type: String, required: true },  // e.g., "syntax error", "logical error"
    userSubmissions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        code: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true }
      }
    ],
    buggyCodes: [String],
  },
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
