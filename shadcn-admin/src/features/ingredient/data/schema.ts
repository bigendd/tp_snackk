import { z } from "zod";

// Schéma de base pour Produit (utilisé dans Ingredient)
export const produitSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  description: z.string(),
  prix_base: z.number(),
  disponible: z.boolean(),
  category: z.union([
    z.object({
      id: z.number(),
      nom: z.string(),
      disponible: z.boolean(),
      "@id": z.string(),
      "@type": z.string(),
    }),         // objet complet
    z.string(), // ou URL string
    z.null(),   // ou null si autorisé
  ]).nullable(),
})

// Schéma complet pour Ingredient (lecture depuis l’API)
export const ingredientSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  disponible: z.boolean(),
  prix_suppl: z.number(),
  produit: z.union([
    produitSchema, // objet complet
    z.string(),    // ou string (URI)
    z.null(),      // ou null si facultatif
  ]).nullable(),
})

// Schéma pour la création d’un ingrédient (POST)
export const ingredientCreateSchema = z.object({
  nom: z.string().max(150),
  disponible: z.boolean(),
  prix_suppl: z.number(),
  produit: z.string().nonempty(), // URI du produit (ex: "/api/produits/1")
})

// Types TypeScript associés
export type Ingredient = z.infer<typeof ingredientSchema>
export type IngredientCreate = z.infer<typeof ingredientCreateSchema>
export type Produit = z.infer<typeof produitSchema>
