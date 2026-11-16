// Toute l'API tient dans une seule fonction, comme le recommande Vercel :
// elle reçoit une requête web standard (Request) et renvoie une réponse (Response).
//   GET  /api/poke?page=1&limit=12&q=pika  liste paginée (+ en-tête X-Total-Count)
//   GET  /api/poke/25                      un pokémon
//   POST /api/poke                         ajoute un pokémon
//   GET  /api/sante                        indique si la base Redis est bien utilisée
import { ErreurValidation, creerPokemon, listerPokemons, trouverPokemon } from "./pokemons.js";
import { stockage } from "./stockage.js";

function json(donnees, statut = 200, entetes = {}) {
  return Response.json(donnees, { status: statut, headers: entetes });
}

export async function traiterRequete(requete) {
  const url = new URL(requete.url);
  const chemin = url.pathname.replace(/\/+$/, ""); // « /api/poke/ » devient « /api/poke »
  const idDansUrl = chemin.match(/^\/api\/poke\/(\d+)$/);

  try {
    if (requete.method === "GET" && chemin === "/api/poke") {
      const { pokemons, total } = await listerPokemons({
        page: url.searchParams.get("page"),
        limit: url.searchParams.get("limit"),
        recherche: url.searchParams.get("q"),
      });
      return json(pokemons, 200, { "X-Total-Count": String(total) });
    }

    if (requete.method === "GET" && idDansUrl) {
      const pokemon = await trouverPokemon(Number(idDansUrl[1]));
      return pokemon ? json(pokemon) : json({ message: "Pokémon introuvable" }, 404);
    }

    if (requete.method === "POST" && chemin === "/api/poke") {
      return json(await creerPokemon(await requete.json()), 201);
    }

    if (requete.method === "GET" && chemin === "/api/sante") {
      return json({ statut: "ok", stockage: stockage.nom });
    }

    return json({ message: "Route inconnue" }, 404);
  } catch (erreur) {
    // SyntaxError : le corps de la requête n'est pas du JSON valide
    if (erreur instanceof ErreurValidation || erreur instanceof SyntaxError) {
      return json({ message: erreur.message }, 400);
    }
    console.error(erreur);
    return json({ message: "Erreur serveur" }, 500);
  }
}
