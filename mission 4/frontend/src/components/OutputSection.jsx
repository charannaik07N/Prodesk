function OutputSection({
  metadata,
  copyState,
  coverLetter,
  renderedParagraphs,
  isLoading,
  isPdfExporting,
  generationAnnouncement,
  onCopy,
  onDownload,
}) {
  return (
    <section className="panel-feature rounded-2xl p-5 md:p-6">
      <p className="sr-only" role="status" aria-live="polite">
        {generationAnnouncement}
      </p>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl text-(--text-strong)">Generated Letter</h2>
          {metadata ? (
            <p className="mt-1 wrap-break-word text-sm font-medium text-(--text-muted)">
              Tone: {metadata.tone} | ATS: {metadata.atsMode ? "On" : "Off"}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <button
            type="button"
            onClick={onCopy}
            disabled={!coverLetter}
            className="btn-secondary rounded-xl px-3.5 py-2 text-sm font-semibold active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy Failed"
                : "Copy"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!coverLetter || isPdfExporting}
            className="btn-secondary rounded-xl px-3.5 py-2 text-sm font-semibold active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {isPdfExporting ? "Preparing PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div
        className="max-h-[65vh] min-h-88 overflow-auto rounded-xl border border-dashed border-stone-300 bg-(--surface-soft) p-4"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
          </div>
        ) : coverLetter ? (
          renderedParagraphs.map((line, index) => (
            <p
              key={`${line}-${index}`}
              className="mb-4 wrap-break-word text-[15px] leading-7 text-(--text-strong) last:mb-0"
            >
              {line}
            </p>
          ))
        ) : (
          <p className="text-center text-[15px] text-(--text-muted)">
            Your AI-generated cover letter will appear here in well-formatted
            paragraphs.
          </p>
        )}
      </div>
    </section>
  );
}

export default OutputSection;
