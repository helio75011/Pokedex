// Plugin Vite : branche l'API sur le serveur de Vite (npm run dev et npm run preview).
// C'est le même code que la fonction Vercel : une seule commande suffit en local,
// et l'application appelle « /api » sur la même adresse, en local comme en ligne.
import { traiterRequete } from "./routes.js";

// Traduit la requête de Node en requête web standard
async function versRequeteWeb(req) {
  const morceaux = [];
  for await (const morceau of req) morceaux.push(morceau);
  return new Request(new URL(req.url, `http://${req.headers.host}`), {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(morceaux),
  });
}

function middlewareApi() {
  return async (req, res, next) => {
    if (!/^\/api(\/|\?|$)/.test(req.url)) return next();
    try {
      const reponse = await traiterRequete(await versRequeteWeb(req));
      res.statusCode = reponse.status;
      reponse.headers.forEach((valeur, nom) => res.setHeader(nom, valeur));
      res.end(Buffer.from(await reponse.arrayBuffer()));
    } catch (erreur) {
      next(erreur);
    }
  };
}

export function apiLocale() {
  return {
    name: "api-locale",
    configureServer(serveur) {
      serveur.middlewares.use(middlewareApi());
    },
    configurePreviewServer(serveur) {
      serveur.middlewares.use(middlewareApi());
    },
  };
}
