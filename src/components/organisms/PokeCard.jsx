import { Link } from "react-router-dom";
import FavoriteButton from "../molecules/FavoriteButton";
import TypeBadges from "../molecules/TypeBadges";

// Organisme : la carte d'un pokémon dans une liste. data-type colore le fond de l'image
// selon le type. Le lien « Voir détails » s'étend sur toute la carte (voir .carte__lien
// dans App.css) : on peut cliquer n'importe où sur la carte, sauf sur l'étoile des favoris
function PokeCard({ pokemon }) {
  return (
    <article className="carte" data-type={pokemon.element}>
      <FavoriteButton pokemon={pokemon} />
      <div className="carte__image">
        <img src={pokemon.image} alt="" width="240" height="240" loading="lazy" decoding="async" />
      </div>
      <p className="carte__numero">N° {pokemon.id}</p>
      <h2>{pokemon.nom}</h2>
      <TypeBadges element={pokemon.element} />
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
