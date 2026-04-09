function FormSection({
  form,
  toneOptions,
  resumeFile,
  isDraggingFile,
  isLoading,
  canSubmit,
  error,
  generationAnnouncement,
  fileInputRef,
  onSubmit,
  onChange,
  onFileChange,
  onFileDrop,
  onDragOver,
  onDragLeave,
}) {
  return (
    <section className="panel-main rounded-2xl p-5 md:p-6">
      <p className="sr-only" role="status" aria-live="polite">
        {generationAnnouncement}
      </p>

      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
        Mission 4
      </p>
      <h1 className="mt-2 text-3xl text-(--text-strong) md:text-4xl">
        AI Cover Letter Generator
      </h1>
      <p className="mt-2 text-[15px] leading-6 text-(--text-muted)">
        Upload your resume, paste a job description, and generate a personalized
        letter with Gemini.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-4 space-y-4"
        aria-busy={isLoading}
      >
        <label className="block text-sm font-semibold text-(--text-muted)">
          Candidate Name
          <input
            type="text"
            name="candidateName"
            value={form.candidateName}
            onChange={onChange}
            placeholder="e.g. Charan Nayak"
            className="field-base mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm motion-reduce:transition-none"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-(--text-muted)">
            Job Role
            <input
              type="text"
              name="jobRole"
              value={form.jobRole}
              onChange={onChange}
              placeholder="Frontend Developer Intern"
              className="field-base mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm motion-reduce:transition-none"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-(--text-muted)">
            Company Name
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={onChange}
              placeholder="Prodesk IT"
              className="field-base mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm motion-reduce:transition-none"
              required
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-(--text-muted)">
          Key Skills (comma separated)
          <input
            type="text"
            name="keySkills"
            value={form.keySkills}
            onChange={onChange}
            placeholder="React, JavaScript, Tailwind CSS, REST APIs"
            className="field-base mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm motion-reduce:transition-none"
            required
          />
        </label>

        <label className="block text-sm font-semibold text-(--text-muted)">
          Job Description
          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={onChange}
            placeholder="Paste the full job description here..."
            rows={7}
            className="field-base mt-1 w-full resize-y rounded-xl px-3.5 py-2.5 text-sm motion-reduce:transition-none"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-(--text-muted)">
            Tone
            <select
              name="tone"
              value={form.tone}
              onChange={onChange}
              className="field-base mt-1 w-full rounded-xl px-3.5 py-2.5 text-sm motion-reduce:transition-none"
              required
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field-base flex min-h-11 flex-col rounded-xl px-3.5 py-2.5 text-sm font-semibold text-(--text-muted)">
            ATS Friendly Mode
            <input
              type="checkbox"
              name="atsMode"
              checked={form.atsMode}
              onChange={onChange}
              className="mt-2 h-4 w-4 accent-stone-700"
            />
            <span className="mt-2 text-sm font-medium text-(--text-muted)">
              Increase keyword matching against job requirements.
            </span>
          </label>
        </div>

        <label
          onDrop={onFileDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`block rounded-xl border-2 border-dashed p-3 text-sm font-semibold transition duration-200 ease-out motion-reduce:transition-none ${
            isDraggingFile
              ? "border-stone-700 bg-stone-100"
              : "border-stone-300 bg-(--surface-soft)"
          }`}
        >
          Upload Resume (PDF) - click or drag and drop
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            aria-describedby="resume-file-name"
            className="mt-2 block w-full text-sm text-(--text-muted) file:mr-3 file:min-h-11 file:rounded-lg file:border file:border-stone-300 file:bg-(--surface-main) file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-(--text-strong) hover:file:bg-(--surface-soft)"
            required
          />
          <span
            id="resume-file-name"
            className="mt-2 block break-all text-sm font-medium text-(--text-muted)"
          >
            {resumeFile ? resumeFile.name : "No file selected"}
          </span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isLoading}
          className="btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold active:translate-y-px disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transition-none"
        >
          {isLoading
            ? "Generating your personalized cover letter..."
            : "Generate Cover Letter"}
        </button>

        {error ? (
          <p
            className="status-danger rounded-lg px-3 py-2 text-sm font-medium"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default FormSection;
