'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCommande } from '../data/commande'

type AddCommandeButtonProps = {
  onCommandeCreated?: (newCommande: any) => void
}

export function AddCommandeButton({ onCommandeCreated }: AddCommandeButtonProps) {
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
      const newCommande = await createCommande({ nom: nom.trim(), disponible })
      if (newCommande) {
        onCommandeCreated?.(newCommande) 
        setNom('')
      } else {
        setError("Erreur lors de la création de la commande")
      }
    } catch {
      setError("Erreur lors de la création de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Commander</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Passer une commande</DialogTitle>
          <DialogDescription>
            Faites votre commande
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
