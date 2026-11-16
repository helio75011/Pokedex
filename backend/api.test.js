// @vitest-environment node
// On appelle directement la fonction déployée sur Vercel (api/index.js),
// avec de vraies requêtes HTTP : c'est exactement ce que fera le site en ligne
import { describe, expect, it } from "vitest";
import fonctionVercel from "../api/index.js";

function appeler(chemin, options) {
  return fonctionVercel.fetch(new Request(`http://localhost${chemin}`, options));
}

describe("API : la fonction Vercel (tests fonctionnels)", () => {
  it("renvoie une page de la liste et le nombre total de pokémons", async () => {
    const reponse = await appeler("/api/poke?page=13&limit=12");
    const pokemons = await reponse.json();

    expect(reponse.status).toBe(200);
    expect(reponse.headers.get("X-Total-Count")).toBe("151");
    expect(pokemons).toHaveLength(7); // 151 = 12 × 12 + 7
    expect(pokemons.at(-1).nom).toBe("Mew");
  });

  it("ajoute un pokémon (POST), qu'on retrouve ensuite (GET)", async () => {
    const ajout = await appeler("/api/poke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: "Testmon", element: "Feu", poids: 12, taille: 1 }),
    });
    const nouveau = await ajout.json();

    expect(ajout.status).toBe(201);
    expect(nouveau.id).toBe(152);

    const lecture = await appeler("/api/poke/152");
    expect((await lecture.json()).nom).toBe("Testmon");
  });

  it("répond 400 aux données invalides et 404 à ce qui n'existe pas", async () => {
    const sansNom = await appeler("/api/poke", { method: "POST", body: JSON.stringify({}) });
    const jsonInvalide = await appeler("/api/poke", { method: "POST", body: "pas du JSON" });

    expect(sansNom.status).toBe(400);
    expect(jsonInvalide.status).toBe(400);
    expect((await appeler("/api/poke/9999")).status).toBe(404);
    expect((await appeler("/api/inconnu")).status).toBe(404);
  });

  it("indique le stockage utilisé (en mémoire hors de Vercel)", async () => {
    const reponse = await appeler("/api/sante");

    expect(await reponse.json()).toEqual({ statut: "ok", stockage: "memoire" });
  });
});
