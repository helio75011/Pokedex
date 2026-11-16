import { Link } from "react-router-dom";
import Badge from "../atoms/Badge";
import FavoriteButton from "../molecules/FavoriteButton";

// Organisme : la carte d'un pokémon dans une liste.
// Le lien « Voir détails » s'étend sur toute la carte (voir .carte__lien dans App.css) :
// on peut cliquer n'importe où sur la carte, sauf sur l'étoile des favoris
function PokeCard({ pokemon }) {
  return (
    <article className="carte">
      <FavoriteButton pokemon={pokemon} />
      <img src={pokemon.image} alt="" width="120" height="120" loading="lazy" decoding="async" />
      <h3>{pokemon.nom}</h3>
      <Badge>{pokemon.element}</Badge>
      {/* aria-label : les lecteurs d'écran annoncent « Voir détails de Pikachu », et pas
          « Voir détails » douze fois de suite */}
      <Link
        to={`/poke/${pokemon.id}`}
        className="bouton bouton--sombre carte__lien"
        aria-label={`Voir détails de ${pokemon.nom}`}
      >
        Voir détails
      </Link>
    </article>
  );
}

export default PokeCard;
