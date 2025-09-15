import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBuggyCode = async (req, res) => {
  try {
    const { correctCode, errorType } = req.body;

    console.log("Received request:", { correctCode, errorType });

    if (!correctCode || !errorType) {
      return res.status(400).json({ error: "Missing correctCode or errorType" });
    }

    const prompt = `
Take the following correct Python code and introduce a bug based on the given error type.
Correct Code:
${correctCode}

Error Type: ${errorType}

Respond only with the buggy code without any markdown, language tags, or extra text.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const buggyCode = result.response.text();

    console.log("Generated buggy code:", buggyCode);

    if (!buggyCode) {
      return res.json({ buggyCode: "// Gemini returned empty, try again" });
    }

    res.json({ buggyCode });
  } catch (err) {
    console.error("Gemini generateBuggyCode error:", err);
    res.status(500).json({ error: "Failed to generate buggy code" });
  }
};
