import { useEffect, useMemo, useRef, useState } from "react";
import { MovieGrid } from "../components/MovieGrid";
import { SearchPanel } from "../components/SearchPanel";
import { getMoodMatchedTitle } from "../services/ai";
import { getPopularMovies, searchMovieByTitle } from "../services/tmdb";

const dedupeMoviesById = (movies) => {
  const seen = new Set();
  return movies.filter((movie) => {
    if (!movie?.id || seen.has(movie.id)) {
      return false;
    }

    seen.add(movie.id);
    return true;
  });
};

export function DiscoverPage({ favoritesMap, onToggleFavorite }) {
  const [movies, setMovies] = useState([]);
  const [moodText, setMoodText] = useState("");
  const [moodResult, setMoodResult] = useState("");
  const [moodMovie, setMoodMovie] = useState(null);
  const [isMoodLoading, setIsMoodLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sentinelRef = useRef(null);

  const visibleMovies = moodMovie ? [moodMovie] : movies;

  const modeLabel = useMemo(() => {
    if (moodMovie) {
      return "Mood match result";
    }

    return "Popular picks";
  }, [moodMovie]);

  useEffect(() => {
    if (moodMovie) {
      return;
    }

    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError("");
  }, [moodMovie]);

  useEffect(() => {
    if (moodMovie) {
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getPopularMovies(page, controller.signal);

        setMovies((prev) => {
          const incoming = data.results || [];
          return page === 1
            ? dedupeMoviesById(incoming)
            : dedupeMoviesById([...prev, ...incoming]);
        });

        const totalPages = data.total_pages || 1;
        setHasMore(page < totalPages && (data.results?.length || 0) > 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch movies.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [page, moodMovie]);

  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading && !moodMovie) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "1000px 0px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, moodMovie]);

  const handleMoodMatch = async () => {
    setIsMoodLoading(true);
    setError("");

    try {
      const title = await getMoodMatchedTitle(moodText);
      const matchedMovie = await searchMovieByTitle(title);

      if (!matchedMovie) {
        throw new Error("No TMDB result found for the mood-matched title.");
      }

      setMoodResult(title);
      setMoodMovie(matchedMovie);
    } catch (err) {
      setError(err.message || "Mood matcher failed.");
    } finally {
      setIsMoodLoading(false);
    }
  };

  return (
    <main className="pb-20">
      <SearchPanel
        moodText={moodText}
        onMoodTextChange={setMoodText}
        onMoodMatch={handleMoodMatch}
        moodLoading={isMoodLoading}
        moodResult={moodResult}
      />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <section className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 min-[650px]:flex-row min-[650px]:items-end">
          <div className="grid gap-1">
            <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-(--text-soft)">
              Curated feed
            </p>
            <h2 className="m-0 text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold">
              {modeLabel}
            </h2>
          </div>
          <p className="m-0 text-[0.85rem] font-semibold uppercase tracking-[0.2em] text-(--text-soft)">
            {visibleMovies.length} titles loaded
          </p>
        </section>

        {error ? (
          <p className="mt-4 rounded-[1rem] border border-[color-mix(in_oklch,var(--danger)_65%,transparent)] bg-[color-mix(in_oklch,var(--danger)_18%,black)] px-4 py-3 font-semibold text-white">
            {error}
          </p>
        ) : null}

        <MovieGrid
          movies={visibleMovies}
          favoritesMap={favoritesMap}
          onToggleFavorite={onToggleFavorite}
          isLoading={isLoading}
          skeletonCount={12}
        />

        {isLoading ? (
          <p className="mt-6 rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-[0.9rem] font-semibold text-white/80 transition duration-300">
            Loading more picks...
          </p>
        ) : null}
        {!isLoading && !visibleMovies.length && !error ? (
          <section className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-6">
            <h3 className="mb-2 mt-0 text-[1.1rem] font-semibold">
              No movies found
            </h3>
            <p className="m-0 text-(--text-soft)">
              Try a different mood like "excited" or "lonely".
            </p>
          </section>
        ) : null}

        <div ref={sentinelRef} aria-hidden="true" />
      </div>
    </main>
  );
}
