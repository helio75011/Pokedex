import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store global (Zustand) : la liste des favoris est partagée par toutes les pages
// (cartes, fiche, menu, page Favoris) sans passer de props de composant en composant.
// persist la sauvegarde dans le navigateur (localStorage) : elle survit au rechargement.
export const useFavoris = create(
  persist(
    (set) => ({
      favoris: [],

      basculerFavori: (pokemon) =>
        set((etat) => ({
          favoris: etat.favoris.some((favori) => favori.id === pokemon.id)
            ? etat.favoris.filter((favori) => favori.id !== pokemon.id)
            : [
                ...etat.favoris,
                // On garde de quoi afficher la carte, sans rappeler l'API
                {
                  id: pokemon.id,
                  nom: pokemon.nom,
                  element: pokemon.element,
                  image: pokemon.image,
                },
              ],
        })),
    }),
    { name: "pokedex-favoris" },
  ),
);
