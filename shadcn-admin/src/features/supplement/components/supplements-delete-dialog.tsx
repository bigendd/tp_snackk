'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Supplement } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Supplement
}

export function SupplementsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.nom) return
    onOpenChange(false)
    showSubmittedData(currentRow, 'Le supplément suivant a été supprimé :')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.nom}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Supprimer le supplément
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Êtes-vous sûr de vouloir supprimer{' '}
            <span className='font-bold'>{currentRow.nom}</span> ?
            <br />
            Cette action supprimera définitivement le supplément{' '}
            {currentRow.disponible ? '(actuellement disponible)' : '(actuellement indisponible)'}{' '}
            du système. Cette action ne peut pas être annulée.
          </p>
          <Label className='my-2'>
            Nom du supplément :
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Saisissez le nom du supplément pour confirmer la suppression.'
            />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Attention !</AlertTitle>
            <AlertDescription>
              Veuillez faire attention, cette opération ne peut pas être annulée.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Supprimer'
      destructive
    />
  )
}
