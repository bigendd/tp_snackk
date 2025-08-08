import { z } from "zod";

// Schéma category (inchangé)
export const categorySchema = z.object({
  id: z.number(),
  nom: z.string(),
  disponible: z.boolean(),
  "@id": z.string(),
  "@type": z.string(),
});

export const produitSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  description: z.string(),
  prix_base: z.number(),
  disponible: z.boolean(),
  category: z.union([
    categorySchema,        
    z.string(),           
    z.null(),             
  ]).nullable(),          
});

// Nouveau schéma pour la création d'un produit (inchangé)
export const produitCreateSchema = z.object({
  nom: z.string().max(150),
  description: z.string(),
  prix_base: z.number(),
  disponible: z.boolean(),
  category: z.string().nonempty(), // URI en string obligatoire
});

// Nouveau : schéma pour la réponse API des catégories (collection)
export const categoriesResponseSchema = z.object({
  "@context": z.string(),
  "@id": z.string(),
  "@type": z.string(),
  totalItems: z.number(),
  member: z.array(categorySchema),
});

// Types générés
export type Produit = z.infer<typeof produitSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProduitCreate = z.infer<typeof produitCreateSchema>;
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
