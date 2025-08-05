import { Sauce } from './schema'  // adapte le chemin si besoin
import apiClient from '@/lib/api/apiClient'
import type { SauceCreate } from './schema'
import { sauceSchema } from './schema'


// Récupérer la liste des produits
export async function getSauces(): Promise<Sauce[]> {
  try {
    const response = await apiClient.get('/sauces')
    const data = response.data

    if (Array.isArray(data.member)) {
      // On valide chaque produit et on filtre les invalides en loggant l'erreur
      const sauces: Sauce[] = []

      data.member.forEach((prod: unknown, index: number) => {
        try {
          const validSauce = sauceSchema.parse(prod)
          sauces.push(validSauce)
        } catch (err) {
          console.error(`Sauce à l'index ${index} invalide :`, err)
        }
      })

      return sauces
    }

    console.error('Format inattendu pour les sauces', data)
    return []
  } catch (error) {
    console.error('Erreur lors du chargement des Sauces :', error)
    return []
  }
}



// Récupérer un produit par son id
export async function getSauce(id: number): Promise<Sauce | null> {
  try {
    const response = await apiClient.get(`/sauces/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erreur lors du chargement du Sauce ${id} :`, error)
    return null
  }
}


export async function createSauce(data: SauceCreate): Promise<Sauce | null> {
  try {
    // Prépare le payload avec le contexte JSON-LD
    const payload = {
      '@context': '/api/contexts/Sauce',
      ...data,
    }

    const response = await apiClient.post('/sauces', payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return response.data as Sauce
  } catch (error: any) {
    console.error('Erreur lors de la création du produit :', error.response?.data || error.message || error)
    return null
  }
}


// Mettre à jour un produit
export async function updateSauce(
  id: number,
  sauce: Partial<Omit<Sauce, 'id' | '@id' | '@type'>>
): Promise<Sauce | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Sauce',
      ...sauce,
    }

    const response = await apiClient.put(`/sauces/${id}`, payload, {
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

// Supprimer un Sauce
export async function deleteSauce(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/sauces/${id}`, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression du Sauce ${id} :`, error)
    return false
  }
}
