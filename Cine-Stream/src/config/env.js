const requiredVar = (name) => import.meta.env[name] || "";

export const TMDB_API_KEY = requiredVar("VITE_TMDB_API_KEY");
export const TMDB_READ_ACCESS_TOKEN = requiredVar(
  "VITE_TMDB_READ_ACCESS_TOKEN",
);
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
