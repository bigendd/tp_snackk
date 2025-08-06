import { Viande } from './schema'  // adapte le chemin si besoin
import apiClient from '@/lib/api/apiClient'
import type { ViandeCreate } from './schema'
import { viandeSchema } from './schema'


// Récupérer la liste des viandes
export async function getViandes(): Promise<Viande[]> {
  try {
    const response = await apiClient.get('/viandes')
    const data = response.data

    if (Array.isArray(data.member)) {
      // On valide chaque produit et on filtre les invalides en loggant l'erreur
      const viandes: Viande[] = []

      data.member.forEach((prod: unknown, index: number) => {
        try {
          const validViande = viandeSchema.parse(prod)
          viandes.push(validViande)
        } catch (err) {
          console.error(`Viande à l'index ${index} invalide :`, err)
        }
      })

      return viandes
    }

    console.error('Format inattendu pour les viandes', data)
    return []
  } catch (error) {
    console.error('Erreur lors du chargement des Viandes :', error)
    return []
  }
}



// Récupérer une viande par son id
export async function getViande(id: number): Promise<Viande | null> {
  try {
    const response = await apiClient.get(`/viandes/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erreur lors du chargement de la Viande ${id} :`, error)
    return null
  }
}


export async function createViande(data: ViandeCreate): Promise<Viande | null> {
  try {
    // Prépare le payload avec le contexte JSON-LD
    const payload = {
      '@context': '/api/contexts/Viande',
      ...data,
    }

    const response = await apiClient.post('/viandes', payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return response.data as Viande
  } catch (error: any) {
    console.error('Erreur lors de la création du produit :', error.response?.data || error.message || error)
    return null
  }
}


// Mettre à jour une viande
export async function updateViande(
  id: number,
  viande: Partial<Omit<Viande, 'id' | '@id' | '@type'>>
): Promise<Viande | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Viande',
      ...viande,
    }

    const response = await apiClient.put(`/viandes/${id}`, payload, {
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

// Supprimer une Viande
export async function deleteViande(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/viandes/${id}`, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression de la Viande ${id} :`, error)
    return false
  }
}
