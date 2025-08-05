'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createIngredient } from '../data/ingredients'
import type { Ingredient, Produit } from '../data/schema'

type AddIngredientButtonProps = {
  onIngredientCreated?: (newIngredient: Ingredient) => void
  produits: Produit[]
}

export function AddIngredientButton({
  onIngredientCreated,
  produits,
}: AddIngredientButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [produit, setProduit] = useState<Produit | null>(null)

  useEffect(() => {
    if (isOpen && produits.length > 0) {
      setProduit(produits[0])
      setNom('')
      setDisponible(true)
      setError('')
    }
  }, [isOpen, produits])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nom.trim()) {
      setError('Le nom est obligatoire')
      return
    }

    if (!produit) {
      setError('Le produit est obligatoire')
      return
    }

    setIsSubmitting(true)
    try {
      const trimmedNom = nom.trim()

      const newProduct = await createIngredient({
        nom: trimmedNom,
        disponible,
        prix_suppl: 0, 
        produit: `/api/produits/${produit.id}`,
      })

      if (newProduct) {
        onIngredientCreated?.(newProduct)
        setIsOpen(false)
      } else {
        setError('Erreur lors de la création de l\'ingredient')
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError('Erreur : ' + JSON.stringify(err.response.data))
      } else {
        setError('Erreur lors de la création du produit')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un ingredient</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Ajouter un ingredient</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouvel
            ingredient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='nom'>Nom</Label>
            <Input
              id='nom'
              type='text'
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='disponible'
              checked={disponible}
              onCheckedChange={(checked) => setDisponible(!!checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor='disponible'>Disponible</Label>
          </div>

          <div>
            <Label htmlFor='produit'>Produit</Label>
            <select
              id='produit'
              value={produit ? produit.id : ''}
              onChange={(e) => {
                const selectedProd = produits.find(
                  (prod) => prod.id === parseInt(e.target.value)
                )
                setProduit(selectedProd ?? null)
              }}
              disabled={isSubmitting}
              required
              className='w-full rounded border px-2 py-1'
            >
              {Array.isArray(produits) &&
                produits.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nom}
                  </option>
                ))}
            </select>
          </div>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
