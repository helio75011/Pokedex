// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ErreurValidation, filtrerEtPaginer, simplifier, validerPokemon } from "./pokemons.js";

const POKEMONS = [
  { id: 1, nom: "Bulbizarre" },
  { id: 4, nom: "Salamèche" },
  { id: 7, nom: "Carapuce" },
  { id: 25, nom: "Pikachu" },
];

describe("Règles de l'API (tests unitaires)", () => {
  it("recherche sans tenir compte des accents ni des majuscules", () => {
    expect(simplifier("Salamèche")).toBe("salameche");

    const resultat = filtrerEtPaginer(POKEMONS, { page: 1, limit: 12, recherche: "SALAME" });
    expect(resultat).toEqual({ pokemons: [{ id: 4, nom: "Salamèche" }], total: 1 });
  });

  it("découpe la liste en pages et donne le nombre total", () => {
    const page2 = filtrerEtPaginer(POKEMONS, { page: 2, limit: 3, recherche: "" });

    expect(page2.pokemons).toEqual([{ id: 25, nom: "Pikachu" }]);
    expect(page2.total).toBe(4);
  });

  it("refuse un pokémon sans nom ou avec une image qui n'est pas une adresse web", () => {
    expect(() => validerPokemon({ element: "Feu" })).toThrow(ErreurValidation);
    expect(() =>
      validerPokemon({ nom: "Testmon", element: "Feu", image: "javascript:alert(1)" }),
    ).toThrow(ErreurValidation);
  });

  it("met une image par défaut quand aucune n'est donnée", () => {
    const pokemon = validerPokemon({ nom: " Testmon ", element: "Feu", poids: "12", taille: "1" });

    expect(pokemon.nom).toBe("Testmon");
    expect(pokemon.image).toContain("poke-ball.png");
    expect(pokemon.poids).toBe(12);
  });
});
