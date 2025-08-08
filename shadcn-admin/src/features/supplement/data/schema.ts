import { z } from 'zod'

export const produitSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  description: z.string().optional(),
  prix_base: z.number().optional(),
  disponible: z.boolean(),
    prix_suppl: z.number().optional(),  // <-- ici, prix_suppl optionnel et bien défini
})

export const supplementSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  disponible: z.boolean(),
  produit: z.union([produitSchema, z.string(), z.null()]).nullable(),
    prix_suppl: z.number().optional(), // <-- idem ici si le supplément peut avoir un prix_suppl
})

export const supplementCreateSchema = z.object({
  nom: z.string().max(150),
  disponible: z.boolean(),
  produit: z.string().nonempty(),
})

export type Supplement = z.infer<typeof supplementSchema>
export type SupplementCreate = z.infer<typeof supplementCreateSchema>
export type Produit = z.infer<typeof produitSchema>