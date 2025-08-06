import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour votre entité Ingredient
interface Ingredient {
  id?: number
  nom: string
  disponible: boolean
}

type IngredientsDialogType = 'add' | 'edit' | 'delete' | 'show'

interface IngredientsContextType {
  open: IngredientsDialogType | null
  setOpen: (str: IngredientsDialogType | null) => void
  currentRow: Ingredient | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Ingredient | null>>
}

const IngredientsContext = React.createContext<IngredientsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function IngredientsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<IngredientsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Ingredient | null>(null)

  return (
    <IngredientsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </IngredientsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useIngredients = () => {
  const ingredientsContext = React.useContext(IngredientsContext)
  
  if (!ingredientsContext) {
    throw new Error('useIngredients has to be used within <IngredientsProvider>')
  }
  
  return ingredientsContext
}
