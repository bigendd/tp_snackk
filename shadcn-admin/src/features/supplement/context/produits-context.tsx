import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

// Interface pour votre entité Product
interface Product {
  id?: number
  nom: string
  disponible: boolean
}

type ProductsDialogType = 'add' | 'edit' | 'delete' | 'show'

interface ProductsContextType {
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductsContext = React.createContext<ProductsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProductsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  return (
    <ProductsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const productsContext = React.useContext(ProductsContext)
  
  if (!productsContext) {
    throw new Error('useProducts has to be used within <ProductsProvider>')
  }
  
  return productsContext
}
