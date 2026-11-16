import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { apiLocale } from "./backend/vite-plugin-api.js";

// https://vite.dev/config/
export default defineConfig({
  // apiLocale : l'API répond sur /api dans npm run dev et npm run preview
  plugins: [react(), apiLocale()],

  // Configuration des tests (Vitest)
  test: {
    environment: "jsdom", // un faux navigateur pour afficher les composants
    setupFiles: "./src/test/setup.js",
  },
});
