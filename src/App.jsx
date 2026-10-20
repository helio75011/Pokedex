import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PokeDetails from "./pages/PokeDetails";
import AddPoke from "./pages/AddPoke";
import "./App.css";

function App() {
  return (
    <>
      <nav className="menu">
        <span className="logo">Mon Pokédex</span>
        <Link to="/">Accueil</Link>
        <Link to="/add">Ajouter un pokémon</Link>
      </nav>

      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poke/:id" element={<PokeDetails />} />
          <Route path="/add" element={<AddPoke />} />
          <Route path="*" element={<p className="message">Page introuvable.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
