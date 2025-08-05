import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour votre entité Product
interface Sauce {
  id?: number
  nom: string
  disponible: boolean
}

type SaucesDialogType = 'add' | 'edit' | 'delete' | 'show'

interface SaucesContextType {
  open: SaucesDialogType | null
  setOpen: (str: SaucesDialogType | null) => void
  currentRow: Sauce | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Sauce | null>>
}

const SaucesContext = React.createContext<SaucesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProductsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<SaucesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Sauce | null>(null)

  return (
    <SaucesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SaucesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSauces = () => {
  const saucesContext = React.useContext(SaucesContext)
  
  if (!saucesContext) {
    throw new Error('useSauces has to be used within <SaucesProvider>')
  }
  
  return saucesContext
}
