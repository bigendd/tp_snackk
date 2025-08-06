'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Viande } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Viande
}

export function ViandesDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.nom) return
    onOpenChange(false)
    showSubmittedData(currentRow, 'La viande suivante a été supprimée :')
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
          Supprimer la viande
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Êtes-vous sûr de vouloir supprimer{' '}
            <span className='font-bold'>{currentRow.nom}</span> ?
            <br />
            Cette action supprimera définitivement la viande{' '}
            {currentRow.disponible ? '(actuellement disponible)' : '(actuellement indisponible)'}{' '}
            du système. Cette action ne peut pas être annulée.
          </p>
          <Label className='my-2'>
            Nom de la viande :
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Saisissez le nom de la viande pour confirmer la suppression.'
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
