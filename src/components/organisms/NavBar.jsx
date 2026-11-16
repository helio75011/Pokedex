import { NavLink } from "react-router-dom";
import { useFavoris } from "../../store/favoris";

// Organisme : le menu de navigation, présent sur toutes les pages.
// NavLink est un Link qui ajoute la classe « active » au lien de la page affichée
function NavBar() {
  const nombreFavoris = useFavoris((etat) => etat.favoris.length);

  return (
    <nav className="menu" aria-label="Menu principal">
      <span className="menu__logo">Mon Pokédex</span>
      <NavLink to="/" end>
        Accueil
      </NavLink>
      <NavLink to="/add">Ajouter un pokémon</NavLink>
      <NavLink to="/favoris">
        Favoris <span className="menu__compteur">{nombreFavoris}</span>
      </NavLink>
    </nav>
  );
}

export default NavBar;
