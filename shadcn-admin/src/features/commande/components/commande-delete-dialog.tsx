'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

// Adapter ce type selon ta vraie entité Commande
interface Commande {
  id?: number
  client: string
  livree: boolean
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Commande
}

export function CommandeDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.client) return
    onOpenChange(false)
    showSubmittedData(currentRow, 'La commande suivante a été supprimée :')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.client}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />
          Supprimer la commande
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Êtes-vous sûr de vouloir supprimer la commande du client{' '}
            <span className='font-bold'>{currentRow.client}</span> ?
            <br />
            Cette action supprimera définitivement cette commande
            {currentRow.livree ? ' (déjà livrée)' : ' (non livrée)'}.
            <br />
            Cette action est irréversible.
          </p>
          <Label className='my-2'>
            Nom du client :
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Saisissez le nom du client pour confirmer la suppression.'
            />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Attention !</AlertTitle>
            <AlertDescription>
              Cette opération est définitive. Aucune récupération ne sera possible.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Supprimer'
      destructive
    />
  )
}
