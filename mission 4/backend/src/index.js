import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { CoverLetterHistory } from "./models/CoverLetterHistory.js";
import { parseResumeFromBuffer } from "./utils/parseResume.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const envCandidates = [
  path.join(backendRoot, ".env"),
  path.join(backendRoot, "env"),
];
const resolvedEnvPath = envCandidates.find((candidate) =>
  fs.existsSync(candidate),
);

dotenv.config(resolvedEnvPath ? { path: resolvedEnvPath } : undefined);

const app = express();
const port = process.env.PORT || 5000;
const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const fallbackModelName =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-2.0-flash";
const mongoUri = process.env.MONGODB_URI || "";
let isMongoConnected = false;

const toneRuleMap = {
  formal: "Use a formal and executive business tone.",
  balanced: "Use a polished but warm professional tone.",
  creative: "Use a confident and modern tone while remaining professional.",
};

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "2mb" }));

async function connectMongo() {
  if (!mongoUri) {
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log("MongoDB connected for cover letter history.");
  } catch (error) {
    isMongoConnected = false;
    console.warn("MongoDB connection failed, continuing without history.");
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed."));
      return;
    }
    cb(null, true);
  },
});

function buildPrompt({
  candidateName,
  jobRole,
  companyName,
  keySkills,
  jobDescription,
  resumeText,
  tone,
  atsMode,
}) {
  const toneRule = toneRuleMap[tone] || toneRuleMap.formal;

  return `You are an expert career writing assistant.

Write a highly personalized cover letter.

Candidate name: ${candidateName}
Target job role: ${jobRole}
Company name: ${companyName}
Key skills: ${keySkills}
Job description:\n${jobDescription}
Resume content:\n${resumeText}

Requirements:
1. ${toneRule}
2. Keep it concise and impactful, between 260-420 words.
3. Use 3-4 clear paragraphs, each with a distinct purpose.
4. Match candidate resume achievements to job requirements explicitly.
5. Mention at least 2 key skills from the provided list.
6. Mention the company name naturally and personalize motivation.
7. End with a strong closing and sign off using the candidate name.
8. Output plain text only with paragraph breaks.
9. Avoid generic statements and avoid repeating the same points.
10. ${atsMode ? "Optimize wording for ATS keyword relevance while staying human-readable." : "Prioritize natural readability over keyword density."}`;
}

function normalizeLetter(text) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

async function generateCoverLetter(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const runModel = async (targetModelName) => {
    const model = genAI.getGenerativeModel({ model: targetModelName });
    const result = await model.generateContent(prompt);
    const text = result.response?.text?.() || "";

    if (!text.trim()) {
      throw new Error("AI model returned an empty response.");
    }

    return text;
  };

  let text;

  try {
    text = await runModel(modelName);
  } catch (error) {
    const message = String(error?.message || "");
    const canUseFallback =
      fallbackModelName &&
      fallbackModelName !== modelName &&
      (Number(error?.status) === 404 ||
        /not found for API version/i.test(message) ||
        (Number(error?.status) === 429 &&
          /quota exceeded|Too Many Requests/i.test(message)));

    if (!canUseFallback) {
      throw error;
    }

    text = await runModel(fallbackModelName);
  }

  return normalizeLetter(text);
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Mission 4 server is running",
  });
});

app.get("/api/history", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.json({ history: [] });
    }

    const history = await CoverLetterHistory.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({
      history: history.map((item) => ({
        id: item._id,
        candidateName: item.candidateName,
        jobRole: item.jobRole,
        companyName: item.companyName,
        tone: item.tone,
        atsMode: item.atsMode,
        coverLetter: item.coverLetter,
        createdAt: item.createdAt,
      })),
    });
  } catch {
    return res.status(500).json({
      error: "Could not fetch history.",
    });
  }
});

app.post("/api/cover-letter", upload.single("resume"), async (req, res) => {
  try {
    const {
      candidateName,
      jobRole,
      companyName,
      keySkills,
      jobDescription,
      tone = "formal",
      atsMode,
    } = req.body;

    const normalizedTone = String(tone || "formal")
      .trim()
      .toLowerCase();
    const normalizedAtsMode =
      String(atsMode || "false").toLowerCase() === "true";

    if (
      !candidateName ||
      !jobRole ||
      !companyName ||
      !keySkills ||
      !jobDescription
    ) {
      return res.status(400).json({
        error: "All text fields are required.",
      });
    }

    if (!toneRuleMap[normalizedTone]) {
      return res.status(400).json({
        error: "Invalid tone value. Use formal, balanced, or creative.",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({
        error: "Resume PDF is required.",
      });
    }

    const resumeText = await parseResumeFromBuffer(req.file.buffer);

    if (!resumeText) {
      return res.status(400).json({
        error: "Could not extract text from the uploaded PDF.",
      });
    }

    const prompt = buildPrompt({
      candidateName,
      jobRole,
      companyName,
      keySkills,
      jobDescription,
      resumeText,
      tone: normalizedTone,
      atsMode: normalizedAtsMode,
    });

    const coverLetter = await generateCoverLetter(prompt);

    if (isMongoConnected) {
      await CoverLetterHistory.create({
        candidateName,
        jobRole,
        companyName,
        tone: normalizedTone,
        atsMode: normalizedAtsMode,
        keySkills,
        jobDescription,
        resumeTextExcerpt: resumeText.slice(0, 650),
        coverLetter,
      });
    }

    return res.json({
      coverLetter,
      metadata: {
        tone: normalizedTone,
        atsMode: normalizedAtsMode,
        historyEnabled: isMongoConnected,
      },
    });
  } catch (error) {
    const message = String(
      error?.message || "Failed to generate cover letter.",
    );

    if (
      /not found for API version|is not found for API version/i.test(message)
    ) {
      return res.status(400).json({
        error:
          "Configured GEMINI_MODEL is unsupported. Set GEMINI_MODEL=gemini-2.0-flash (or another supported model) in backend .env.",
      });
    }

    const upstreamStatus = Number(error?.status);
    const statusCode = Number.isInteger(upstreamStatus) ? upstreamStatus : 500;

    if (/API key (not valid|expired)|API_KEY_INVALID/i.test(message)) {
      return res.status(401).json({
        error:
          "Invalid or expired GEMINI_API_KEY. Update backend .env with a valid key and restart the backend.",
      });
    }

    if (
      statusCode === 429 ||
      /quota exceeded|Too Many Requests/i.test(message)
    ) {
      return res.status(429).json({
        error:
          "Gemini quota exceeded for this project. Check billing/quota in Google AI Studio and retry later.",
      });
    }

    return res.status(statusCode).json({
      error: message,
    });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err?.message?.includes("Only PDF files are allowed")) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: "Unexpected server error." });
});

connectMongo();

app.listen(port, () => {
  console.log(`Mission 4 server listening on http://localhost:${port}`);
});
