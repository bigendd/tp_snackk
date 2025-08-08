'use client'
import { useCommande } from '../context/commande-context'
import { CommandeActionDialog } from './commande-action-dialog'
import { CommandeDeleteDialog } from './commande-delete-dialog'

export function CommandeDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCommande()

  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      {/* Dialog de création */}
      <CommandeActionDialog
        key="commande-add"
        mode="add"
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />

      {/* Dialogs nécessitant une commande sélectionnée */}
      {currentRow && (
        <>
          {/* Dialog de modification */}
          {/* <CommandeActionDialog
            key={`commande-edit-${currentRow.id}`}
            mode="edit"
            open={open === 'edit'}
            currentRow={currentRow}
            onOpenChange={(isOpen) => {
              if (!isOpen) handleClose()
            }}
          /> */}

          {/* Dialog de suppression */}
          {/* <CommandeDeleteDialog
            key={`commande-delete-${currentRow.id}`}
            open={open === 'delete'}
            commande={currentRow}
            onOpenChange={(isOpen) => {
              if (!isOpen) handleClose()
            }}
            onConfirm={() => {
              handleClose()
            }}
          /> */}
        </>
      )}
    </>
  )
}
