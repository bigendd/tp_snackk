import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/commande/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/commande/$id"!</div>
}
