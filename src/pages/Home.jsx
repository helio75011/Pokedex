import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Message from "../components/atoms/Message";
import Pagination from "../components/molecules/Pagination";
import SearchBar from "../components/molecules/SearchBar";
import PokeGrid from "../components/organisms/PokeGrid";
import { getPokemons } from "../services/api";

const LIMIT = 12; // nombre de pokémons par page

function Home() {
  // La page et la recherche sont lues dans l'URL : /?page=3&q=pika
  // En revenant d'une fiche, on retrouve donc la liste telle qu'on l'a laissée
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const recherche = searchParams.get("q") ?? "";

  const [pokemons, setPokemons] = useState([]); // les pokémons de la page affichée
  const [total, setTotal] = useState(0); // nombre total de résultats
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  useEffect(() => {
    let ignore = false; // devient true si une requête plus récente a été lancée

    getPokemons({ page, limit: LIMIT, recherche })
      .then((resultat) => {
        if (ignore) return;
        setPokemons(resultat.pokemons);
        setTotal(resultat.total);
        setLoading(false);
      })
      .catch(() => {
        if (ignore) return;
        setErreur("Erreur lors du chargement des pokémons. Réessaie dans un instant.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, recherche]); // relance la requête quand la page ou la recherche change

  function changerPage(nouvellePage) {
    setLoading(true);
    setErreur(null);
    // Nouvelle entrée dans l'historique : le bouton Retour du navigateur revient à la page d'avant
    setSearchParams(recherche ? { page: nouvellePage, q: recherche } : { page: nouvellePage });
  }

  function changerRecherche(texte) {
    setLoading(true);
    setErreur(null);
    // Sans "page" dans l'URL, on repart de la page 1.
    // replace : remplace l'entrée d'historique au lieu d'en ajouter une par lettre tapée
    setSearchParams(texte ? { q: texte } : {}, { replace: true });
  }

  const pret = !loading && !erreur;

  return (
    <>
      <h1>Liste des pokémons</h1>

      <SearchBar valeur={recherche} onChange={changerRecherche} total={pret ? total : null} />

      {loading && <Message>Chargement...</Message>}

      {erreur && <Message type="erreur">{erreur}</Message>}

      {pret && pokemons.length === 0 && (
        <Message>
          {recherche
            ? `Aucun pokémon ne correspond à « ${recherche} ».`
            : "Aucun pokemon disponible."}
        </Message>
      )}

      {pret && pokemons.length > 0 && (
        <>
          <PokeGrid pokemons={pokemons} />

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
    </>
  );
}

export default Home;
