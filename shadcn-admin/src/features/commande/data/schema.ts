import { z } from 'zod'

// Enums correspondant à votre backend PHP
export const ModeConsommationEnum = z.enum(['SUR_PLACE', 'A_EMPORTER', 'LIVRAISON'])
export const MoyenPaiementEnum = z.enum(['CARTE', 'ESPECE', 'CHEQUE', 'VIREMENT'])

// Schéma pour les produits (ce que vous aviez appelé "commande")
export const produitSchema = z.object({
  id: z.number(),
  nom: z.string(),
  prix: z.number(),
  disponible: z.boolean(),
  "@id": z.string(),
  "@type": z.string(),
})

export const produitListSchema = z.object({
  "@context": z.string(),
  "@id": z.string(),
  "@type": z.string(),
  totalItems: z.number(),
  member: z.array(produitSchema),
})

// Schéma pour un produit dans le panier/commande
export const commandeProduitSchema = z.object({
  id: z.number().optional(),
  produit: produitSchema,
  quantite: z.number().min(1),
  prixUnitaire: z.number(),
})

// Schéma pour les informations de commande
export const commandeInfoSchema = z.object({
  totalTTC: z.number(),
  tva: z.number().optional(),
  remise: z.number().optional(),
  commentaire: z.string().optional(),
})

// Schéma pour une commande complète
export const commandeSchema = z.object({
  id: z.number().optional(),
  date: z.string().datetime(),
  modeCons: ModeConsommationEnum,
  moyenPaiment: MoyenPaiementEnum,
  user: z.object({
    id: z.number(),
    nom: z.string(),
    email: z.string().email(),
  }).optional(),
  commandeProduits: z.array(commandeProduitSchema),
  commandeInfo: commandeInfoSchema,
})

// Schéma pour créer une nouvelle commande (sans ID)
export const createCommandeSchema = commandeSchema.omit({ id: true })

// Schéma pour le panier (avant validation finale)
export const panierSchema = z.object({
  items: z.array(z.object({
    produit: produitSchema,
    quantite: z.number().min(1),
  })),
  modeCons: ModeConsommationEnum.optional(),
  moyenPaiment: MoyenPaiementEnum.optional(),
  commentaire: z.string().optional(),
})

// Types TypeScript inférés
export type Produit = z.infer<typeof produitSchema>
export type ProduitList = z.infer<typeof produitListSchema>
export type CommandeProduit = z.infer<typeof commandeProduitSchema>
export type CommandeInfo = z.infer<typeof commandeInfoSchema>
export type Commande = z.infer<typeof commandeSchema>
export type CreateCommande = z.infer<typeof createCommandeSchema>
export type Panier = z.infer<typeof panierSchema>

// Schéma pour la validation du formulaire de commande
export const commandeFormSchema = z.object({
  modeCons: ModeConsommationEnum,
  moyenPaiment: MoyenPaiementEnum,
  commentaire: z.string().optional(),
  // Informations utilisateur si nécessaire
  nom: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
})

export type CommandeForm = z.infer<typeof commandeFormSchema>