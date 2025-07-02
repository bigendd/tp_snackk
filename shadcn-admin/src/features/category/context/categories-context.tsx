import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour votre entité Category
interface Category {
  id?: number
  nom: string
  disponible: boolean
}

type CategoriesDialogType = 'add' | 'edit' | 'delete' | 'show'

interface CategoriesContextType {
  open: CategoriesDialogType | null
  setOpen: (str: CategoriesDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CategoriesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Category | null>(null)

  return (
    <CategoriesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext)
  
  if (!categoriesContext) {
    throw new Error('useCategories has to be used within <CategoriesProvider>')
  }
  
  return categoriesContext
}