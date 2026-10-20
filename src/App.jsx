import Pokemon from "./components/Pokemon";
import "./App.css";

const pokemons = [
  { id: 1, nom: "pikachu", element: "electrique", poids: 6 },
  { id: 2, nom: "bulbizarre", element: "plante", poids: 6.9 },
  { id: 3, nom: "carapuce", element: "eau", poids: 9 },
];

function App() {
  return (
    <div className="app">
      <h1>Mon Pokédex</h1>
      {pokemons.length === 0 ? (
        <p className="vide">Aucun pokemon disponible.</p>
      ) : (
        <div className="liste">
          {pokemons.map((pokemon) => (
            <Pokemon
              key={pokemon.id}
              nom={pokemon.nom}
              element={pokemon.element}
              poids={pokemon.poids}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
