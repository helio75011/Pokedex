import { useState } from "react";
import Button from "../atoms/Button";
import Message from "../atoms/Message";
import FormField from "../molecules/FormField";

const ELEMENTS = [
  "Acier",
  "Combat",
  "Dragon",
  "Eau",
  "Électrik",
  "Fée",
  "Feu",
  "Glace",
  "Insecte",
  "Normal",
  "Plante",
  "Poison",
  "Psy",
  "Roche",
  "Sol",
  "Spectre",
  "Ténèbres",
  "Vol",
];

// Organisme : le formulaire d'ajout. Il gère ses champs (formulaire contrôlé) et transmet
// les données à la page, qui s'occupe de l'appel à l'API (onSubmit)
function PokeForm({ onSubmit, enCours, erreur }) {
  const [nom, setNom] = useState("");
  const [element, setElement] = useState("");
  const [image, setImage] = useState("");
  const [poids, setPoids] = useState("");
  const [taille, setTaille] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); // empêche le rechargement de la page
    onSubmit({ nom, element, image, poids: Number(poids), taille: Number(taille) });
  }

  return (
    <form className="formulaire" onSubmit={handleSubmit}>
      <FormField label="Nom">
        <input
          type="text"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          maxLength={40}
          required
        />
      </FormField>

      <FormField label="Élément">
        <select value={element} onChange={(event) => setElement(event.target.value)} required>
          <option value="">-- Choisir un élément --</option>
          {ELEMENTS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Image (adresse URL, facultatif)">
        <input
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://..."
        />
      </FormField>

      <FormField label="Poids (kg)">
        <input
          type="number"
          min="0"
          max="10000"
          step="0.1"
          value={poids}
          onChange={(event) => setPoids(event.target.value)}
          required
        />
      </FormField>

      <FormField label="Taille (m)">
        <input
          type="number"
          min="0"
          max="10000"
          step="0.1"
          value={taille}
          onChange={(event) => setTaille(event.target.value)}
          required
        />
      </FormField>

      <Button type="submit" disabled={enCours}>
        {enCours ? "Ajout en cours..." : "Ajouter"}
      </Button>

      {erreur && <Message type="erreur">{erreur}</Message>}
    </form>
  );
}

export default PokeForm;
