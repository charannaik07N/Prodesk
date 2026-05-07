import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_READ_ACCESS_TOKEN,
} from "../config/env";

const request = async (endpoint, params = {}, signal) => {
  const hasReadToken = Boolean(TMDB_READ_ACCESS_TOKEN);
  const hasApiKey = Boolean(TMDB_API_KEY);

  if (!hasReadToken && !hasApiKey) {
    throw new Error(
      "Missing TMDB credentials. Set VITE_TMDB_READ_ACCESS_TOKEN or VITE_TMDB_API_KEY.",
    );
  }

  const query = new URLSearchParams({ language: "en-US", ...params });
  if (!hasReadToken && hasApiKey) {
    query.set("api_key", TMDB_API_KEY);
  }

  const headers = {};
  if (hasReadToken) {
    headers.Authorization = `Bearer ${TMDB_READ_ACCESS_TOKEN}`;
  }

  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?${query.toString()}`,
    {
      signal,
      headers,
    },
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};

export const getPopularMovies = (page = 1, signal) =>
  request("/movie/popular", { page }, signal);

export const searchMovies = (query, page = 1, signal) =>
  request("/search/movie", { query, page, include_adult: false }, signal);

export const searchMovieByTitle = async (title, signal) => {
  const data = await searchMovies(title, 1, signal);
  return data.results?.[0] ?? null;
};
