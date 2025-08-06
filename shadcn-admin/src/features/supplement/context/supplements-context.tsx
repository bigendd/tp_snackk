import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour votre entité Supplement
interface Supplement {
  id?: number
  nom: string
  disponible: boolean
}

type SupplementsDialogType = 'add' | 'edit' | 'delete' | 'show'

interface SupplementsContextType {
  open: SupplementsDialogType | null
  setOpen: (str: SupplementsDialogType | null) => void
  currentRow: Supplement | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Supplement | null>>
}

const SupplementsContext = React.createContext<SupplementsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function SupplementsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<SupplementsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Supplement | null>(null)

  return (
    <SupplementsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SupplementsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSupplements = () => {
  const supplementsContext = React.useContext(SupplementsContext)
  
  if (!supplementsContext) {
    throw new Error('useSupplements has to be used within <SupplementsProvider>')
  }
  
  return supplementsContext
}
