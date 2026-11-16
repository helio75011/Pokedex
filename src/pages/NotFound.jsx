import { Link } from "react-router-dom";
import Message from "../components/atoms/Message";

function NotFound() {
  return (
    <>
      <Message>Page introuvable.</Message>
      <p className="centre">
        <Link to="/">Retour à l'accueil</Link>
      </p>
    </>
  );
}

export default NotFound;
