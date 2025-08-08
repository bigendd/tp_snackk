import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour une commande complète (depuis votre schema)
interface Commande {
  id?: number
  date: string
  modeCons: 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON'
  moyenPaiment: 'CARTE' | 'ESPECE' | 'CHEQUE' | 'VIREMENT'
  user?: {
    id: number
    nom: string
    email: string
  }
  commandeProduits: Array<{
    id?: number
    produit: {
      id: number
      nom: string
      prix: number
    }
    quantite: number
    prixUnitaire: number
  }>
  commandeInfo: {
    totalTTC: number
    tva?: number
    remise?: number
    commentaire?: string
  }
  '@id'?: string
  '@type'?: string
}

// Types d'actions possibles sur les commandes
type CommandeDialogType = 'add' | 'edit' | 'view' | 'delete' | 'validate' | 'cancel'

interface CommandeContextType {
  // Gestion des dialogs
  open: CommandeDialogType | null
  setOpen: (str: CommandeDialogType | null) => void
  
  // Commande actuellement sélectionnée
  currentRow: Commande | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Commande | null>>
  
  // État de chargement
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  
  // Liste des commandes (pour éviter les re-fetch)
  commandes: Commande[]
  setCommandes: React.Dispatch<React.SetStateAction<Commande[]>>
  
  // Fonctions utilitaires
  refreshCommandes: () => void
  selectCommande: (commande: Commande, action: CommandeDialogType) => void
}

const CommandeContext = React.createContext<CommandeContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CommandeProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CommandeDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Commande | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [commandes, setCommandes] = useState<Commande[]>([])

  // Fonction pour rafraîchir la liste des commandes
  const refreshCommandes = () => {
    // Cette fonction sera appelée après création/modification/suppression
    // pour rafraîchir la liste sans re-fetch complet
    setCurrentRow(null)
    setOpen(null)
  }

  // Fonction utilitaire pour sélectionner une commande et ouvrir l'action
  const selectCommande = (commande: Commande, action: CommandeDialogType) => {
    setCurrentRow(commande)
    setOpen(action)
  }

  const contextValue: CommandeContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    isLoading,
    setIsLoading,
    commandes,
    setCommandes,
    refreshCommandes,
    selectCommande,
  }

  return (
    <CommandeContext.Provider value={contextValue}>
      {children}
    </CommandeContext.Provider>
  )
}

export const useCommande = () => {
  const commandeContext = React.useContext(CommandeContext)
  if (!commandeContext) {
    throw new Error('useCommande has to be used within <CommandeProvider>')
  }
  return commandeContext
}

// Hook personnalisé pour les actions courantes
export const useCommandeActions = () => {
  const context = useCommande()
  
  return {
    // Ouvrir le dialog de création
    openCreate: () => context.setOpen('add'),
    
    // Ouvrir le dialog d'édition
    openEdit: (commande: Commande) => context.selectCommande(commande, 'edit'),
    
    // Ouvrir le dialog de visualisation
    openView: (commande: Commande) => context.selectCommande(commande, 'view'),
    
    // Ouvrir le dialog de suppression
    openDelete: (commande: Commande) => context.selectCommande(commande, 'delete'),
    
    // Valider une commande
    openValidate: (commande: Commande) => context.selectCommande(commande, 'validate'),
    
    // Annuler une commande
    openCancel: (commande: Commande) => context.selectCommande(commande, 'cancel'),
    
    // Fermer tous les dialogs
    closeAll: () => {
      context.setOpen(null)
      context.setCurrentRow(null)
    }
  }
}

// Types exportés pour utilisation dans d'autres composants
export type { Commande, CommandeDialogType, CommandeContextType }