import { createFileRoute } from '@tanstack/react-router'
import ProductsListPage from '@/features/products'

export const Route = createFileRoute('/_authenticated/produits/')({
  component: ProductsListPage,
})


