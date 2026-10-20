import { useEffect, useState } from "react";
import api from "../services/api";
import PokeCard from "../components/PokeCard";
import Pagination from "../components/Pagination";

const LIMIT = 12; // nombre de pokémons par page

function Home() {
  const [pokemons, setPokemons] = useState([]); // les pokémons de la page affichée
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    let ignore = false; // devient true si une requête plus récente a été lancée

    // axios construit l'URL : /poke?page=1&limit=12&q=...
    api
      .get("/poke", { params: { page, limit: LIMIT, q: recherche } })
      .then((res) => {
        if (ignore) return;
        const total = Number(res.headers["x-total-count"]); // envoyé par l'API
        setPokemons(res.data);
        setTotalPages(Math.max(1, Math.ceil(total / LIMIT)));
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        setErreur("Erreur lors du chargement des pokémons. L'API est-elle lancée ?");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, recherche]); // relance la requête quand la page ou la recherche change

  function changerPage(nouvellePage) {
    setLoading(true);
    setErreur(null);
    setPage(nouvellePage);
  }

  function changerRecherche(texte) {
    setLoading(true);
    setErreur(null);
    setRecherche(texte);
    setPage(1); // une nouvelle recherche repart de la première page
  }

  return (
    <div>
      <h1>Liste des pokémons</h1>

      <input
        className="recherche"
        type="search"
        placeholder="Rechercher un pokémon..."
        aria-label="Rechercher un pokémon"
        value={recherche}
        onChange={(event) => changerRecherche(event.target.value)}
      />

      {loading && <p className="message">Chargement...</p>}

      {erreur && <p className="message erreur">{erreur}</p>}

      {!loading && !erreur && pokemons.length === 0 && (
        <p className="message">
          {recherche ? `Aucun pokémon ne correspond à « ${recherche} ».` : "Aucun pokemon disponible."}
        </p>
      )}

      {!loading && !erreur && pokemons.length > 0 && (
        <>
          <div className="liste">
            {pokemons.map((pokemon) => (
              <PokeCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => changerPage(page - 1)}
            onNext={() => changerPage(page + 1)}
            disablePrev={page === 1}
            disableNext={page >= totalPages}
          />
        </>
      )}
    </div>
  );
}

export default Home;
