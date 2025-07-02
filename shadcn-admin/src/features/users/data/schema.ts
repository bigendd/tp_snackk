import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  roles: z.array(z.string()),
  password: z.string(),
  commande: z.array(z.any()), // ou z.unknown(), ou un schéma plus précis si tu veux
  userIdentifier: z.string(),
  "@id": z.string(),
  "@type": z.string(),
})

export const userListSchema = z.object({
  "@context": z.string(),
  "@id": z.string(),
  "@type": z.string(),
  totalItems: z.number(),
  member: z.array(userSchema),
})

export type User = z.infer<typeof userSchema>
