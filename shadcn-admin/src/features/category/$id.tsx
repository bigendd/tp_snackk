import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCategory } from '@/lib/api/categoryApi'

type Category = {
  id: number
  nom: string
  disponible: boolean
}

export const Route = createFileRoute('/_authenticated/categories/$id')({
  component: CategoryDetailPage,
})

export default function CategoryDetailPage() {
  const { id } = Route.useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await getCategory(Number(id))
        setCategory(response.data)
      } catch (err) {
        console.error('Erreur lors du chargement de la catégorie :', err)
        setError("Impossible de charger la catégorie.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  if (loading) return <div className="p-6">Chargement...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Détails de la catégorie</h1>

      {category && (
        <div className="space-y-4">
          <p><strong>ID :</strong> {category.id}</p>
          <p><strong>Nom :</strong> {category.nom}</p>
          <p><strong>Disponible :</strong> {category.disponible ? 'Oui' : 'Non'}</p>
        </div>
      )}
    </div>
  )
}
