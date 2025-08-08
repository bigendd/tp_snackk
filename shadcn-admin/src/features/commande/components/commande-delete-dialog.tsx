'use client'
import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useCommande } from '../context/commande-context'
import { deleteCommande } from '../data/commande'
import { Commande } from '../data/schema'
import { toast } from 'sonner' // ou votre système de toast

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  commande: Commande
  onConfirm?: () => void
}

export function CommandeDeleteDialog({ open, onOpenChange, commande, onConfirm }: Props) {
  const [confirmValue, setConfirmValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { refreshCommandes } = useCommande()

  // Récupérer l'identifiant unique de la commande
  const commandeIdentifier = `CMD-${commande.id}`
  
  // Calculer le total pour affichage
  const totalCommande = commande.commandeInfo?.totalTTC || 0
  
  // Format de la date
  const dateCommande = new Date(commande.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const handleDelete = async () => {
    if (confirmValue.trim() !== commandeIdentifier) return
    if (!commande.id) return

    setIsDeleting(true)
    
    try {
      const success = await deleteCommande(commande.id)
      
      if (success) {
        toast.success('Commande supprimée avec succès')
        onOpenChange(false)
        refreshCommandes()
        onConfirm?.()
      } else {
        toast.error('Erreur lors de la suppression de la commande')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression de la commande')
    } finally {
      setIsDeleting(false)
    }
  }

  // Reset du formulaire quand le dialog se ferme
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmValue('')
      setIsDeleting(false)
    }
    onOpenChange(isOpen)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      handleConfirm={handleDelete}
      disabled={confirmValue.trim() !== commandeIdentifier || isDeleting}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />
          Supprimer la commande
        </span>
      }
      desc={
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Détails de la commande :</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">ID:</span> {commandeIdentifier}</p>
              <p><span className="font-medium">Date:</span> {dateCommande}</p>
              <p><span className="font-medium">Mode:</span> {commande.modeCons?.replace('_', ' ')}</p>
              <p><span className="font-medium">Paiement:</span> {commande.moyenPaiment}</p>
              <p><span className="font-medium">Total:</span> {totalCommande.toFixed(2)} €</p>
              {commande.user && (
                <p><span className="font-medium">Client:</span> {commande.user.nom}</p>
              )}
              <p>
                <span className="font-medium">Articles:</span> {commande.commandeProduits?.length || 0} produit(s)
              </p>
            </div>
          </div>

          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer cette commande ?
            <br />
            Cette action supprimera définitivement la commande et tous les éléments associés.
            <br />
            <span className="font-semibold text-red-600">Cette action est irréversible.</span>
          </p>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Pour confirmer, saisissez : <span className="font-mono bg-gray-100 px-1 rounded">{commandeIdentifier}</span>
            </Label>
            <Input
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
              placeholder="Saisissez l'identifiant de la commande"
              className="font-mono"
              disabled={isDeleting}
            />
          </div>

          <Alert variant="destructive">
            <AlertTitle>Attention !</AlertTitle>
            <AlertDescription>
              Cette opération est définitive. La commande et toutes ses données seront perdues.
              Aucune récupération ne sera possible après la suppression.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? "Suppression..." : "Supprimer"}
      destructive
    />
  )
}