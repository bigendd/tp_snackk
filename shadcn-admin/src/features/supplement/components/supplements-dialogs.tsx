import { useSupplements } from '../context/supplements-context'
import { SupplementActionDialog } from './supplements-action-dialog'
import { Produit } from '@/features/products/data/schema'

interface Props {
  produits: Produit[] // ⚠️ Prop obligatoire
}

export function SupplementsDialogs({ produits }: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useSupplements()

  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      <SupplementActionDialog
        key="supplement-add"
        open={open === 'add'}
        produits={produits}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <SupplementActionDialog
          key={`supplement-edit-${currentRow.id}`}
          open={open === 'edit'}
          produits={produits}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose()
          }}
        />
      )}
    </>
  )
}
