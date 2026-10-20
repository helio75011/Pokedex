import axios from "axios";

// Toutes les requêtes partent de cette URL : api.get("/poke") appelle
// http://127.0.0.1:8000/api/poke (l'API locale du dossier api/ ou celle du cours)
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export default api;
