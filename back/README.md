# Documentation de l'API – Projet Snackk

Cette documentation liste toutes les routes disponibles de l'API pour permettre au développeur front de consommer les données.

---

## Authentification

-   **POST** `/api/login` : Connexion utilisateur (JWT)
-   **POST** `/api/register` : Inscription utilisateur
-   **POST** `/api/logout` : Déconnexion utilisateur
-   **POST** `/api/token/refresh` : Rafraîchir le token JWT
-   **POST** `/api/forgot-password` : Demander la réinitialisation du mot de passe
-   **POST** `/api/reset-password` : Réinitialiser le mot de passe

---

## Utilisateurs

-   **GET** `/api/users.{_format}` : Liste des utilisateurs
-   **POST** `/api/users.{_format}` : Créer un utilisateur
-   **GET** `/api/users/{id}.{_format}` : Détail d'un utilisateur
-   **PATCH** `/api/users/{id}.{_format}` : Modifier un utilisateur
-   **DELETE** `/api/users/{id}.{_format}` : Supprimer un utilisateur

-   **GET** `/api/user_infos.{_format}` : Liste des infos utilisateurs
-   **POST** `/api/user_infos.{_format}` : Créer une info utilisateur
-   **GET** `/api/user_infos/{id}.{_format}` : Détail d'une info utilisateur
-   **PATCH** `/api/user_infos/{id}.{_format}` : Modifier une info utilisateur
-   **DELETE** `/api/user_infos/{id}.{_format}` : Supprimer une info utilisateur

---

## Produits

-   **GET** `/api/produits.{_format}` : Liste des produits
-   **POST** `/api/produits.{_format}` : Créer un produit
-   **GET** `/api/produits/{id}.{_format}` : Détail d'un produit
-   **PUT** `/api/produits/{id}.{_format}` : Modifier un produit
-   **DELETE** `/api/produits/{id}.{_format}` : Supprimer un produit

-   **GET** `/api/produits/avec-ingredients` : Liste des produits avec ingrédients
-   **GET** `/api/produits/disponibles` : Liste des produits disponibles
-   **GET** `/api/produits/indisponibles` : Liste des produits indisponibles

---

## Catégories

-   **GET** `/api/categories.{_format}` : Liste des catégories
-   **POST** `/api/categories.{_format}` : Créer une catégorie
-   **GET** `/api/categories/{id}.{_format}` : Détail d'une catégorie
-   **PUT** `/api/categories/{id}.{_format}` : Modifier une catégorie
-   **DELETE** `/api/categories/{id}.{_format}` : Supprimer une catégorie

---

## Commandes

-   **GET** `/api/commandes.{_format}` : Liste des commandes
-   **POST** `/api/commandes.{_format}` : Créer une commande
-   **GET** `/api/commandes/{id}.{_format}` : Détail d'une commande
-   **PUT** `/api/commandes/{id}.{_format}` : Modifier une commande

---

## Bornes

-   **GET** `/api/bornes.{_format}` : Liste des bornes
-   **POST** `/api/bornes.{_format}` : Créer une borne
-   **GET** `/api/bornes/{id}.{_format}` : Détail d'une borne
-   **PATCH** `/api/bornes/{id}.{_format}` : Modifier une borne
-   **DELETE** `/api/bornes/{id}.{_format}` : Supprimer une borne

---

## Ingrédients

-   **GET** `/api/ingredients.{_format}` : Liste des ingrédients
-   **POST** `/api/ingredients.{_format}` : Créer un ingrédient
-   **GET** `/api/ingredients/{id}.{_format}` : Détail d'un ingrédient
-   **PATCH** `/api/ingredients/{id}.{_format}` : Modifier un ingrédient
-   **DELETE** `/api/ingredients/{id}.{_format}` : Supprimer un ingrédient

---

## Catégories d'ingrédients

-   **GET** `/api/categorie_ingredients.{_format}` : Liste des catégories d'ingrédients
-   **POST** `/api/categorie_ingredients.{_format}` : Créer une catégorie d'ingrédients
-   **GET** `/api/categorie_ingredients/{id}.{_format}` : Détail d'une catégorie d'ingrédients
-   **PATCH** `/api/categorie_ingredients/{id}.{_format}` : Modifier une catégorie d'ingrédients
-   **DELETE** `/api/categorie_ingredients/{id}.{_format}` : Supprimer une catégorie d'ingrédients

---

## Commande Infos

-   **GET** `/api/commande_infos.{_format}` : Liste des infos de commande
-   **POST** `/api/commande_infos.{_format}` : Créer une info de commande
-   **GET** `/api/commande_infos/{id}.{_format}` : Détail d'une info de commande
-   **PATCH** `/api/commande_infos/{id}.{_format}` : Modifier une info de commande
-   **DELETE** `/api/commande_infos/{id}.{_format}` : Supprimer une info de commande

---

## Commande Produits

-   **GET** `/api/commande_produits.{_format}` : Liste des produits de commande
-   **POST** `/api/commande_produits.{_format}` : Créer un produit de commande
-   **GET** `/api/commande_produits/{id}.{_format}` : Détail d'un produit de commande
-   **PATCH** `/api/commande_produits/{id}.{_format}` : Modifier un produit de commande
-   **DELETE** `/api/commande_produits/{id}.{_format}` : Supprimer un produit de commande

---

## Produit Ingrédients

-   **GET** `/api/produit_ingredients.{_format}` : Liste des ingrédients de produit
-   **POST** `/api/produit_ingredients.{_format}` : Créer un ingrédient de produit
-   **GET** `/api/produit_ingredients/{id}.{_format}` : Détail d'un ingrédient de produit
-   **PATCH** `/api/produit_ingredients/{id}.{_format}` : Modifier un ingrédient de produit
-   **DELETE** `/api/produit_ingredients/{id}.{_format}` : Supprimer un ingrédient de produit

---

## Restaurants

-   **GET** `/api/restaurants.{_format}` : Liste des restaurants
-   **POST** `/api/restaurants.{_format}` : Créer un restaurant
-   **GET** `/api/restaurants/{id}.{_format}` : Détail d'un restaurant
-   **PATCH** `/api/restaurants/{id}.{_format}` : Modifier un restaurant
-   **DELETE** `/api/restaurants/{id}.{_format}` : Supprimer un restaurant

---

## Types de produits

-   **GET** `/api/type_produits.{_format}` : Liste des types de produits
-   **POST** `/api/type_produits.{_format}` : Créer un type de produit
-   **GET** `/api/type_produits/{id}.{_format}` : Détail d'un type de produit
-   **PATCH** `/api/type_produits/{id}.{_format}` : Modifier un type de produit
-   **DELETE** `/api/type_produits/{id}.{_format}` : Supprimer un type de produit

---

## Documentation interactive

-   **GET** `/api/docs.{_format}` : Documentation interactive de l'API (Swagger)

---

> Pour chaque route, le paramètre `{_format}` peut être remplacé par `json` (exemple : `/api/produits.json`).

---

\*\*N'oubliez pas d'ajouter les headers d'authentification (Bearer token) pour les routes
