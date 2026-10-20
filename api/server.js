// Petite API REST locale qui remplace l'API Symfony du cours.
// Lancement : npm run api  →  http://127.0.0.1:8000/api/poke
//   GET  /api/poke?page=1&limit=12&q=pika  liste paginée (+ en-tête X-Total-Count)
//   GET  /api/poke/25                      un pokémon
//   POST /api/poke                         ajoute un pokémon (enregistré dans db.json)
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";

const PORT = 8000;
const FICHIER = new URL("./db.json", import.meta.url);
const IMAGE_PAR_DEFAUT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

// Autorise l'application React (autre port) à appeler l'API
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Expose-Headers": "X-Total-Count",
};

function repondre(res, statut, donnees, entetes = {}) {
  res.writeHead(statut, { "Content-Type": "application/json; charset=utf-8", ...CORS, ...entetes });
  res.end(JSON.stringify(donnees));
}

// Met en minuscules et enlève les accents : « Salamèche » devient « salameche »
function simplifier(texte) {
  return texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

async function lireBase() {
  return JSON.parse(await readFile(FICHIER, "utf8"));
}

async function lireCorps(req) {
  let corps = "";
  for await (const morceau of req) corps += morceau;
  return JSON.parse(corps || "{}");
}

const serveur = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const idDansUrl = url.pathname.match(/^\/api\/poke\/(\d+)$/);

  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS); // pré-requête envoyée par le navigateur avant un POST
      return res.end();
    }

    if (req.method === "GET" && url.pathname === "/api/poke") {
      const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
      const limit = Math.max(1, Number(url.searchParams.get("limit")) || 12);
      const recherche = simplifier(url.searchParams.get("q") ?? "");
      const { pokemons } = await lireBase();
      const trouves = pokemons.filter((p) => simplifier(p.nom).includes(recherche));
      const pagePokemons = trouves.slice((page - 1) * limit, page * limit);
      return repondre(res, 200, pagePokemons, { "X-Total-Count": trouves.length });
    }

    if (req.method === "GET" && idDansUrl) {
      const { pokemons } = await lireBase();
      const pokemon = pokemons.find((p) => p.id === Number(idDansUrl[1]));
      if (!pokemon) return repondre(res, 404, { message: "Pokémon introuvable" });
      return repondre(res, 200, pokemon);
    }

    if (req.method === "POST" && url.pathname === "/api/poke") {
      const donnees = await lireCorps(req);
      if (!donnees.nom?.trim() || !donnees.element?.trim()) {
        return repondre(res, 400, { message: "Le nom et l'élément sont obligatoires" });
      }
      const base = await lireBase();
      const nouveau = {
        id: Math.max(0, ...base.pokemons.map((p) => p.id)) + 1,
        nom: donnees.nom.trim(),
        element: donnees.element.trim(),
        image: donnees.image?.trim() || IMAGE_PAR_DEFAUT,
        poids: Number(donnees.poids) || 0,
        taille: Number(donnees.taille) || 0,
        categorie: "",
        description: "",
      };
      base.pokemons.push(nouveau);
      await writeFile(FICHIER, JSON.stringify(base, null, 2) + "\n");
      return repondre(res, 201, nouveau);
    }

    repondre(res, 404, { message: "Route inconnue" });
  } catch (err) {
    const statut = err instanceof SyntaxError ? 400 : 500; // JSON invalide → 400
    repondre(res, statut, { message: err.message });
  }
});

serveur.listen(PORT, "127.0.0.1", () => {
  console.log(`API Pokédex lancée sur http://127.0.0.1:${PORT}/api/poke`);
});
