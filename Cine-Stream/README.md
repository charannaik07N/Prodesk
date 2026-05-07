# Cine-Stream (Level 3)

A React + Vite movie discovery app using TMDB, with:

- Popular movies grid
- Debounced search (500ms)
- Infinite scroll pagination
- Favorites route with LocalStorage persistence
- Native lazy-loaded posters
- AI Mood Matcher (Groq)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill your keys.

3. Start dev server:

```bash
npm run dev
```

## Environment Variables

Required:

- `VITE_TMDB_API_KEY`
- `VITE_GROQ_API_KEY` (local dev)
- `GROQ_API_KEY` (Vercel API)

Optional:

- `VITE_TMDB_READ_ACCESS_TOKEN`
- `VITE_GROQ_MODEL`
- `GROQ_MODEL`

## Folder Structure

```text
src/
	components/
		MovieCard.jsx
		MovieGrid.jsx
		SearchPanel.jsx
	config/
		env.js
	hooks/
		useDebounce.js
		useLocalStorage.js
	pages/
		DiscoverPage.jsx
		FavoritesPage.jsx
	services/
		ai.js
		tmdb.js
	App.css
	App.jsx
	index.css
	main.jsx
```

## How It Works

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in your keys.

Required:

- `VITE_TMDB_API_KEY` or `VITE_TMDB_READ_ACCESS_TOKEN`
- `VITE_GROQ_API_KEY` (for Mood Matcher)

Optional:

- `VITE_GROQ_MODEL`

3. Start the dev servers:

```bash
npm run dev
```

For Mood Matcher (Groq), also run:

```bash
npm run dev:api
```

## Vercel Deployment

1. Import the repo into Vercel.
2. Framework preset: Vite (build command `npm run build`, output `dist`).
3. Add environment variables in Vercel:
   - `VITE_TMDB_API_KEY`
   - `VITE_TMDB_READ_ACCESS_TOKEN` (optional)
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (optional)
4. Deploy. The Groq API runs as a serverless function at `/api/groq` from `api/groq.js`.

### App Flow

#### App Entry + Routing

- `src/main.jsx` bootstraps React and renders `App` into `#root`.
- `src/App.jsx` sets up routes and favorites state.
  - `/` -> Discover page
  - `/favorites` -> Favorites page
  - `*` -> redirect to `/`
- Favorites are persisted via `useLocalStorage`.

#### Discover Page

File: `src/pages/DiscoverPage.jsx`

- Shows popular movies by default.
- Debounced search (500ms) uses `useDebounce` so the API is not called on every keystroke.
- Infinite scroll loads more movies when the sentinel comes into view.
- Mood Matcher calls Groq, gets a title, then searches TMDB for the closest match.

#### Favorites Page

File: `src/pages/FavoritesPage.jsx`

- Displays saved movies from LocalStorage.
- Empty state prompts the user to return to Discover.

#### Components

- `MovieCard.jsx`: poster, title, year, rating, and favorite toggle.
- `MovieGrid.jsx`: responsive grid layout for cards.
- `SearchPanel.jsx`: search input, mood prompt, and top navigation.

#### Hooks

- `useDebounce.js`: delays search input updates by 500ms.
- `useLocalStorage.js`: persists favorites in the browser.

#### Services

- `services/tmdb.js` handles TMDB API requests and paging.
- `services/ai.js` calls the local Groq proxy for Mood Matcher.

#### Groq Proxy (Mood Matcher)

File: `server/index.js`

- Runs a lightweight Node HTTP server at `http://localhost:8787`.
- Accepts POST `/api/groq` with `{ prompt }`.
- Calls Groq, returns a single movie title, and caches results for 10 minutes.

### How Search + Infinite Scroll Work

1. User types in the search box.
2. `useDebounce` waits 500ms and updates the query.
3. TMDB is called with `searchMovies` or `getPopularMovies`.
4. Results are deduped by ID and appended.
5. IntersectionObserver increments the page when the sentinel is visible.

### How Mood Matcher Works

1. User enters a mood prompt.
2. Frontend POSTs `/api/groq` with the prompt.
3. Groq returns a single movie title.
4. TMDB search resolves that title to the first matching movie.
5. The UI switches to the mood match result.
