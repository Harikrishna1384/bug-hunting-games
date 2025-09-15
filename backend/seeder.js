import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "./models/Challenge.js";

dotenv.config();

const challenges = [
  {
    title: "Fix the Missing Colon",
    description: "Debug the code. There's a syntax error.",
    category: "software",
    errorType: "syntax error",
    difficulty: "easy",
    buggyCodes: ["a, b = map(int, input().split())\nnprint(a + b)"],
    correctCode: "def add(a, b):\n  return a + b",
    testCases: [{ input: "1 2", expectedOutput: "3" }],
  },
  {
    title: "Validate IoT Temperature Data",
    description:
      "An IoT device sends temperature readings every minute. Sometimes, sensor errors cause temperatures far outside the physical range (like -100°C or 999°C) to be sent. Fix the code to discard any temperature outside the range -40 to 85°C before saving to database.",
    category: "hardware",
    errorType: "validation error",
    difficulty: "easy",
    buggyCodes: [
      `reading = int(input())
# Bug: No validation, accepts any reading
print("saved")`,
    ],
    correctCode: `reading = int(input())
if reading < -40 or reading > 85:
    print("Error: out of range")
else:
    print("saved")`,
    testCases: [
      { input: 24, expectedOutput: "saved" },
      { input: -100, expectedOutput: "Error: out of range" },
      { input: 90, expectedOutput: "Error: out of range" },
    ],
  },
  // Add other challenges similarly ...
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Only affect challenges collection, leave users untouched
    await Challenge.deleteMany();
    await Challenge.insertMany(challenges);
    console.log("Challenges seeded successfully.");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
