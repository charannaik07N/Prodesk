import { MovieCard } from "./MovieCard";

const buildSkeletons = (count) =>
  Array.from({ length: count }, (_, index) => ({ id: `skeleton-${index}` }));

export function MovieGrid({
  movies,
  favoritesMap,
  onToggleFavorite,
  isLoading,
  skeletonCount = 12,
}) {
  const skeletons = isLoading ? buildSkeletons(skeletonCount) : [];

  return (
    <section
      className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      aria-busy={isLoading}
      aria-live="polite"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={Boolean(favoritesMap[movie.id])}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      {skeletons.map((item) => (
        <div
          key={item.id}
          aria-hidden="true"
          className="relative aspect-2/3 overflow-hidden rounded-[1.1rem] border border-white/10 bg-[color-mix(in_oklch,var(--bg-elev)_86%,black)]"
        >
          <div className="absolute inset-0 animate-[skeleton-shimmer_1.4s_ease-in-out_infinite] bg-[linear-gradient(120deg,color-mix(in_oklch,var(--bg-elev)_92%,black),color-mix(in_oklch,var(--bg-soft)_88%,black),color-mix(in_oklch,var(--bg-elev)_92%,black))] bg-[length:200%_200%]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />
        </div>
      ))}
    </section>
  );
}
