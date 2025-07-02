import { useCategories } from '../context/categories-context'
import { CategoryActionDialog } from './categories-action-dialog'

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategories()
  
  // Fonction pour fermer la dialog et réinitialiser currentRow
  function handleClose() {
    setOpen(null)
    setCurrentRow(null)
  }
  
  return (
    <>
      <CategoryActionDialog
        key='category-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose()
        }}
      />
      {currentRow && (
        <>
          <CategoryActionDialog
            key={`category-edit-${currentRow.id}`}
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
