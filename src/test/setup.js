// Préparation commune à tous les tests (déclarée dans vite.config.js)
import "@testing-library/jest-dom/vitest"; // ajoute toBeInTheDocument(), toBeDisabled()…
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Les pages chargées à la demande (React.lazy) peuvent mettre un peu de temps à arriver
configure({ asyncUtilTimeout: 5000 });

afterEach(() => {
  cleanup(); // retire les composants affichés par le test
  // Vide les favoris sauvegardés (localStorage n'existe pas dans les tests de l'API, sous Node)
  globalThis.localStorage?.clear();
});
