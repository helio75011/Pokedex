// Règles de l'API : recherche, pagination et validation des pokémons ajoutés
import { stockage } from "./stockage.js";

const IMAGE_PAR_DEFAUT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

// Erreur due aux données envoyées (→ réponse 400), pas à un bug du serveur (→ 500)
export class ErreurValidation extends Error {}

// Met en minuscules et enlève les accents : « Salamèche » devient « salameche ».
// normalize("NFD") sépare chaque lettre de son accent (è → e + `), puis \p{M} supprime
// tous les accents ainsi séparés (« M » = marques diacritiques en Unicode)
export function simplifier(texte) {
  return texte.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function filtrerEtPaginer(pokemons, { page, limit, recherche }) {
  const trouves = pokemons.filter((p) => simplifier(p.nom).includes(simplifier(recherche)));
  const debut = (page - 1) * limit;
  return { pokemons: trouves.slice(debut, debut + limit), total: trouves.length };
}

export async function listerPokemons({ page, limit, recherche }) {
  return filtrerEtPaginer(await stockage.tous(), {
    page: Math.max(1, Number(page) || 1),
    limit: Math.min(100, Math.max(1, Number(limit) || 12)),
    recherche: recherche ?? "",
  });
}

export function trouverPokemon(id) {
  return stockage.un(id);
}

function texte(valeur, nomDuChamp, { obligatoire = false, max = 40 } = {}) {
  const resultat = String(valeur ?? "").trim();
  if (obligatoire && !resultat)
    throw new ErreurValidation(`Le champ « ${nomDuChamp} » est obligatoire`);
  if (resultat.length > max) throw new ErreurValidation(`Le champ « ${nomDuChamp} » est trop long`);
  return resultat;
}

function nombre(valeur, nomDuChamp) {
  const resultat = Number(valeur ?? 0);
  if (!Number.isFinite(resultat) || resultat < 0 || resultat > 10000) {
    throw new ErreurValidation(`Le champ « ${nomDuChamp} » doit être un nombre entre 0 et 10000`);
  }
  return resultat;
}

// L'API est publique : on vérifie tout ce qui arrive avant de l'enregistrer
export function validerPokemon(donnees) {
  const image = texte(donnees?.image, "image", { max: 500 });
  if (image && !/^https?:\/\//.test(image)) {
    throw new ErreurValidation("L'image doit être une adresse http:// ou https://");
  }

  return {
    nom: texte(donnees?.nom, "nom", { obligatoire: true }),
    element: texte(donnees?.element, "élément", { obligatoire: true }),
    image: image || IMAGE_PAR_DEFAUT,
    poids: nombre(donnees?.poids, "poids"),
    taille: nombre(donnees?.taille, "taille"),
    categorie: "",
    description: "",
  };
}

export function creerPokemon(donnees) {
  return stockage.ajouter(validerPokemon(donnees));
}
