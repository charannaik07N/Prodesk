import pdfParse from "pdf-parse";

export async function parseResumeFromBuffer(fileBuffer) {
  const parsed = await pdfParse(fileBuffer);
  const rawText = parsed?.text || "";

  // Collapse noisy whitespace and linebreaks from PDF extraction.
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
