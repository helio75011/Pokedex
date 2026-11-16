import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PokeForm from "../components/organisms/PokeForm";
import { createPokemon } from "../services/api";

function AddPoke() {
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  function ajouter(pokemon) {
    setLoading(true);
    setErreur(null);

    createPokemon(pokemon)
      .then((nouveau) => {
        // Affiche la fiche du pokémon créé. replace : le formulaire sort de l'historique,
        // « Retour à la liste » ne ramène donc pas au formulaire
        navigate(`/poke/${nouveau.id}`, { replace: true });
      })
      .catch((err) => {
        // L'API explique ce qui ne va pas (champ manquant, image invalide…)
        setErreur(err.response?.data?.message ?? "Erreur lors de l'ajout du pokémon.");
        setLoading(false);
      });
  }

  return (
    <>
      <h1>Ajouter un pokémon</h1>
      <PokeForm onSubmit={ajouter} enCours={loading} erreur={erreur} />
    </>
  );
}

export default AddPoke;
