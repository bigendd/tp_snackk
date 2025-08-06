import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour votre entité Viande
interface Viande {
  id?: number
  nom: string
  disponible: boolean
}

type ViandesDialogType = 'add' | 'edit' | 'delete' | 'show'

interface ViandesContextType {
  open: ViandesDialogType | null
  setOpen: (str: ViandesDialogType | null) => void
  currentRow: Viande | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Viande | null>>
}

const ViandesContext = React.createContext<ViandesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ViandesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ViandesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Viande | null>(null)

  return (
    <ViandesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ViandesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useViandes = () => {
  const viandesContext = React.useContext(ViandesContext)
  
  if (!viandesContext) {
    throw new Error('useViandes has to be used within <ViandesProvider>')
  }
  
  return viandesContext
}
