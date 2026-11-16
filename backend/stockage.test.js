// @vitest-environment node
import { describe, expect, it } from "vitest";
import { creerStockageRedis } from "./stockage.js";

// Fausse base Redis en mémoire, avec les seules commandes utilisées par stockage.js
// (comme le vrai client Upstash, elle rend les objets tels qu'on les a enregistrés)
function fausseBaseRedis() {
  const hashes = new Map();
  const valeurs = new Map();
  return {
    async hlen(cle) {
      return hashes.get(cle)?.size ?? 0;
    },
    async hset(cle, champs) {
      if (!hashes.has(cle)) hashes.set(cle, new Map());
      for (const [champ, valeur] of Object.entries(champs)) hashes.get(cle).set(champ, valeur);
    },
    async hgetall(cle) {
      return hashes.has(cle) ? Object.fromEntries(hashes.get(cle)) : null;
    },
    async hget(cle, champ) {
      return hashes.get(cle)?.get(champ) ?? null;
    },
    async set(cle, valeur, { nx } = {}) {
      if (!(nx && valeurs.has(cle))) valeurs.set(cle, valeur);
    },
    async incr(cle) {
      valeurs.set(cle, Number(valeurs.get(cle) ?? 0) + 1);
      return valeurs.get(cle);
    },
  };
}

describe("Stockage Redis (test unitaire)", () => {
  it("remplit la base vide avec les 151 pokémons au premier appel", async () => {
    const stockage = creerStockageRedis(fausseBaseRedis());

    const pokemons = await stockage.tous();

    expect(pokemons).toHaveLength(151);
    expect(pokemons[0].nom).toBe("Bulbizarre"); // triés par numéro
    expect((await stockage.un(25)).nom).toBe("Pikachu");
  });

  it("donne le numéro 152 au premier pokémon ajouté, puis 153", async () => {
    const stockage = creerStockageRedis(fausseBaseRedis());

    const premier = await stockage.ajouter({ nom: "Testmon", element: "Feu" });
    const second = await stockage.ajouter({ nom: "Testmon 2", element: "Eau" });

    expect([premier.id, second.id]).toEqual([152, 153]);
    expect(await stockage.tous()).toHaveLength(153);
  });
});
