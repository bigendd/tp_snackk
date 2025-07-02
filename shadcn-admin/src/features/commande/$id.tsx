import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCommande } from '@/lib/api/commandeApi'

type Commande = {
  id: number
  nom: string
  disponible: boolean
}

export const Route = createFileRoute('/_authenticated/commande/$id')({
  component: CommandeDetailPage,
})

export default function CommandeDetailPage() {
  const { id } = Route.useParams()
  const [commande, setCommande] = useState<Commande | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCommande() {
      try {
        const response = await getCommande(Number(id))
        setCommande(response.data)
      } catch (err) {
        console.error('Erreur lors du chargement de la commande :', err)
        setError("Impossible de charger la commande.")
      } finally {
        setLoading(false)
      }
    }

    fetchCommande()
  }, [id])

  if (loading) return <div className="p-6">Chargement...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Détails de la commande</h1>

      {commande && (
        <div className="space-y-4">
          <p><strong>ID :</strong> {commande.id}</p>
          <p><strong>Nom :</strong> {commande.nom}</p>
          <p><strong>Disponible :</strong> {commande.disponible ? 'Oui' : 'Non'}</p>
        </div>
      )}
    </div>
  )
}
