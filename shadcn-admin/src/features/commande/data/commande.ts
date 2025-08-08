import { Commande, CreateCommande, CommandeInfo } from './schema'
import apiClient from '@/lib/api/apiClient'

// Récupérer toutes les commandes
export async function getCommandes(): Promise<Commande[]> {
  try {
    const response = await apiClient.get('/commandes')
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement des commandes :', error)
    return []
  }
}

// Récupérer une commande par ID
export async function getCommande(id: number): Promise<Commande | null> {
  try {
    const response = await apiClient.get(`/commandes/${id}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement de la commande :', error)
    return null
  }
}

// Créer une nouvelle commande
export async function createCommande(commande: {
  modeCons: 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON'
  moyenPaiment: 'CARTE' | 'ESPECE' | 'CHEQUE' | 'VIREMENT'
  userId?: number
  commandeProduits: Array<{
    produitId: number
    quantite: number
    prixUnitaire: number
  }>
  commandeInfo: {
    totalTTC: number
    tva?: number
    remise?: number
    commentaire?: string
  }
}): Promise<Commande | null> {
  try {
    const payload = {
      '@context': '/api/contexts/Commande',
      date: new Date().toISOString(),
      modeCons: commande.modeCons,
      moyenPaiment: commande.moyenPaiment,
      user: commande.userId ? `/api/users/${commande.userId}` : null,
      commandeProduits: commande.commandeProduits.map(cp => ({
        produit: `/api/produits/${cp.produitId}`,
        quantite: cp.quantite,
        prixUnitaire: cp.prixUnitaire
      })),
      commandeInfo: commande.commandeInfo
    }

    const response = await apiClient.post('/commandes', payload, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Erreur lors de la création de la commande :', error)
    return null
  }
}

// Mettre à jour une commande (principalement pour changer le statut)
export async function updateCommande(
  id: number, 
  updates: Partial<{
    modeCons: 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON'
    moyenPaiment: 'CARTE' | 'ESPECE' | 'CHEQUE' | 'VIREMENT'
    commandeInfo: Partial<CommandeInfo>
  }>
): Promise<Commande | null> {
  try {
    const response = await apiClient.put(`/commandes/${id}`, updates, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande :', error)
    return null
  }
}

// Supprimer une commande
export async function deleteCommande(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/commandes/${id}`)
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande :', error)
    return false
  }
}

// Récupérer les commandes d'un utilisateur
export async function getCommandesUtilisateur(userId: number): Promise<Commande[]> {
  try {
    const response = await apiClient.get(`/users/${userId}/commandes`)
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement des commandes utilisateur :', error)
    return []
  }
}

// Calculer le total d'une commande côté client (utilitaire)
export function calculerTotalCommande(commandeProduits: Array<{
  quantite: number
  prixUnitaire: number
}>): number {
  return commandeProduits.reduce((total, item) => 
    total + (item.quantite * item.prixUnitaire), 0
  )
}

// Valider une commande (changer son statut si vous avez un enum Status)
export async function validerCommande(id: number): Promise<Commande | null> {
  try {
    const response = await apiClient.patch(`/commandes/${id}/valider`, {}, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la validation de la commande :', error)
    return null
  }
}

// Annuler une commande
export async function annulerCommande(id: number): Promise<Commande | null> {
  try {
    const response = await apiClient.patch(`/commandes/${id}/annuler`, {}, {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande :', error)
    return null
  }
}