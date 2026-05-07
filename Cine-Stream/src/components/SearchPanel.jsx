import { Link, useLocation } from "react-router-dom";

export function SearchPanel({
  moodText,
  onMoodTextChange,
  onMoodMatch,
  moodLoading,
  moodResult,
}) {
  const location = useLocation();
  const baseNavClass =
    "rounded-full border px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.2em] transition duration-200";

  return (
    <header className="mb-12 animate-[fade-slide_520ms_ease-out]">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[color-mix(in_oklch,var(--bg-elev)_94%,black)] p-6 sm:p-10">
          <div className="relative z-10 flex flex-col gap-10">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--accent)_75%,black)] text-[0.9rem] font-extrabold tracking-[0.2em] text-white">
                  CS
                </div>
                <div className="grid gap-1">
                  <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.36em] text-(--text-soft)">
                    Cine-Stream
                  </p>
                  <p className="m-0 text-[0.85rem] text-(--text-soft)">
                    Cinematic, editorial, premium.
                  </p>
                </div>
              </div>
              <nav className="flex flex-wrap gap-3" aria-label="Main">
                <Link
                  className={`${baseNavClass} ${
                    location.pathname === "/"
                      ? "border-[color-mix(in_oklch,var(--accent)_80%,white)] bg-[color-mix(in_oklch,var(--accent)_22%,transparent)] text-white"
                      : "border-white/20 text-(--text-soft) hover:border-white/40 hover:text-white"
                  }`}
                  to="/"
                >
                  Discover
                </Link>
                <Link
                  className={`${baseNavClass} ${
                    location.pathname === "/favorites"
                      ? "border-[color-mix(in_oklch,var(--accent)_80%,white)] bg-[color-mix(in_oklch,var(--accent)_22%,transparent)] text-white"
                      : "border-white/20 text-(--text-soft) hover:border-white/40 hover:text-white"
                  }`}
                  to="/favorites"
                >
                  Favorites
                </Link>
              </nav>
            </div>

            <div className="mx-auto grid w-full max-w-[720px] gap-6 text-center">
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[color-mix(in_oklch,var(--accent)_70%,white)]">
                Mood-first discovery
              </p>
              <h1 className="m-0 font-['Bebas_Neue',fantasy] text-[clamp(3rem,7vw,4.6rem)] font-black leading-[0.95] tracking-[0.08em]">
                Tell us your mood. We'll find the movie.
              </h1>
              <p className="m-0 text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-[color-mix(in_oklch,var(--text-soft)_85%,white)]">
                One input, zero guessing. Describe how you feel and get an
                instant, premium recommendation.
              </p>

              <form
                className="mx-auto grid w-full max-w-[620px] gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  onMoodMatch();
                }}
              >
                <label className="sr-only" htmlFor="mood-input">
                  Tell us your mood
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[1.05rem] text-slate-500">
                    🔍
                  </span>
                  <input
                    id="mood-input"
                    className="h-[3.25rem] w-full rounded-[1rem] border border-[#e5e7eb] bg-white px-12 text-[1rem] font-medium text-slate-900 placeholder:text-slate-500 focus:border-[#b91c1c] focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/20"
                    type="text"
                    value={moodText}
                    onChange={(event) => onMoodTextChange(event.target.value)}
                    placeholder="How are you feeling? (e.g., sad, happy, bored)"
                  />
                </div>
                <button
                  className="h-[3.25rem] w-full cursor-pointer rounded-[1rem] border border-transparent bg-[#b91c1c] text-[0.95rem] font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_-28px_rgba(0,0,0,0.85)] transition duration-200 hover:-translate-y-px hover:bg-[#a31616] active:translate-y-0.5 active:bg-[#991313] disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={moodLoading}
                >
                  {moodLoading ? "Finding movies..." : "Find Movies"}
                </button>
              </form>

              {moodLoading ? (
                <p className="m-0 text-[0.9rem] font-semibold text-[color-mix(in_oklch,var(--text-soft)_85%,white)]">
                  Finding movies for your mood...
                </p>
              ) : null}

              {moodResult ? (
                <div className="animate-[mood-pop_360ms_ease-out] rounded-[1rem] border border-[color-mix(in_oklch,var(--accent)_55%,transparent)] bg-[color-mix(in_oklch,var(--accent)_18%,black)] px-4 py-3 text-[0.95rem] font-semibold text-white">
                  Recommendation:{" "}
                  <span className="text-(--gold)">{moodResult}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </header>
  );
}
