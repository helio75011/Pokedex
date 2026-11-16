import Message from "../components/atoms/Message";
import PokeGrid from "../components/organisms/PokeGrid";
import { useFavoris } from "../store/favoris";

// Page des favoris : les données viennent du store Zustand, sans appel à l'API
function Favorites() {
  const favoris = useFavoris((etat) => etat.favoris);

  return (
    <>
      <h1>Mes favoris</h1>
      {favoris.length === 0 ? (
        <Message>Aucun favori pour l'instant : clique sur ☆ dans la liste pour en ajouter.</Message>
      ) : (
        <PokeGrid pokemons={favoris} />
      )}
    </>
  );
}

export default Favorites;
