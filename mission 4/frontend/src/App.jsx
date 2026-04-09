import { useEffect, useMemo, useRef, useState } from "react";
import FormSection from "./components/FormSection";
import HistorySection from "./components/HistorySection";
import OutputSection from "./components/OutputSection";

const initialForm = {
  candidateName: "",
  jobRole: "",
  companyName: "",
  keySkills: "",
  jobDescription: "",
  tone: "formal",
  atsMode: false,
};

const toneOptions = [
  { value: "formal", label: "Formal" },
  { value: "balanced", label: "Balanced" },
  { value: "creative", label: "Creative" },
];

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const [form, setForm] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const [generationAnnouncement, setGenerationAnnouncement] = useState("");
  const [historyAnnouncement, setHistoryAnnouncement] = useState("");
  const [history, setHistory] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const fileInputRef = useRef(null);

  const canSubmit = useMemo(() => {
    return (
      form.candidateName.trim() &&
      form.jobRole.trim() &&
      form.companyName.trim() &&
      form.keySkills.trim() &&
      form.jobDescription.trim() &&
      resumeFile
    );
  }, [form, resumeFile]);

  const renderedParagraphs = useMemo(() => {
    return coverLetter
      .split(/\n{2,}/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [coverLetter]);

  async function fetchHistory() {
    setIsHistoryLoading(true);
    setHistoryError("");
    setHistoryAnnouncement("Loading generation history.");

    try {
      const response = await fetch(`${apiBaseUrl}/api/history`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load generation history.");
      }

      setHistory(Array.isArray(data.history) ? data.history : []);
      setHistoryAnnouncement("Generation history loaded.");
    } catch (requestError) {
      setHistory([]);
      setHistoryError(
        requestError.message || "Could not load generation history.",
      );
      setHistoryAnnouncement("Could not load generation history.");
    } finally {
      setIsHistoryLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setSelectedFile = (file) => {
    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume only.");
      return;
    }

    setResumeFile(file);
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDraggingFile(false);
    const droppedFile = event.dataTransfer.files?.[0] || null;
    setSelectedFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCoverLetter("");
    setMetadata(null);
    setCopyState("idle");
    setGenerationAnnouncement("");

    if (!canSubmit) {
      setError("Please complete all fields and upload your resume PDF.");
      setGenerationAnnouncement(
        "Please complete all fields and upload your resume PDF.",
      );
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, String(value));
    });
    payload.append("resume", resumeFile);

    setIsLoading(true);
    setGenerationAnnouncement("Generating cover letter.");

    try {
      const response = await fetch(`${apiBaseUrl}/api/cover-letter`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter.");
      }

      setCoverLetter(data.coverLetter || "");
      setMetadata(data.metadata || null);
      setGenerationAnnouncement("Cover letter generated successfully.");
      fetchHistory();
    } catch (requestError) {
      setError(requestError.message || "Request failed.");
      setGenerationAnnouncement(
        requestError.message || "Cover letter generation failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopyState("copied");
      setGenerationAnnouncement("Cover letter copied to clipboard.");
      setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
      setGenerationAnnouncement("Copy failed. Try again.");
      setTimeout(() => setCopyState("idle"), 1600);
    }
  };

  const downloadAsPdf = async () => {
    if (!coverLetter || isPdfExporting) return;

    setIsPdfExporting(true);
    setGenerationAnnouncement("Preparing PDF download.");

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 44;
      const printableWidth = pageWidth - margin * 2;

      pdf.setFont("times", "normal");
      pdf.setFontSize(12);

      let cursorY = 56;
      renderedParagraphs.forEach((paragraph) => {
        const lines = pdf.splitTextToSize(paragraph, printableWidth);
        if (cursorY + lines.length * 16 > 790) {
          pdf.addPage();
          cursorY = 56;
        }
        pdf.text(lines, margin, cursorY);
        cursorY += lines.length * 16 + 8;
      });

      pdf.save(`${form.candidateName || "cover-letter"}.pdf`);
      setGenerationAnnouncement("PDF downloaded.");
    } catch {
      setError("Could not generate PDF right now. Please try again.");
      setGenerationAnnouncement("PDF download failed.");
    } finally {
      setIsPdfExporting(false);
    }
  };

  const useHistoryItem = (entry) => {
    setForm((prev) => ({
      ...prev,
      candidateName: entry.candidateName || prev.candidateName,
      jobRole: entry.jobRole || prev.jobRole,
      companyName: entry.companyName || prev.companyName,
      tone: entry.tone || prev.tone,
      atsMode: Boolean(entry.atsMode),
    }));
    setCoverLetter(entry.coverLetter || "");
    setGenerationAnnouncement("Loaded cover letter from history.");
  };

  return (
    <main className="app-shell min-h-screen px-4 py-8 md:px-6 lg:py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
        <FormSection
          form={form}
          toneOptions={toneOptions}
          resumeFile={resumeFile}
          isDraggingFile={isDraggingFile}
          isLoading={isLoading}
          canSubmit={canSubmit}
          error={error}
          generationAnnouncement={generationAnnouncement}
          fileInputRef={fileInputRef}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onFileChange={handleFileChange}
          onFileDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />

        <div className="space-y-4">
          <OutputSection
            metadata={metadata}
            copyState={copyState}
            coverLetter={coverLetter}
            renderedParagraphs={renderedParagraphs}
            isLoading={isLoading}
            isPdfExporting={isPdfExporting}
            generationAnnouncement={generationAnnouncement}
            onCopy={copyToClipboard}
            onDownload={downloadAsPdf}
          />

          <HistorySection
            history={history}
            isHistoryLoading={isHistoryLoading}
            historyError={historyError}
            historyAnnouncement={historyAnnouncement}
            onRefresh={fetchHistory}
            onUseHistory={useHistoryItem}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
