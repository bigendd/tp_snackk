import { Ingredient } from './schema' // adapte le chemin si besoin
import apiClient from '@/lib/api/apiClient'
import type { IngredientCreate } from './schema'
import { ingredientSchema } from './schema'

// Récupérer la liste des ingrédients
export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const response = await apiClient.get('/ingredients')
    const data = response.data

    if (Array.isArray(data.member)) {
      // On valide chaque ingrédient et on filtre les invalides en loggant l'erreur
      const ingredients: Ingredient[] = []

      data.member.forEach((item: unknown, index: number) => {
        try {
          const validIngredient = ingredientSchema.parse(item)
          ingredients.push(validIngredient)
        } catch (err) {
          console.error(`Ingrédient à l'index ${index} invalide :`, err)
        }
      })

      return ingredients
    }

    console.error('Format inattendu pour les ingrédients', data)
    return []
  } catch (error) {
    console.error('Erreur lors du chargement des ingrédients :', error)
    return []
  }
}

// Récupérer un ingrédient par son id
export async function getIngredient(id: number): Promise<Ingredient | null> {
  try {
    const response = await apiClient.get(`/ingredients/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erreur lors du chargement de l'ingrédient ${id} :`, error)
    return null
  }
}

export async function createIngredient(data: IngredientCreate): Promise<Ingredient | null> {
  try {
    // Prépare le payload avec le contexte JSON-LD
    const payload = {
      '@context': '/api/contexts/Ingredient',
      ...data,
    }

    const response = await apiClient.post('/ingredients', payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return response.data as Ingredient
  } catch (error: any) {
    console.error('Erreur lors de la création de l’ingrédient :', error.response?.data || error.message || error)
    return null
  }
}

// Mettre à jour un ingrédient
export async function updateIngredient(
  id: number,
  ingredient: Partial<Omit<Ingredient, 'id' | '@id' | '@type'>>
): Promise<Ingredient | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Ingredient',
      ...ingredient,
    }

    const response = await apiClient.put(`/ingredients/${id}`, payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return response.data
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l’ingrédient ${id} :`, error)
    return null
  }
}

// Supprimer un ingrédient
export async function deleteIngredient(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/ingredients/${id}`, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression de l’ingrédient ${id} :`, error)
    return false
  }
}
