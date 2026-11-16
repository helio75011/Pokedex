// Molécule : le champ de recherche et le nombre de résultats
function SearchBar({ valeur, onChange, total }) {
  return (
    <div className="barre-recherche">
      <input
        type="search"
        placeholder="Rechercher un pokémon..."
        aria-label="Rechercher un pokémon"
        value={valeur}
        onChange={(event) => onChange(event.target.value)}
      />
      {total !== null && (
        <p className="barre-recherche__total">
          {total} pokémon{total > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default SearchBar;
