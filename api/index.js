// Fonction Vercel : vercel.json lui envoie toutes les adresses /api/...
// La logique est dans backend/, partagée avec le serveur de développement.
import { traiterRequete } from "../backend/routes.js";

export default {
  fetch: traiterRequete,
};
