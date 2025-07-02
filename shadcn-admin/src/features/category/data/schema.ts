import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number(),
  nom: z.string(),
  disponible: z.boolean(),
  "@id": z.string(),
  "@type": z.string(),
})

export const categoryListSchema = z.object({
  "@context": z.string(),
  "@id": z.string(),
  "@type": z.string(),
  totalItems: z.number(),
  member: z.array(categorySchema),
})

export type Category = z.infer<typeof categorySchema>