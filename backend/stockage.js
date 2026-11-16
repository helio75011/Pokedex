// Où sont rangés les pokémons :
// - en ligne (Vercel) : dans une base Redis Upstash, les ajouts sont conservés ;
// - en local et dans les tests : en mémoire, les ajouts durent tant que le serveur tourne.
import { Redis } from "@upstash/redis";
import POKEMONS_INITIAUX from "./donnees-initiales.js";

// Base Redis : un « hash » qui associe chaque id à son pokémon, plus un compteur pour les ids
export function creerStockageRedis(redis) {
  const CLE = "pokedex:pokemons";
  const CLE_DERNIER_ID = "pokedex:dernier-id";
  let pret = false;

  // Au tout premier appel, la base est vide : on y copie les 151 pokémons
  async function remplirSiVide() {
    if (pret) return;
    if ((await redis.hlen(CLE)) === 0) {
      await redis.hset(CLE, Object.fromEntries(POKEMONS_INITIAUX.map((p) => [p.id, p])));
      await redis.set(CLE_DERNIER_ID, POKEMONS_INITIAUX.length, { nx: true });
    }
    pret = true;
  }

  return {
    nom: "redis",
    async tous() {
      await remplirSiVide();
      const pokemons = Object.values((await redis.hgetall(CLE)) ?? {});
      return pokemons.sort((a, b) => a.id - b.id);
    },
    async un(id) {
      await remplirSiVide();
      return (await redis.hget(CLE, String(id))) ?? null;
    },
    async ajouter(pokemon) {
      await remplirSiVide();
      const nouveau = { id: await redis.incr(CLE_DERNIER_ID), ...pokemon };
      await redis.hset(CLE, { [nouveau.id]: nouveau });
      return nouveau;
    },
  };
}

export function creerStockageMemoire() {
  let pokemons = POKEMONS_INITIAUX.map((p) => ({ ...p }));

  return {
    nom: "memoire",
    async tous() {
      return pokemons;
    },
    async un(id) {
      return pokemons.find((p) => p.id === id) ?? null;
    },
    async ajouter(pokemon) {
      const nouveau = { id: Math.max(0, ...pokemons.map((p) => p.id)) + 1, ...pokemon };
      pokemons = [...pokemons, nouveau];
      return nouveau;
    },
  };
}

// Variables ajoutées automatiquement par Vercel quand on connecte une base Upstash
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (process.env.VERCEL && !(url && token)) {
  console.warn("Aucune base Redis connectée : les pokémons ajoutés ne seront pas conservés.");
}

export const stockage =
  url && token ? creerStockageRedis(new Redis({ url, token })) : creerStockageMemoire();
