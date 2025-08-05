import { Produit } from './schema'  // adapte le chemin si besoin
import apiClient from '@/lib/api/apiClient'
import type { ProduitCreate } from '../data/schema'
import { produitSchema } from './schema'


// Récupérer la liste des produits
export async function getProduits(): Promise<Produit[]> {
  try {
    const response = await apiClient.get('/produits')
    const data = response.data

    if (Array.isArray(data.member)) {
      // On valide chaque produit et on filtre les invalides en loggant l'erreur
      const produits: Produit[] = []

      data.member.forEach((prod: unknown, index: number) => {
        try {
          const validProduit = produitSchema.parse(prod)
          produits.push(validProduit)
        } catch (err) {
          console.error(`Produit à l'index ${index} invalide :`, err)
        }
      })

      return produits
    }

    console.error('Format inattendu pour les produits', data)
    return []
  } catch (error) {
    console.error('Erreur lors du chargement des produits :', error)
    return []
  }
}



// Récupérer un produit par son id
export async function getProduit(id: number): Promise<Produit | null> {
  try {
    const response = await apiClient.get(`/produits/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erreur lors du chargement du produit ${id} :`, error)
    return null
  }
}


export async function createProduit(data: ProduitCreate): Promise<Produit | null> {
  try {
    // Prépare le payload avec le contexte JSON-LD
    const payload = {
      '@context': '/api/contexts/Produit',
      ...data,
    }

    const response = await apiClient.post('/produits', payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return response.data as Produit
  } catch (error: any) {
    console.error('Erreur lors de la création du produit :', error.response?.data || error.message || error)
    return null
  }
}


// Mettre à jour un produit
export async function updateProduit(
  id: number,
  produit: Partial<Omit<Produit, 'id' | '@id' | '@type'>>
): Promise<Produit | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Produit',
      ...produit,
    }

    const response = await apiClient.put(`/produits/${id}`, payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return response.data
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id} :`, error)
    return null
  }
}

// Supprimer un produit
export async function deleteProduit(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/produits/${id}`, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id} :`, error)
    return false
  }
}
