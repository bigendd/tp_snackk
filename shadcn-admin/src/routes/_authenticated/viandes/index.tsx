

import { createFileRoute } from '@tanstack/react-router'
import Viande from '@/features/viande'

export const Route = createFileRoute('/_authenticated/viandes/')({
  component: Viande,
})
