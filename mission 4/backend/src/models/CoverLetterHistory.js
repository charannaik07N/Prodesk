import mongoose from "mongoose";

const coverLetterHistorySchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true },
    jobRole: { type: String, required: true },
    companyName: { type: String, required: true },
    tone: { type: String, required: true },
    atsMode: { type: Boolean, default: false },
    keySkills: { type: String, required: true },
    jobDescription: { type: String, required: true },
    resumeTextExcerpt: { type: String, required: true },
    coverLetter: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CoverLetterHistory =
  mongoose.models.CoverLetterHistory ||
  mongoose.model("CoverLetterHistory", coverLetterHistorySchema);
