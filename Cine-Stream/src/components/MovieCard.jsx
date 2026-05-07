import { TMDB_IMAGE_BASE } from "../config/env";

const fallbackPoster =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%23161a24'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23e7d8bf' font-family='sans-serif' font-size='30'%3ENo Poster%3C/text%3E%3C/svg%3E";

const getYear = (date) => (date ? date.slice(0, 4) : "N/A");

export function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const poster = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : fallbackPoster;

  return (
    <article className="group relative overflow-hidden rounded-[1.1rem] border border-white/12 bg-[color-mix(in_oklch,var(--bg-elev)_88%,black)] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.85)] animate-[poster-rise_460ms_ease-out]">
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <button
          type="button"
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-content-center rounded-full border border-white/25 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.8)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklch,var(--accent)_80%,white)] ${
            isFavorite
              ? "bg-[color-mix(in_oklch,var(--accent)_78%,black)]"
              : "bg-black/55 hover:bg-black/75"
          }`}
          onClick={() => onToggleFavorite(movie)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className={`h-4 w-4 stroke-white stroke-[1.8] transition duration-200 ${
              isFavorite ? "fill-white" : "fill-none"
            }`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21.1 10.55 19.8C5.4 15.16 2 12.1 2 8.36A5.39 5.39 0 0 1 7.53 3 6.02 6.02 0 0 1 12 5.1 6.02 6.02 0 0 1 16.47 3 5.39 5.39 0 0 1 22 8.36c0 3.74-3.4 6.8-8.55 11.44L12 21.1Z" />
          </svg>
        </button>

        <img
          src={poster}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="block h-full w-full object-cover bg-[color-mix(in_oklch,var(--bg-soft)_75%,black)] transition duration-300 group-hover:scale-[1.03]"
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_15%,rgba(0,0,0,0.55)_62%,rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 grid gap-2 px-4 pb-4">
          <h3 className="m-0 text-[1rem] font-semibold leading-[1.25] text-white">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-white/70">
            <span>{getYear(movie.release_date)}</span>
            <span className="text-(--gold)">
              {movie.vote_average?.toFixed(1) || "-"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
