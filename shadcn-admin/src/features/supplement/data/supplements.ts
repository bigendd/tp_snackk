import apiClient from '@/lib/api/apiClient'
import { Supplement, supplementSchema, SupplementCreate } from './schema'

export async function getSupplements(): Promise<Supplement[]> {
  try {
    const response = await apiClient.get('/supplements')
    const data = response.data

    if (Array.isArray(data.member)) {
      return data.member.map((item: any) => supplementSchema.parse(item))
    }
    console.error('Format inattendu pour les supplements', data)
    return []
  } catch (error) {
    console.error('Erreur lors du chargement des supplements :', error)
    return []
  }
}

export async function getSupplement(id: number): Promise<Supplement | null> {
  try {
    const response = await apiClient.get(`/supplements/${id}`)
    return supplementSchema.parse(response.data)
  } catch (error) {
    console.error(`Erreur lors du chargement du supplement ${id} :`, error)
    return null
  }
}

export async function createSupplement(data: SupplementCreate): Promise<Supplement | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Supplement',
      ...data,
    }
    const response = await apiClient.post('/supplements', payload, {
      headers: { 'Content-Type': 'application/ld+json' },
    })
    return supplementSchema.parse(response.data)
  } catch (error: any) {
    console.error('Erreur lors de la création du supplement :', error.response?.data || error.message)
    return null
  }
}

export async function updateSupplement(
  id: number,
  supplement: Partial<Omit<Supplement, 'id' | '@id' | '@type'>>
): Promise<Supplement | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Supplement',
      ...supplement,
    }
    const response = await apiClient.put(`/supplements/${id}`, payload, {
      headers: { 'Content-Type': 'application/ld+json' },
    })
    return supplementSchema.parse(response.data)
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du supplement ${id} :`, error)
    return null
  }
}

export async function deleteSupplement(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/supplements/${id}`, {
      headers: { 'Content-Type': 'application/ld+json' },
    })
    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression du supplement ${id} :`, error)
    return false
  }
}
