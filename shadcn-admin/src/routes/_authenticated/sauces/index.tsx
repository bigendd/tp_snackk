


import { createFileRoute } from '@tanstack/react-router'
import saucessListPage from '@/features/sauce'

export const Route = createFileRoute('/_authenticated/sauces/')({
  component: saucessListPage,
})


