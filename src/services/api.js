import axios from "axios";

// Instance axios : toutes les requêtes partent de « /api », sur la même adresse que le site.
// En local, l'API tourne dans le serveur de Vite ; en ligne, c'est une fonction Vercel.
const api = axios.create({
  baseURL: "/api",
});

// Tous les appels à l'API sont regroupés ici : les pages n'utilisent que ces 3 fonctions

export async function getPokemons({ page, limit, recherche }) {
  const reponse = await api.get("/poke", { params: { page, limit, q: recherche } });
  // L'API envoie le nombre total de résultats dans un en-tête : il sert à calculer le nombre de pages
  return { pokemons: reponse.data, total: Number(reponse.headers["x-total-count"]) };
}

export async function getPokemon(id) {
  const reponse = await api.get(`/poke/${id}`);
  return reponse.data;
}

export async function createPokemon(pokemon) {
  const reponse = await api.post("/poke", pokemon);
  return reponse.data;
}

export default api;
