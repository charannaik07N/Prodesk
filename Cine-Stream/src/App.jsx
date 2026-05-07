import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FavoritesPage } from "./pages/FavoritesPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useLocalStorage(
    "cine_stream_favorites_v1",
    [],
  );

  const favoritesMap = useMemo(
    () => Object.fromEntries(favorites.map((movie) => [movie.id, true])),
    [favorites],
  );

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== movie.id);
      }

      return [movie, ...prev];
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DiscoverPage
              favoritesMap={favoritesMap}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              favoritesMap={favoritesMap}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
