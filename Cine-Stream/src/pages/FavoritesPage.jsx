import { Link } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";

export function FavoritesPage({ favorites, favoritesMap, onToggleFavorite }) {
  return (
    <main className="pb-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 min-[650px]:flex-row min-[650px]:items-end">
          <div className="grid gap-1">
            <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-(--text-soft)">
              Your queue
            </p>
            <h2 className="m-0 text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold">
              My List
            </h2>
          </div>
          <p className="m-0 text-[0.85rem] font-semibold uppercase tracking-[0.2em] text-(--text-soft)">
            Saved locally in your browser.
          </p>
        </div>

        {!favorites.length ? (
          <section className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-6">
            <h3 className="mb-2 mt-0 text-[1.1rem] font-semibold">
              No favorites yet
            </h3>
            <p className="m-0 text-(--text-soft)">
              Tap the heart on any movie to build your watch list.
            </p>
            <Link
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-white/80 transition duration-200 hover:border-white/40 hover:text-white"
              to="/"
            >
              Browse movies
            </Link>
          </section>
        ) : (
          <MovieGrid
            movies={favorites}
            favoritesMap={favoritesMap}
            onToggleFavorite={onToggleFavorite}
          />
        )}
      </div>
    </main>
  );
}
