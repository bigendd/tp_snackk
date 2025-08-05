import { useProducts } from '../context/produits-context'
import { ProductActionDialog } from './produits-action-dialog'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProducts()

  // Fonction pour fermer la dialog et réinitialiser currentRow
  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <>
      <ProductActionDialog
        key='product-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <>
          <ProductActionDialog
            key={`product-edit-${currentRow.id}`}
            open={open === 'edit'}
            currentRow={currentRow}
            onOpenChange={(isOpen) => {
              if (!isOpen) handleClose()
            }}
          />
        </>
      )}
    </>
  )
}
