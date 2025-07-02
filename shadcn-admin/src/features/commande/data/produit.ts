import apiClient from '@/lib/api/apiClient'

export async function getProduits() {
  try {
    const response = await apiClient.get('/produits') 
    return response.data['hydra:member'] || []
  } catch (error) {
    console.error('Erreur lors du chargement des produits :', error)
    return []
  }
}
