import { beforeEach, describe, expect, it } from "vitest";
import { useFavoris } from "./favoris";

const PIKACHU = { id: 25, nom: "Pikachu", element: "Électrik", image: "pikachu.png", poids: 6 };

describe("Store des favoris (test unitaire)", () => {
  beforeEach(() => {
    useFavoris.setState({ favoris: [] });
  });

  it("ajoute un pokémon, puis le retire au deuxième clic", () => {
    useFavoris.getState().basculerFavori(PIKACHU);
    expect(useFavoris.getState().favoris).toEqual([
      { id: 25, nom: "Pikachu", element: "Électrik", image: "pikachu.png" },
    ]);

    useFavoris.getState().basculerFavori(PIKACHU);
    expect(useFavoris.getState().favoris).toEqual([]);
  });

  it("sauvegarde les favoris dans le navigateur (localStorage)", () => {
    useFavoris.getState().basculerFavori(PIKACHU);

    const sauvegarde = JSON.parse(localStorage.getItem("pokedex-favoris"));
    expect(sauvegarde.state.favoris[0].nom).toBe("Pikachu");
  });
});
