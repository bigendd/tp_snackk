'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox' // si tu as ce composant
import { createCommande } from '../data/commande'
import { getProduits } from '../data/produit'

type AddCommandeButtonProps = {
  onCommandeCreated?: (newCommande: any) => void
}

export function AddCommandeButton({ onCommandeCreated }: AddCommandeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [produits, setProduits] = useState<any[]>([])
  const [selectedProduits, setSelectedProduits] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')


  useEffect(() => {
    const loadProduits = async () => {
      const result = await getProduits()
      setProduits(result)
    }
    loadProduits()
  }, [])

  const toggleProduit = (iri: string) => {
    setSelectedProduits((prev) =>
      prev.includes(iri) ? prev.filter(p => p !== iri) : [...prev, iri]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nom.trim()) {
      setError('Le nom est obligatoire')
      return
    }

    if (selectedProduits.length === 0) {
      setError('Veuillez sélectionner au moins un produit')
      return
    }

    setIsSubmitting(true)
    try {
      const newCommande = await createCommande({
        nom: nom.trim(),
        disponible,
        produits: selectedProduits,
      })

      if (newCommande) {
        onCommandeCreated?.(newCommande)
        setNom('')
        setSelectedProduits([])
        setIsOpen(false)
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Passer une commande</DialogTitle>
          <DialogDescription>Sélectionnez les produits</DialogDescription>
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

          <div>
            <Label>Produits</Label>
            <div className="grid gap-2 max-h-[150px] overflow-y-auto border p-2 rounded">
              {produits.map((produit) => (
                <label key={produit['@id']} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProduits.includes(produit['@id'])}
                    onChange={() => toggleProduit(produit['@id'])}
                  />
                  {produit.nom}
                </label>
              ))}
            </div>
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
