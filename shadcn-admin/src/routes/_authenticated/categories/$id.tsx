import { createFileRoute } from '@tanstack/react-router'
import CategoryDetailPage from '@/features/category/$id'

export const Route = createFileRoute('/_authenticated/categories/$id')({
  component: CategoryDetailPage,
})


