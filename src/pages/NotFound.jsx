import { Link } from "react-router-dom";
import Hero from "../components/molecules/Hero";

function NotFound() {
  return (
    <Hero surtitre="Erreur 404" titre="Page introuvable">
      <Link to="/" className="bouton bouton--sombre">
        Retour à l'accueil
      </Link>
    </Hero>
  );
}

export default NotFound;
