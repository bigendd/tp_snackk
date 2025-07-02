'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createCategory } from '../data/categories' // <-- import ici

type AddCategoryButtonProps = {
  onCategoryCreated?: (newCategory: any) => void
}

export function AddCategoryButton({ onCategoryCreated }: AddCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nom.trim()) {
      setError('Le nom est obligatoire')
      return
    }

    setIsSubmitting(true)
    try {
      const newCategory = await createCategory({ nom: nom.trim(), disponible })
      if (newCategory) {
        onCategoryCreated?.(newCategory) // pour prévenir le parent que la catégorie a été créée
        setNom('')
        setDisponible(true)
        setIsOpen(false)
      } else {
        setError("Erreur lors de la création de la catégorie")
      }
    } catch {
      setError("Erreur lors de la création de la catégorie")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter une catégorie</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter une nouvelle catégorie.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="disponible"
              checked={disponible}
              onCheckedChange={(checked) => setDisponible(!!checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="disponible">Disponible</Label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
