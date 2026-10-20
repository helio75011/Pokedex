import { useEffect, useState } from "react";
import Pokemon from "./components/Pokemon";
import "./App.css";

const API_URL = "https://pokeapi.co/api/v2";
const NOMBRE_POKEMONS = 151; // la 1re génération

// L'API donne les types en anglais : on les traduit pour l'affichage
const TYPES_FR = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  grass: "Plante",
  electric: "Électrik",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée",
};

// Vérifie la réponse HTTP puis récupère le JSON
function lireJson(res) {
  if (!res.ok) throw new Error("Erreur serveur");
  return res.json();
}

// La liste de l'API ne donne qu'un nom anglais et une URL par pokémon :
// il faut 2 requêtes de plus pour avoir son type, son image et son nom français
async function chargerPokemon(url) {
  const pokemon = await fetch(url).then(lireJson);
  const espece = await fetch(pokemon.species.url).then(lireJson);
  const nomFr = espece.names.find((n) => n.language.name === "fr");

  return {
    id: pokemon.id,
    nom: nomFr ? nomFr.name : pokemon.name,
    element: pokemon.types
      .map((t) => TYPES_FR[t.type.name] ?? t.type.name)
      .join(" / "),
    image: pokemon.sprites.other["official-artwork"].front_default,
    poids: pokemon.weight / 10, // l'API donne le poids en hectogrammes
  };
}

// Met en minuscules et enlève les accents : « Salamèche » devient « salameche »
function simplifier(texte) {
  return texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function App() {
  const [pokemons, setPokemons] = useState([]); // la liste reçue de l'API
  const [isLoading, setIsLoading] = useState(true); // chargement en cours
  const [erreur, setErreur] = useState(null); // message d'erreur éventuel
  const [recherche, setRecherche] = useState(""); // texte de la barre de recherche
  const [tentative, setTentative] = useState(0); // +1 à chaque clic sur « Réessayer »

  useEffect(() => {
    fetch(`${API_URL}/pokemon?limit=${NOMBRE_POKEMONS}`)
      .then(lireJson)
      .then((data) => Promise.all(data.results.map((p) => chargerPokemon(p.url))))
      .then((liste) => {
        setPokemons(liste);
        setIsLoading(false);
      })
      .catch((err) => {
        setErreur(err.message);
        setIsLoading(false);
      });
  }, [tentative]); // une fois au montage, puis seulement si on clique sur « Réessayer »

  function reessayer() {
    setErreur(null);
    setIsLoading(true);
    setTentative(tentative + 1); // change la dépendance : l'effet relance le fetch
  }

  const pokemonsFiltres = pokemons.filter((pokemon) =>
    simplifier(pokemon.nom).includes(simplifier(recherche))
  );

  return (
    <div className="app">
      <h1>Mon Pokédex</h1>

      {isLoading && <p className="message">Chargement des pokémons...</p>}

      {erreur && (
        <p className="message erreur">
          Erreur : {erreur}
          <button onClick={reessayer}>Réessayer</button>
        </p>
      )}

      {!isLoading && !erreur && pokemons.length === 0 && (
        <p className="message">Aucun pokemon disponible.</p>
      )}

      {pokemons.length > 0 && (
        <>
          <input
            className="recherche"
            type="search"
            placeholder="Rechercher un pokémon..."
            aria-label="Rechercher un pokémon"
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
          />

          {pokemonsFiltres.length === 0 ? (
            <p className="message">Aucun pokémon ne correspond à « {recherche} ».</p>
          ) : (
            <div className="liste">
              {pokemonsFiltres.map((pokemon) => (
                <Pokemon
                  key={pokemon.id}
                  nom={pokemon.nom}
                  element={pokemon.element}
                  image={pokemon.image}
                  poids={pokemon.poids}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
