import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-bug", async (req, res) => {
  const { correctCode, errorType } = req.body;

  console.log("Received request:", { correctCode, errorType });

  if (!correctCode || !errorType) {
    return res.status(400).json({ error: "Missing correctCode or errorType" });
  }

  const prompt = `
Take the following correct JavaScript code and introduce a bug based on the given error type.
Correct Code:
${correctCode}

Error Type: ${errorType}

Respond only with the buggy code.
`;

  try {
    // ✅ Updated model name to the new stable version
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(prompt);
    const buggyCode = result.response.text();

    console.log("Generated buggy code:", buggyCode);

    if (!buggyCode)
      return res.json({ buggyCode: "// Gemini returned empty, try again" });

    res.json({ buggyCode });
  } catch (err) {
    console.error("Error generating buggy code:", err);
    res.status(500).json({ error: "Failed to generate buggy code" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
