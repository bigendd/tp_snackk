import { z } from 'zod'

export const produitSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  description: z.string().optional(),
  prix_base: z.number().optional(),
  disponible: z.boolean(),
})

export const supplementSchema = z.object({
  id: z.number(),
  nom: z.string().max(150),
  disponible: z.boolean(),
  produit: z.union([produitSchema, z.string(), z.null()]).nullable(),
})

export const supplementCreateSchema = z.object({
  nom: z.string().max(150),
  disponible: z.boolean(),
  produit: z.string().nonempty(),
})

export type Supplement = z.infer<typeof supplementSchema>
export type SupplementCreate = z.infer<typeof supplementCreateSchema>
export type Produit = z.infer<typeof produitSchema>