
import { createFileRoute } from '@tanstack/react-router'
import ingredientListPage from '@/features/ingredient'

export const Route = createFileRoute('/_authenticated/ingredients/')({
  component: ingredientListPage,
})


