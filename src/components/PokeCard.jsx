import { Link } from "react-router-dom";

function PokeCard({ pokemon }) {
  return (
    <div className="pokemon">
      <img src={pokemon.image} alt={pokemon.nom} width="120" height="120" loading="lazy" />
      <h3>{pokemon.nom}</h3>
      <p className="element">{pokemon.element}</p>
      <Link to={`/poke/${pokemon.id}`} className="bouton">
        Voir détails
      </Link>
    </div>
  );
}

export default PokeCard;
