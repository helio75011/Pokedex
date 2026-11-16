// Tests fonctionnels : on affiche toute l'application et on agit comme un utilisateur
// (clics, saisie). L'API est simulée : les tests ne dépendent ni du réseau ni de la base.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { createPokemon, getPokemon, getPokemons } from "../services/api";
import { useFavoris } from "../store/favoris";

vi.mock("../services/api", () => ({
  getPokemons: vi.fn(),
  getPokemon: vi.fn(),
  createPokemon: vi.fn(),
}));

const SALAMECHE = {
  id: 4,
  nom: "Salamèche",
  element: "Feu",
  image: "salameche.png",
  poids: 8.5,
  taille: 0.6,
  categorie: "Pokémon Lézard",
  description: "",
};
const PIKACHU = {
  id: 25,
  nom: "Pikachu",
  element: "Électrik",
  image: "pikachu.png",
  poids: 6,
  taille: 0.4,
  categorie: "Pokémon Souris",
  description: "",
};

function afficherApp(adresse) {
  render(
    <MemoryRouter initialEntries={[adresse]} useTransitions={false}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useFavoris.setState({ favoris: [] });
  getPokemons.mockResolvedValue({ pokemons: [SALAMECHE, PIKACHU], total: 2 });
  getPokemon.mockImplementation(async (id) =>
    [SALAMECHE, PIKACHU].find((p) => p.id === Number(id)),
  );
});

describe("Parcours utilisateur (tests fonctionnels)", () => {
  it("depuis la liste, cliquer sur un pokémon ouvre sa fiche", async () => {
    const user = userEvent.setup();
    afficherApp("/");

    await user.click(await screen.findByRole("link", { name: "Voir détails de Pikachu" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Pikachu" })).toBeInTheDocument();
    expect(screen.getByText("Pokémon Souris")).toBeInTheDocument();
    expect(getPokemon).toHaveBeenCalledWith("25");
  });

  it("le formulaire envoie le nouveau pokémon à l'API, puis affiche sa fiche", async () => {
    const user = userEvent.setup();
    const TESTMON = { ...SALAMECHE, id: 152, nom: "Testmon", poids: 30, taille: 2, categorie: "" };
    createPokemon.mockResolvedValue(TESTMON);
    getPokemon.mockResolvedValue(TESTMON);
    afficherApp("/add");

    await user.type(await screen.findByLabelText("Nom"), "Testmon");
    await user.selectOptions(screen.getByLabelText(/Élément/), "Feu");
    await user.type(screen.getByLabelText("Poids (kg)"), "30");
    await user.type(screen.getByLabelText("Taille (m)"), "2");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(createPokemon).toHaveBeenCalledWith({
      nom: "Testmon",
      element: "Feu",
      image: "",
      poids: 30,
      taille: 2,
    });
    expect(await screen.findByRole("heading", { level: 1, name: "Testmon" })).toBeInTheDocument();
  });

  it("un pokémon mis en favori apparaît dans la page Favoris", async () => {
    const user = userEvent.setup();
    afficherApp("/");

    await user.click(await screen.findByRole("button", { name: "Favori : Pikachu" }));
    const lienFavoris = screen.getByRole("link", { name: /Favoris/ });
    expect(lienFavoris).toHaveTextContent("1");

    await user.click(lienFavoris);

    expect(await screen.findByRole("heading", { name: "Mes favoris" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir détails de Pikachu" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Voir détails de Salamèche" }),
    ).not.toBeInTheDocument();
  });

  it("« Page suivante » affiche la page 2", async () => {
    const user = userEvent.setup();
    getPokemons.mockImplementation(async ({ page }) => ({
      pokemons: page === 1 ? [SALAMECHE] : [PIKACHU],
      total: 24, // 2 pages de 12
    }));
    afficherApp("/");

    await user.click(await screen.findByRole("button", { name: /suivante/ }));

    expect(
      await screen.findByRole("link", { name: "Voir détails de Pikachu" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Page 2 sur 2")).toBeInTheDocument();
    expect(getPokemons).toHaveBeenLastCalledWith({ page: 2, limit: 12, recherche: "" });
  });
});
