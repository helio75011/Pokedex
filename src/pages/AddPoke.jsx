import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ELEMENTS = [
  "Acier", "Combat", "Dragon", "Eau", "Électrik", "Fée", "Feu", "Glace", "Insecte",
  "Normal", "Plante", "Poison", "Psy", "Roche", "Sol", "Spectre", "Ténèbres", "Vol",
];

function AddPoke() {
  const [nom, setNom] = useState("");
  const [element, setElement] = useState("");
  const [image, setImage] = useState("");
  const [poids, setPoids] = useState("");
  const [taille, setTaille] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault(); // empêche le rechargement de la page
    setLoading(true);
    setErreur(null);

    api
      .post("/poke", { nom, element, image, poids: Number(poids), taille: Number(taille) })
      .then((res) => {
        // Affiche la fiche du pokémon créé. replace : le formulaire sort de l'historique,
        // « Retour à la liste » ne ramène donc pas au formulaire
        navigate(`/poke/${res.data.id}`, { replace: true });
      })
      .catch(() => {
        setErreur("Erreur lors de l'ajout du pokémon.");
        setLoading(false);
      });
  }

  return (
    <form className="formulaire" onSubmit={handleSubmit}>
      <h1>Ajouter un pokémon</h1>

      <label>
        Nom
        <input type="text" value={nom} onChange={(event) => setNom(event.target.value)} required />
      </label>

      <label>
        Élément
        <select value={element} onChange={(event) => setElement(event.target.value)} required>
          <option value="">-- Choisir un élément --</option>
          {ELEMENTS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        Image (adresse URL, facultatif)
        <input
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <label>
        Poids (kg)
        <input
          type="number"
          min="0"
          step="0.1"
          value={poids}
          onChange={(event) => setPoids(event.target.value)}
          required
        />
      </label>

      <label>
        Taille (m)
        <input
          type="number"
          min="0"
          step="0.1"
          value={taille}
          onChange={(event) => setTaille(event.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>

      {erreur && <p className="message erreur">{erreur}</p>}
    </form>
  );
}

export default AddPoke;
