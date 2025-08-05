import { useSauces } from '../context/sauces-context'
import { SauceActionDialog } from './sauces-action-dialog'
import { Produit } from '@/features/products/data/schema'

interface Props {
  produits: Produit[] // ⚠️ Ajout de la prop obligatoire
}

export function SaucesDialogs({ produits }: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useSauces()

  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      <SauceActionDialog
        key="sauce-add"
        open={open === 'add'}
        produits={produits} // ✅ Passer les produits ici
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <SauceActionDialog
          key={`sauce-edit-${currentRow.id}`}
          open={open === 'edit'}
          produits={produits} // ✅ Aussi ici
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose()
          }}
        />
      )}
    </>
  )
}
