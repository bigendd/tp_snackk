import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

interface Commande {
  id?: number
  nom: string
  disponible: boolean
}

type CommandeDialogType = 'add' | 'edit' | 'delete'

interface CommandeContextType {
  open: CommandeDialogType | null
  setOpen: (str: CommandeDialogType | null) => void
  currentRow: Commande | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Commande | null>>
}

const CommandeContext = React.createContext<CommandeContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CommandeProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CommandeDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Commande | null>(null)

  return (
    <CommandeContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CommandeContext.Provider>
  )
}

export const useCommande = () => {
  const commandeContext = React.useContext(CommandeContext)
  
  if (!commandeContext) {
    throw new Error('useCommande has to be used within <CommandeProvider>')
  }
  
  return commandeContext
}