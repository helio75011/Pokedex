import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../components/atoms/Button";
import Message from "../components/atoms/Message";
import PokeSheet from "../components/organisms/PokeSheet";
import { getPokemon } from "../services/api";

function PokeDetails() {
  const { id } = useParams(); // pour l'URL /poke/25, id vaut "25"
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    getPokemon(id)
      .then((donnees) => {
        if (ignore) return;
        setPokemon(donnees);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        // 404 : l'API répond mais ne connaît pas cet id ; sinon l'API ne répond pas
        setErreur(
          err.response?.status === 404 ? "Pokémon introuvable." : "Impossible de joindre l'API.",
        );
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  // Revient à la liste telle qu'on l'a quittée (page, recherche).
  // Si on est arrivé directement sur cette fiche, il n'y a pas de page d'avant : on va à l'accueil
  function retour() {
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  }

  if (loading) return <Message>Chargement...</Message>;

  return (
    <>
      <Button variante="lien" onClick={retour}>
        ← Retour à la liste
      </Button>
      {erreur ? <Message type="erreur">{erreur}</Message> : <PokeSheet pokemon={pokemon} />}
    </>
  );
}

export default PokeDetails;
