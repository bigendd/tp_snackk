



import { createFileRoute } from '@tanstack/react-router'
import supplementListPage from '@/features/supplement'

export const Route = createFileRoute('/_authenticated/supplements/')({
  component: supplementListPage,
})


