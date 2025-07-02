import { Category } from './schema'
import apiClient from '@/lib/api/apiClient'

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get('/categories')
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement des catégories :', error)
    return []
  }
}

export async function createCategory(category: Omit<Category, 'id' | '@id' | '@type'>): Promise<Category | null> {
  try {
    // Prépare un payload avec @context (requis pour JSON-LD)
    const payload = {
      '@context': '/api/contexts/Category',
      ...category,
    };

    const response = await apiClient.post('/categories', payload, {
      headers: {
        'Content-Type': 'application/ld+json',  // Surcharge ici le content-type pour JSON-LD
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
    return null;
  }
}


export async function updateCategory(id: number, category: Partial<Omit<Category, 'id' | '@id' | '@type'>>): Promise<Category | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Category',
      ...category,
    };
    const response = await apiClient.put(`/categories/${id}`, payload, {
      headers: {
        'Content-Type': 'application/ld+json',  // Surcharge ici le content-type pour JSON-LD
      },
    }
    )
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie :', error)
    return null
  }
}

export async function deleteCategory(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/categories/${id}`, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error)
    return false
  }
}


export async function getCategory(id: number): Promise<Category | null> {
  try {
    const response = await apiClient.get(`/categories/${id}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement de la catégorie :', error)
    return null
  }
}