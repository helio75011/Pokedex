import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import Home from "./pages/Home";
import "./App.css";

// Code splitting : ces pages sont dans des fichiers séparés, téléchargés seulement
// quand on les ouvre. L'accueil, la première page vue, est chargé tout de suite
const PokeDetails = lazy(() => import("./pages/PokeDetails"));
const AddPoke = lazy(() => import("./pages/AddPoke"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Routes>
      {/* Toutes les pages partagent la même mise en page (menu + contenu) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/poke/:id" element={<PokeDetails />} />
        <Route path="/add" element={<AddPoke />} />
        <Route path="/favoris" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
