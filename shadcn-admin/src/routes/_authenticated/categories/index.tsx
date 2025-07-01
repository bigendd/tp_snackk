import { createFileRoute } from '@tanstack/react-router'
import CategoryListPage from '@/features/category'

export const Route = createFileRoute('/_authenticated/categories/')({
  component:  CategoryListPage ,
})

