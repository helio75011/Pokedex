import PokeCard from "./PokeCard";

// Organisme : la grille de cartes, utilisée par l'accueil et par la page Favoris
function PokeGrid({ pokemons }) {
  return (
    <div className="grille">
      {pokemons.map((pokemon) => (
        <PokeCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}

export default PokeGrid;
