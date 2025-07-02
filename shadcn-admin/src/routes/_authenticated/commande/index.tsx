import { createFileRoute } from '@tanstack/react-router'
import CommandeListPage from '@/features/commande'

export const Route = createFileRoute('/_authenticated/commande/')({
  component:  CommandeListPage ,
})

