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
import { createProduit } from '../data/produits'
import type { Produit, Category } from '../data/schema'

type AddProductButtonProps = {
  onProductCreated?: (newProduct: Produit) => void
  categories: Category[]
}

export function AddProductButton({
  onProductCreated,
  categories,
}: AddProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')
  const [prixBase, setPrixBase] = useState<number | ''>('')
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    if (isOpen && categories.length > 0) {
      setCategory(categories[0])
      setPrixBase('')
      setNom('')
      setDescription('')
      setDisponible(true)
      setError('')
    }
  }, [isOpen, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nom.trim()) {
      setError('Le nom est obligatoire')
      return
    }
    if (!description.trim()) {
      setError('La description est obligatoire')
      return
    }
    if (prixBase === '' || prixBase <= 0) {
      setError('Le prix doit être supérieur à 0')
      return
    }
    if (!category) {
      setError('La catégorie est obligatoire')
      return
    }

    setIsSubmitting(true)
    try {
      const trimmedNom = nom.trim()
      const trimmedDesc = description.trim()

      const newProduct = await createProduit({
        nom: trimmedNom,
        disponible,
        description: trimmedDesc,
        prix_base: prixBase,
        category: `/api/categories/${category.id}`,
      })

      if (newProduct) {
        onProductCreated?.(newProduct)
        setIsOpen(false)
      } else {
        setError('Erreur lors de la création du produit')
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
        <Button>Ajouter un produit</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau
            produit.
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

          <div>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor='prix_base'>Prix de base (€)</Label>
            <Input
              id='prix_base'
              type='number'
              min={0}
              step={0.01}
              value={prixBase === '' ? '' : prixBase}
              onChange={(e) => {
                const val = e.target.value
                setPrixBase(val === '' ? '' : parseFloat(val))
              }}
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
            <Label htmlFor='category'>Catégorie</Label>
            <select
              id='category'
              value={category ? category.id : ''}
              onChange={(e) => {
                const selectedCat = categories.find(
                  (cat) => cat.id === parseInt(e.target.value)
                )
                setCategory(selectedCat ?? null)
              }}
              disabled={isSubmitting}
              required
              className='w-full rounded border px-2 py-1'
            >
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
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
