import FavoriteButton from "../molecules/FavoriteButton";
import TypeBadges from "../molecules/TypeBadges";

// Organisme : la fiche complète d'un pokémon. data-type choisit les couleurs de la fiche
function PokeSheet({ pokemon }) {
  return (
    <article className="fiche" data-type={pokemon.element}>
      <div className="fiche__image">
        <img src={pokemon.image} alt={pokemon.nom} width="260" height="260" />
      </div>

      <div className="fiche__infos">
        <p className="fiche__numero">N° {pokemon.id}</p>
        <div className="fiche__titre">
          <h1>{pokemon.nom}</h1>
          <FavoriteButton pokemon={pokemon} />
        </div>
        {pokemon.categorie && <p className="fiche__categorie">{pokemon.categorie}</p>}
        <TypeBadges element={pokemon.element} />

        <dl className="fiche__mesures">
          <div>
            <dt>Poids</dt>
            <dd>{pokemon.poids} kg</dd>
          </div>
          <div>
            <dt>Taille</dt>
            <dd>{pokemon.taille} m</dd>
          </div>
        </dl>

        {pokemon.description && <p className="fiche__description">{pokemon.description}</p>}
      </div>
    </article>
  );
}

export default PokeSheet;
