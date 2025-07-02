import { Commande } from './schema'
import apiClient from '@/lib/api/apiClient'

export async function getCommande(): Promise<Commande[]> {
  try {
    const response = await apiClient.get('/commande')
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement des commandes :', error)
    return []
  }
}

export async function createCommande(commande: Omit<Commande, 'id' | '@id' | '@type'>): Promise<Commande | null> {
  try {
    
    const payload = {
      '@context': '/api/contexts/Commande',
      ...commande,
    };

    const response = await apiClient.post('/commande', payload, {
      headers: {
        'Content-Type': 'application/ld+json',  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la commande :', error);
    return null;
  }
}


export async function updateCommande(id: number, commande: Partial<Omit<Commande, 'id' | '@id' | '@type'>>): Promise<Commande | null> {
  try {
    const response = await apiClient.put(`/commandes/${id}`, commande)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande :', error)
    return null
  }
}

export async function deleteCommande(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/commandes/${id}`)
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande :', error)
    return false
  }
}

export async function getCommandes(id: string): Promise<Commande | null> {
  try {
    const response = await apiClient.get(`/commande/${id}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement de la commande :', error)
    return null
  }
}
