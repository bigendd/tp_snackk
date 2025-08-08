import apiClient from '@/lib/api/apiClient'
import { Produit, produitSchema } from '@/features/products/data/schema'

export async function getProduitsByCategory(
  categoryId: number
): Promise<Produit[]> {
  try {
    const response = await apiClient.get('/produits', {
      params: {
        'category.id': categoryId,
        disponible: true,
      }
    })

    const data = response.data

    if (Array.isArray(data.member)) {
      return data.member
        .map((p: unknown, index: number) => {
  try {
    return produitSchema.parse(p)
  } catch (err) {
    console.error(`Produit à l'index ${index} invalide :`, err)
    return null
  }
})

    }

    console.error('Format inattendu pour les produits', data)
    return []
  } catch (error) {
    console.error('Erreur lors du chargement des produits :', error)
    return []
  }
}
