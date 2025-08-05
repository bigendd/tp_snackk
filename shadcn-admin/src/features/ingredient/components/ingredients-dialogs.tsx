import { useIngredients } from '../context/ingredients-context'
import { IngredientActionDialog } from './ingredients-action-dialog'
import { Produit } from '@/features/products/data/schema'

interface Props {
  produits: Produit[] // ⚠️ Ajout de la prop obligatoire
}

export function IngredientsDialogs({ produits }: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useIngredients()

  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      <IngredientActionDialog
        key="ingredient-add"
        open={open === 'add'}
        produits={produits} // ✅ Passer les produits ici
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <IngredientActionDialog
          key={`ingredient-edit-${currentRow.id}`}
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
