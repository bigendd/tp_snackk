# Frontend – Projet Snackk

Ce projet correspond à la partie front de l’application Snackk. Il consomme l’API Symfony pour la gestion des utilisateurs, produits, commandes, etc.

---

## Prérequis

- Node.js (version recommandée : 18+)
- npm ou yarn

---

## Installation

Clone le dépôt puis installe les dépendances :

```sh
git clone <url-du-repo-front>
cd <nom-du-dossier-front>
npm install
# ou
yarn install
```

---

## Configuration

Crée un fichier `.env` à la racine du projet et configure l’URL de l’API :

```
VITE_API_URL=http://localhost:8080/api
```

Adapte l’URL selon l’adresse de ton backend.

---

## Lancement en développement

```sh
npm run dev
# ou
yarn dev
```

L’application sera accessible sur [http://localhost:5173](http://localhost:5173) (ou le port affiché dans le terminal).

---

## Scripts utiles

- `npm run dev` : démarre le serveur de développement
- `npm run build` : build de production
- `npm run preview` : prévisualisation du build

---

## Structure du projet

- `src/` : code source principal (pages, composants, hooks, etc.)
- `public/` : fichiers statiques
- `src/services/` : appels à l’API
- `src/components/` : composants réutilisables

---

## Consommation de l’API

Toutes les requêtes sont faites vers l’API Symfony documentée dans le backend.  
Pense à bien renseigner le token JWT dans les headers pour les routes protégées.

---

## Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit tes modifications
4. Push la branche (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request

---

## Aide

Pour toute question, contacte l’équipe Snackk ou consulte la documentation de l’API.

---