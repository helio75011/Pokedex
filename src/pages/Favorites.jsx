import Message from "../components/atoms/Message";
import Hero from "../components/molecules/Hero";
import PokeGrid from "../components/organisms/PokeGrid";
import { useFavoris } from "../store/favoris";

// Page des favoris : les données viennent du store Zustand, sans appel à l'API
function Favorites() {
  const favoris = useFavoris((etat) => etat.favoris);

  return (
    <>
      <Hero surtitre="Ta collection" titre="Mes favoris" />
      <div className="panneau">
        {favoris.length === 0 ? (
          <Message>
            Aucun favori pour l'instant : clique sur ☆ dans la liste pour en ajouter.
          </Message>
        ) : (
          <PokeGrid pokemons={favoris} />
        )}
      </div>
    </>
  );
}

export default Favorites;
