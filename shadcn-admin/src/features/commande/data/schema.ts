import { z } from 'zod'

export const commandeSchema = z.object({
  id: z.number(),
  nom: z.string(),
  disponible: z.boolean(),
  "@id": z.string(),
  "@type": z.string(),
})

export const commandeListSchema = z.object({
  "@context": z.string(),
  "@id": z.string(),
  "@type": z.string(),
  totalItems: z.number(),
  member: z.array(commandeSchema),
})

export type Commande = z.infer<typeof commandeSchema>
