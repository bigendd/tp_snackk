import { useViandes } from '../context/viandes-context'
import { ViandeActionDialog } from './viandes-action-dialog'
import { Produit } from '@/features/products/data/schema'

interface Props {
  produits: Produit[] // ⚠️ Prop obligatoire
}

export function ViandesDialogs({ produits }: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useViandes()

  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      <ViandeActionDialog
        key="viande-add"
        open={open === 'add'}
        produits={produits}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <ViandeActionDialog
          key={`viande-edit-${currentRow.id}`}
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
