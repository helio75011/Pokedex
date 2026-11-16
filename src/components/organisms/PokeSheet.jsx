import Badge from "../atoms/Badge";
import FavoriteButton from "../molecules/FavoriteButton";

// Organisme : la fiche complète d'un pokémon
function PokeSheet({ pokemon }) {
  return (
    <article className="fiche">
      <img src={pokemon.image} alt={pokemon.nom} width="260" height="260" />

      <div>
        <p className="fiche__numero">N° {pokemon.id}</p>
        <div className="fiche__titre">
          <h1>{pokemon.nom}</h1>
          <FavoriteButton pokemon={pokemon} />
        </div>
        {pokemon.categorie && <p className="fiche__categorie">{pokemon.categorie}</p>}
        <Badge>{pokemon.element}</Badge>

        <dl>
          <dt>Poids</dt>
          <dd>{pokemon.poids} kg</dd>
          <dt>Taille</dt>
          <dd>{pokemon.taille} m</dd>
        </dl>

        {pokemon.description && <p className="fiche__description">{pokemon.description}</p>}
      </div>
    </article>
  );
}

export default PokeSheet;
