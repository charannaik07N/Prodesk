function HistorySection({
  history,
  isHistoryLoading,
  historyError,
  historyAnnouncement,
  onRefresh,
  onUseHistory,
}) {
  return (
    <section className="panel-quiet rounded-2xl p-5 md:p-6">
      <p className="sr-only" role="status" aria-live="polite">
        {historyAnnouncement}
      </p>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xl text-(--text-strong)">Recent History</h3>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isHistoryLoading}
          className="btn-secondary rounded-xl px-3.5 py-2 text-sm font-semibold active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        >
          {isHistoryLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {historyError ? (
        <div
          className="status-danger rounded-lg px-3 py-2 text-sm"
          role="alert"
        >
          We could not load history right now. Try refresh in a moment.
        </div>
      ) : history.length ? (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onUseHistory(item)}
                className="min-h-11 w-full rounded-xl border border-stone-300 bg-(--surface-main) px-3.5 py-2.5 text-left transition duration-200 ease-out hover:border-stone-500 hover:bg-(--surface-soft) focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 active:translate-y-px motion-reduce:transition-none"
                title={`${item.jobRole} at ${item.companyName}`}
              >
                <strong className="block wrap-break-word text-sm text-(--text-strong)">
                  {item.jobRole} at {item.companyName}
                </strong>
                <span className="block wrap-break-word text-sm text-(--text-muted)">
                  {item.candidateName} | {item.tone} |{" "}
                  {item.atsMode ? "ATS" : "Natural"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-(--text-muted)">
          {isHistoryLoading
            ? "Loading history..."
            : "No saved cover letters yet. Generate your first one, or add MONGODB_URI to persist history."}
        </p>
      )}
    </section>
  );
}

export default HistorySection;
