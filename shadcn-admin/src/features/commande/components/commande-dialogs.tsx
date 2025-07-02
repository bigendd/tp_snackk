'use client'

import { useCommande } from '../context/commande-context'
import { CommandeActionDialog } from './commande-action-dialog.tsx'

export function CommandeDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCommande()

  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      <CommandeActionDialog
        key='commande-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <CommandeActionDialog
          key={`commande-edit-${currentRow.id}`}
          open={open === 'edit'}
          currentRow={currentRow}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose()
          }}
        />
      )}
    </>
  )
}
