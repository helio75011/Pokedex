# Mon Pokédex

TP « Développement frontend avancé » : un Pokédex en React, avec React Router, axios, Zustand, des tests Vitest et une mise en ligne sur Vercel.

- **Site en ligne :** _lien à ajouter après la mise en ligne_
- **Dépôt GitHub :** _lien à ajouter_

## Fonctionnalités

- Liste des 151 pokémons de la 1re génération, 12 par page, avec une recherche qui ignore les accents (« salameche » trouve Salamèche).
- Fiche détaillée de chaque pokémon : on clique n'importe où sur sa carte.
- Formulaire d'ajout d'un pokémon (requête `POST`), validé par l'API.
- Favoris : une étoile sur chaque carte, un compteur dans le menu, une page dédiée. Ils restent après un rechargement.
- Menu de navigation sur toutes les pages, et adresses partageables : `/?page=3&q=pika` rouvre la même liste.

## Lancer le projet

Il faut Node.js 24.

```bash
npm install
npm run dev   # l'application ET l'API, sur http://localhost:5173
```

| Commande                            | Rôle                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| `npm test`                          | lance les 18 tests (unitaires et fonctionnels)           |
| `npm run lint`                      | vérifie le code avec ESLint                              |
| `npm run format`                    | formate tout le code avec Prettier                       |
| `npm run build` + `npm run preview` | construit la version de production et l'affiche en local |

## Architecture

```
Navigateur : application React (SPA)
   │  axios, sur la même adresse que le site
   ▼
/api/... : une fonction Vercel (api/index.js), qui utilise le code de backend/
   │
   ▼
Base Redis (Upstash) : les 151 pokémons + ceux ajoutés avec le formulaire
```

| Route de l'API                  | Réponse                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `GET /api/poke?page=1&limit=12` | une page de pokémons, et leur nombre total dans `X-Total-Count` |
| `GET /api/poke?q=pika`          | recherche par nom                                               |
| `GET /api/poke/25`              | un pokémon (404 s'il n'existe pas)                              |
| `POST /api/poke`                | ajoute un pokémon (400 si les données sont invalides)           |
| `GET /api/sante`                | indique où sont rangées les données (`redis` ou `memoire`)      |

En local, la même API tourne dans le serveur de Vite (`backend/vite-plugin-api.js`) et range les données en mémoire : il n'y a aucune base à installer.

## 1. Stratégie de rendu : CSR (Client-Side Rendering)

L'application fait du **rendu côté client**. C'est une **SPA** (Single Page Application) :

1. Vercel envoie depuis son CDN un fichier `index.html` presque vide (`<div id="root"></div>`) et les fichiers JavaScript.
2. React construit la page dans le navigateur, puis demande les pokémons à l'API avec axios.
3. Quand on change de page, React Router modifie l'URL (API History du navigateur) et affiche le bon composant, **sans recharger la page**.
4. `vercel.json` renvoie toutes les adresses vers `index.html`. Sans lui, recharger `/poke/25` donnerait une erreur 404.

**Pourquoi ce choix.** C'est la stratégie la plus simple pour une application très interactive (recherche, favoris, formulaire) : un hébergement statique sur CDN, pas de serveur de rendu, et une navigation instantanée une fois le site chargé.

**Ses limites.** Le premier affichage attend le JavaScript (environ 105 Ko compressés), puis la réponse de l'API. Le HTML de départ est vide, ce qui est moins bon pour le référencement. Le code splitting et la pagination (§ 3) réduisent le premier point.

**Les alternatives.**

- **SSR** (Server-Side Rendering, avec React Router en « framework mode » ou Next.js) : le serveur envoie une page déjà remplie, ce qui est meilleur pour le référencement et le premier affichage, mais demande un serveur qui travaille à chaque visite.
- **SSG** (génération statique) : les 151 fiches seraient fabriquées une fois pour toutes au build, ce qui serait idéal pour des données qui ne changent pas. Mais le formulaire d'ajout rend les données dynamiques, il faudrait alors de l'**ISR** (régénération progressive).

Pour un Pokédex sans enjeu de référencement, le CSR suffit et reste le plus simple.

## 2. Organisation du front-end : Atomic Design

Les composants sont rangés par niveau de complexité, comme en chimie : des atomes s'assemblent en molécules, les molécules en organismes.

```
src/
├── main.jsx                  point d'entrée : <BrowserRouter> autour de <App />
├── App.jsx                   les routes
├── components/
│   ├── atoms/                Button, Badge, Message
│   ├── molecules/            Pagination, SearchBar, FavoriteButton, FormField,
│   │                         TypeBadges, Hero, Marquee
│   ├── organisms/            PokeCard, PokeGrid, NavBar, PokeForm, PokeSheet, Footer
│   └── templates/            MainLayout
├── pages/                    Home, PokeDetails, AddPoke, Favorites, NotFound
├── data/elements.js          les 18 types (formulaire et bande qui défile)
├── services/api.js           instance axios et tous les appels à l'API
└── store/favoris.js          store Zustand des favoris
```

| Niveau     | Rôle                                                         | Exemple                                                             |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Atomes     | les plus petits éléments, réutilisés partout                 | `Button` (3 variantes), `Badge` (le type), `Message`                |
| Molécules  | quelques atomes réunis pour une fonction précise             | `Pagination` = 2 `Button` + le numéro de page                       |
| Organismes | des blocs d'interface complets                               | `PokeCard` = image + `TypeBadges` + lien + `FavoriteButton`         |
| Template   | la mise en page commune, sans contenu                        | `MainLayout` = `NavBar` + zone de la page + `Footer`                |
| Pages      | un template rempli avec les vraies données (API, URL, store) | `Home` appelle l'API et passe la liste à `PokeGrid` et `Pagination` |

**Les règles suivies :**

- Un composant n'importe que des composants de son niveau ou d'un niveau inférieur : un atome n'importe aucun composant.
- Seules les pages appellent l'API. Les organismes reçoivent leurs données par les props : `PokeGrid` reçoit `pokemons`, `PokeForm` renvoie ses données par `onSubmit`.
- Les composants sont réutilisés : `PokeGrid` sert à l'accueil et à la page Favoris, `FavoriteButton` sur la carte et sur la fiche.

Ce qui n'est pas de l'interface est rangé à part : `services/` (HTTP), `store/` (état global), `api/` et `backend/` (serveur).

## 3. Optimisation des performances : le code splitting

**La notion appliquée.** Avec le **découpage du code** (`React.lazy` + `Suspense`), chaque page secondaire est un fichier JavaScript séparé, téléchargé seulement quand on l'ouvre :

```jsx
// src/App.jsx
const PokeDetails = lazy(() => import("./pages/PokeDetails"));
const AddPoke = lazy(() => import("./pages/AddPoke"));
```

`MainLayout` entoure les pages d'un `<Suspense>` qui affiche « Chargement de la page... » pendant le téléchargement.

**La mesure** (`npm run build`) :

| Fichier                                            | Taille compressée | Téléchargé…                       |
| -------------------------------------------------- | ----------------- | --------------------------------- |
| `index-….js` (React, axios, Zustand, accueil)      | 87,6 Ko           | à l'ouverture du site             |
| fichier commun (React Router, composants partagés) | 17,5 Ko           | à l'ouverture du site             |
| `PokeDetails-….js`                                 | 0,7 Ko            | à la première fiche ouverte       |
| `AddPoke-….js`                                     | 0,9 Ko            | au premier clic sur « Ajouter »   |
| `Favorites-….js`, `NotFound-….js`                  | 0,5 Ko            | à la première visite de ces pages |

Dans le navigateur, l'onglet Réseau le confirme : `PokeDetails-….js` n'apparaît qu'au premier clic sur un pokémon. Ici le gain est modeste (environ 2 Ko), car les pages sont petites. Mais avec ce découpage, chaque nouvelle page ne ralentit pas l'ouverture du site.

**En complément :**

- Les images sont en `loading="lazy"` : les images hors de l'écran ne se téléchargent que quand on fait défiler la page. Elles ont aussi `width` et `height`, donc la page ne « saute » pas pendant leur chargement.
- `<link rel="preconnect">` ouvre la connexion au serveur des images, et à celui des polices, dès le départ. Les polices sont en `display=swap` : le texte s'affiche tout de suite avec une police de secours.
- La pagination côté API n'envoie que 12 pokémons à la fois.

## 4. Stratégie KISS et qualité du code

**KISS** (« Keep It Simple, Stupid ») : à chaque besoin, la solution la plus simple qui fonctionne.

- **Une seule fonction pour toute l'API** (`api/index.js`), avec un routage d'une cinquantaine de lignes (`backend/routes.js`), sans framework serveur.
- **Un seul fichier pour tous les appels HTTP** (`services/api.js`, 3 fonctions) : les pages ne connaissent aucune URL.
- **L'API est sur la même adresse que le site** (`/api`) : pas de configuration CORS ni de variable d'environnement pour son adresse.
- **Aucune base à installer en local** : les données sont en mémoire, et `npm run dev` lance tout.
- **Zustand plutôt que Redux** : un store de 30 lignes, sans Provider, actions ni reducers.
- **Des composants courts** : le plus long est le formulaire (86 lignes), la plupart en font moins de 30.
- **Un seul fichier CSS pour les composants** (`App.css`), rangé dans l'ordre des niveaux Atomic Design. Les couleurs et les polices sont des variables CSS dans `index.css`.
- **La couleur de chaque type se choisit en CSS, sans JavaScript** : la carte et la fiche portent `data-type="Plante / Poison"`, et la règle `[data-type^="Plante"]` (« commence par Plante ») leur donne le vert. Le style s'inspire du site [Aardvark Book Club](https://www.aardvarkbookclub.com/) : couleurs vives, titres énormes, formes en pilule. Une seule couleur, le bleu `--accent`, est réservée à ce qui se clique (boutons, focus clavier, compteur des favoris).

**Qualité du code :**

- **ESLint** applique les règles React et celles des hooks. **Prettier** donne le même format à tous les fichiers.
- Les deux sont **vérifiés automatiquement par la CI** : un code mal formaté ou avec une erreur de lint bloque la mise en ligne.
- **18 tests automatiques** (§ 6).
- **L'API valide tout ce qu'elle reçoit**, avec des réponses 400 claires : nom et élément obligatoires (40 caractères au plus), image en `http(s)://`, poids et taille entre 0 et 10 000.
- **Accessibilité** : libellés reliés aux champs, messages annoncés aux lecteurs d'écran (`role="alert"` et `status`), étoile en `aria-pressed`, liens « Voir détails de Pikachu ».

## 5. Gestion d'état moderne : Zustand

**La technique appliquée.** Les favoris sont un **état global** géré avec **Zustand**, dans `src/store/favoris.js` :

```js
export const useFavoris = create(
  persist(
    (set) => ({
      favoris: [],

      // Ajoute le pokémon s'il n'est pas dans les favoris, sinon le retire
      basculerFavori: (pokemon) =>
        set((etat) => ({
          favoris: etat.favoris.some((favori) => favori.id === pokemon.id)
            ? etat.favoris.filter((favori) => favori.id !== pokemon.id)
            : [
                ...etat.favoris,
                {
                  id: pokemon.id,
                  nom: pokemon.nom,
                  element: pokemon.element,
                  image: pokemon.image,
                },
              ],
        })),
    }),
    { name: "pokedex-favoris" }, // sauvegarde dans localStorage
  ),
);
```

- **Un état partagé sans faire passer de props de composant en composant.** Quatre endroits lisent ou modifient les favoris : le compteur du menu, l'étoile des cartes, l'étoile de la fiche et la page Favoris.
- **`persist`** enregistre les favoris dans le navigateur (localStorage) : ils survivent au rechargement.
- **Les sélecteurs** évitent les réaffichages inutiles. Chaque étoile lit seulement `favoris.some(f => f.id === pokemon.id)`, et ne se réaffiche que si **son** pokémon change.
- **Pourquoi pas un Context React ?** Il réafficherait tous les composants abonnés à chaque changement, et demande un Provider. Redux, lui, demanderait beaucoup plus de code pour le même résultat.

**Chaque état est rangé au bon endroit :**

| Type d'état           | Exemple                                  | Outil                   |
| --------------------- | ---------------------------------------- | ----------------------- |
| État local            | champs du formulaire, chargement, erreur | `useState`              |
| État dans l'URL       | page et recherche (`/?page=3&q=pika`)    | `useSearchParams`       |
| État du serveur       | la liste des pokémons                    | l'API, avec `useEffect` |
| État global du client | les favoris                              | Zustand                 |

Garder la page et la recherche dans l'URL rend les liens partageables, et le bouton Retour du navigateur fonctionne. « ← Retour à la liste » ramène à la page qu'on avait quittée.

## 6. Tests

Ils utilisent **Vitest** (avec Vite), **Testing Library** (on agit comme un utilisateur : clics, saisie) et **jsdom** (un faux navigateur). Dans les tests de l'interface, l'API est simulée : ils ne dépendent ni du réseau ni de la base.

| Type        | Fichier                                        | Ce qui est vérifié                                                                                      |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Unitaire    | `src/components/molecules/Pagination.test.jsx` | « Page précédente » désactivé en page 1 ; le clic sur « Page suivante » appelle `onNext`                |
| Unitaire    | `src/store/favoris.test.js`                    | ajout puis retrait d'un favori ; sauvegarde dans localStorage                                           |
| Unitaire    | `backend/pokemons.test.js`                     | recherche sans accents, découpage en pages, validation des données reçues                               |
| Unitaire    | `backend/stockage.test.js`                     | remplissage de la base Redis au premier appel, puis numérotation des ajouts (152, 153…)                 |
| Fonctionnel | `src/test/parcours.test.jsx`                   | liste → clic → fiche ; formulaire → `POST` → fiche ; étoile → page Favoris ; « Page suivante » → page 2 |
| Fonctionnel | `backend/api.test.js`                          | la fonction Vercel, avec de vraies requêtes HTTP : liste paginée, `POST` puis `GET`, erreurs 400 et 404 |

On compte 10 tests unitaires et 8 tests fonctionnels. Ils se lancent avec `npm test`, et à chaque `git push` dans la CI.

## 7. CI/CD

```
git push sur main
   ├─▶ GitHub Actions, job « Lint, tests et build »
   │      npm ci → lint → format:check → tests → build
   └─▶ Vercel construit la nouvelle version
          └─▶ Deployment Checks : Vercel attend que le job GitHub ait réussi
                 └─▶ mise en ligne en production
```

- **Intégration continue (CI).** Elle est définie dans `.github/workflows/ci.yml` et tourne aussi sur chaque pull request.
- **Déploiement continu (CD).** Vercel est relié au dépôt GitHub. Chaque push sur `main` produit une nouvelle version, mise en production **seulement si la CI est verte**. Chaque pull request reçoit en plus une adresse de prévisualisation.

## 8. Mise en ligne sur Vercel

1. Sur vercel.com : **Add New → Project**, puis importer le dépôt GitHub. Le preset Vite est détecté tout seul.
2. Dans le projet : **Storage → Create Database → Upstash for Redis** (offre gratuite), puis **Connect** au projet et **Redeploy**. Les variables `KV_REST_API_URL` / `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_*`) sont ajoutées automatiquement.
3. **Settings → Build and Deployment → Deployment Checks → Add Checks → GitHub**, puis choisir « Lint, tests et build ».
4. Vérification : `https://<adresse-du-site>/api/sante` doit répondre `"stockage": "redis"`. Au premier appel, l'API remplit la base avec les 151 pokémons.

## Correspondance avec la grille d'évaluation

| Critère                                   | Où le trouver                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| Liste de pokémons                         | `pages/Home.jsx`, `organisms/PokeGrid.jsx`                                      |
| Navigation de la liste vers la fiche      | `organisms/PokeCard.jsx` (carte entièrement cliquable), `pages/PokeDetails.jsx` |
| Formulaire d'ajout                        | `pages/AddPoke.jsx`, `organisms/PokeForm.jsx`                                   |
| Menu de navigation global                 | `organisms/NavBar.jsx`, `templates/MainLayout.jsx`                              |
| React Router                              | `main.jsx` (`BrowserRouter`), `App.jsx` (`Routes`), `useParams`, `useNavigate`  |
| API REST consommée                        | `api/index.js` et `backend/` ; appelée depuis `services/api.js`                 |
| axios (GET, POST)                         | `services/api.js`                                                               |
| Pagination précédente / suivante          | `molecules/Pagination.jsx`, `pages/Home.jsx`                                    |
| `useState`, `useEffect`                   | `pages/Home.jsx`, `pages/PokeDetails.jsx`, `organisms/PokeForm.jsx`             |
| Composants séparés                        | `src/components/` : 13 composants, plus 5 pages                                 |
| Mise en ligne                             | lien en haut de ce fichier                                                      |
| CI/CD                                     | § 7, `.github/workflows/ci.yml`                                                 |
| 2 tests unitaires et 2 tests fonctionnels | § 6 (10 unitaires et 8 fonctionnels)                                            |
| Performances, KISS, gestion d'état        | § 3, § 4, § 5                                                                   |
| Stratégie de rendu, Atomic Design         | § 1, § 2                                                                        |

L'historique Git compte un commit par partie du TP (`git log`).
