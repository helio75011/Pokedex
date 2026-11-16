import { useFavoris } from "../../store/favoris";
import Button from "../atoms/Button";

// Molécule : l'étoile qui ajoute ou retire un pokémon des favoris (store Zustand)
function FavoriteButton({ pokemon }) {
  // Sélecteur : ce bouton ne se réaffiche que si SON pokémon entre ou sort des favoris
  const estFavori = useFavoris((etat) => etat.favoris.some((favori) => favori.id === pokemon.id));
  const basculerFavori = useFavoris((etat) => etat.basculerFavori);

  return (
    <Button
      variante="icone"
      className={estFavori ? "est-favori" : ""}
      aria-label={`Favori : ${pokemon.nom}`}
      aria-pressed={estFavori}
      title={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={() => basculerFavori(pokemon)}
    >
      {estFavori ? "★" : "☆"}
    </Button>
  );
}

export default FavoriteButton;
