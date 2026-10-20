import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function PokeDetails() {
  const { id } = useParams(); // pour l'URL /poke/25, id vaut "25"
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    let ignore = false;

    api
      .get(`/poke/${id}`)
      .then((res) => {
        if (ignore) return;
        setPokemon(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        // 404 : l'API répond mais ne connaît pas cet id ; sinon l'API ne répond pas
        setErreur(err.response?.status === 404 ? "Pokémon introuvable." : "Impossible de joindre l'API.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <p className="message">Chargement...</p>;

  if (erreur) {
    return (
      <div className="details">
        <Link to="/" className="retour">← Retour à la liste</Link>
        <p className="message erreur">{erreur}</p>
      </div>
    );
  }

  return (
    <div className="details">
      <Link to="/" className="retour">← Retour à la liste</Link>

      <div className="fiche">
        <img src={pokemon.image} alt={pokemon.nom} width="260" height="260" />

        <div>
          <p className="numero">N° {pokemon.id}</p>
          <h1>{pokemon.nom}</h1>
          {pokemon.categorie && <p className="categorie">{pokemon.categorie}</p>}
          <p className="element">{pokemon.element}</p>

          <dl>
            <dt>Poids</dt>
            <dd>{pokemon.poids} kg</dd>
            <dt>Taille</dt>
            <dd>{pokemon.taille} m</dd>
          </dl>

          {pokemon.description && <p className="description">{pokemon.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default PokeDetails;
