import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// useTransitions={false} : l'URL est mise à jour tout de suite. Indispensable ici car
// le champ de recherche lit sa valeur dans l'URL (?q=...) : sinon des lettres se perdent
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
