'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'

import { getCategories } from '@/features/category/data/categories'
import { Category } from '@/features/category/data/schema'

import { getProduits } from '@/features/products/data/produits'
import { Produit } from '@/features/products/data/schema'

import { getViandes } from '@/features/viande/data/viandes'
import { Viande } from '@/features/viande/data/schema'

import { getSupplements } from '@/features/supplement/data/supplements'
import { Supplement } from '@/features/supplement/data/schema'

import { getIngredients } from '@/features/ingredient/data/ingredients'
import { Ingredient } from '@/features/ingredient/data/schema'

import { getSauces } from '@/features/sauce/data/sauces'
import { Sauce } from '@/features/sauce/data/schema'

import { Commande } from '../data/schema'

import { useOptionsForProduct } from '@/hooks/useOptionsForProduct'

type AddCommandeButtonProps = {
  onCommandeCreated?: (newCommande: Commande) => void
}

function extractIdFromIri(iri: string): number | null {
  const match = iri.match(/\/(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

type OptionSectionProps<T extends { id: number; nom: string; prix_suppl?: number }> = {
  title: string
  options: T[]
  loading: boolean
  error: unknown
  selectedOptions: T[]
  onToggleOption: (newSelectedOptions: T[]) => void
  multiSelect?: boolean
}

function OptionSection<T extends { id: number; nom: string; prix_suppl?: number }>({
  title,
  options,
  loading,
  error,
  selectedOptions,
  onToggleOption,
  multiSelect = true,
}: OptionSectionProps<T>) {
  if (loading) return <p>Chargement des {title.toLowerCase()}...</p>
  if (error) return <p className="text-red-600">Erreur lors du chargement des {title.toLowerCase()}</p>
  if (options.length === 0) return null

  const isSelected = (option: T) => selectedOptions.some((sel) => sel.id === option.id)

  const toggle = (option: T) => {
    if (multiSelect) {
      if (isSelected(option)) {
        onToggleOption(selectedOptions.filter((sel) => sel.id !== option.id))
      } else {
        onToggleOption([...selectedOptions, option])
      }
    } else {
      onToggleOption([option])
    }
  }

  return (
    <>
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {options.map((opt) => {
          const selected = isSelected(opt)
          return (
            <Card
              key={opt.id}
              className={`p-4 cursor-pointer transition-shadow ${
                selected ? 'border-2 border-blue-500 shadow-lg' : ''
              }`}
              onClick={() => toggle(opt)}
            >
              <CardHeader className="flex justify-between items-center">
                <span>{opt.nom}</span>
                {opt.prix_suppl !== undefined && opt.prix_suppl !== null && (
                  <span className="text-sm text-muted-foreground">
                    +{opt.prix_suppl.toFixed(2)} €
                  </span>
                )}
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </>
  )
}

function mapToProduitSchema(prod: Produit) {
  return {
    id: prod.id,
    nom: prod.nom,
    prix: prod.prix_base,
    prix_base: prod.prix_base,
    disponible: prod.disponible,
    "@id": `/api/produits/${prod.id}`,
    "@type": "Produit",
  }
}

export default function AddCommandeButton({ onCommandeCreated = () => {} }: AddCommandeButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<Category | null>(null)

  const [produits, setProduits] = useState<Produit[]>([])
  const [produitSelectionne, setProduitSelectionne] = useState<Produit | null>(null)

  const [viandesSelectionnees, setViandesSelectionnees] = useState<Viande[]>([])
  const [supplementsSelectionnes, setSupplementsSelectionnes] = useState<Supplement[]>([])
  const [ingredientsSelectionnes, setIngredientsSelectionnes] = useState<Ingredient[]>([])
  const [saucesSelectionnees, setSaucesSelectionnees] = useState<Sauce[]>([])

  const extractProduitId = useCallback(
    (opt: { produit: string | { id: number } | null }) => {
      if (!opt.produit) return null
      return typeof opt.produit === 'string' ? extractIdFromIri(opt.produit) : opt.produit.id
    },
    []
  )

  const fetchViandes = useCallback(() => getViandes(), [])
  const fetchSupplements = useCallback(() => getSupplements(), [])
  const fetchIngredients = useCallback(() => getIngredients(), [])
  const fetchSauces = useCallback(() => getSauces(), [])

  const {
    options: viandes,
    loading: viandesLoading,
    error: viandesError,
  } = useOptionsForProduct<Viande>(produitSelectionne?.id ?? null, fetchViandes, extractProduitId)

  const {
    options: supplements,
    loading: supplementsLoading,
    error: supplementsError,
  } = useOptionsForProduct<Supplement>(produitSelectionne?.id ?? null, fetchSupplements, extractProduitId)

  const {
    options: ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useOptionsForProduct<Ingredient>(produitSelectionne?.id ?? null, fetchIngredients, extractProduitId)

  const {
    options: sauces,
    loading: saucesLoading,
    error: saucesError,
  } = useOptionsForProduct<Sauce>(produitSelectionne?.id ?? null, fetchSauces, extractProduitId)

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats.filter((cat) => cat.disponible)))
      .catch((e) => console.error('Erreur chargement catégories', e))
  }, [])

  useEffect(() => {
    if (!categorieSelectionnee) {
      setProduits([])
      return
    }
    getProduits()
      .then((allProduits) => {
        const filtres = allProduits.filter((p) => {
          if (!p.disponible || !p.category) return false
          const catId =
            typeof p.category === 'string' ? extractIdFromIri(p.category) : p.category.id
          return catId === categorieSelectionnee.id
        })
        setProduits(filtres)
      })
      .catch((e) => console.error('Erreur chargement produits :', e))
  }, [categorieSelectionnee])

  const resetSelections = () => {
    setViandesSelectionnees([])
    setSupplementsSelectionnes([])
    setIngredientsSelectionnes([])
    setSaucesSelectionnees([])
  }

  const onDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setCategorieSelectionnee(null)
      setProduitSelectionne(null)
      resetSelections()
    }
  }

  const canAddCommande =
    produitSelectionne &&
    (!viandes || viandes.length === 0 || viandesSelectionnees.length === 1)

  const handleAjouterCommande = () => {
    if (!produitSelectionne) return

    const produitValide = mapToProduitSchema(produitSelectionne)

    const prixOptions = [
      ...viandesSelectionnees,
      ...supplementsSelectionnes,
      ...ingredientsSelectionnes,
      ...saucesSelectionnees,
    ].reduce((acc, opt) => acc + (opt.prix_suppl ?? 0), 0)

    const prixUnitaireTotal = produitValide.prix + prixOptions

    const commandeProduit = {
      produit: produitValide,
      quantite: 1,
      prixUnitaire: prixUnitaireTotal,
      viandes: viandesSelectionnees,
      supplements: supplementsSelectionnes,
      ingredients: ingredientsSelectionnes,
      sauces: saucesSelectionnees,
    }

    const newCommande: Commande = {
      date: new Date().toISOString(),
      modeCons: "SUR_PLACE",
      moyenPaiment: "ESPECE",
      commandeProduits: [commandeProduit],
      commandeInfo: {
        totalTTC: prixUnitaireTotal,
      },
    }

    onCommandeCreated(newCommande)

    setProduitSelectionne(null)
    resetSelections()
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>Nouvelle commande</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Créer une commande</DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => setDialogOpen(false)} className="ml-auto">
            Fermer
          </Button>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <section className="w-full">
            <h2 className="text-lg font-semibold mb-2">Catégories</h2>
            <ul>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Button
                    variant={categorieSelectionnee?.id === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategorieSelectionnee(cat)}
                    className="w-full mb-2"
                  >
                    {cat.nom}
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          <section className="w-full">
            <h2 className="text-lg font-semibold mb-2">Produits</h2>
            <ul>
              {produits.length === 0 && <p>Aucun produit dans cette catégorie</p>}
              {produits.map((prod) => (
                <li key={prod.id}>
                  <Button
                    variant={produitSelectionne?.id === prod.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProduitSelectionne(prod)}
                    className="w-full mb-2"
                  >
                    {prod.nom} — {prod.prix_base.toFixed(2)} €
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          <section className="w-full overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Options</h2>
            {!produitSelectionne && <p>Sélectionnez un produit pour voir les options</p>}

            {produitSelectionne && (
              <>
                <OptionSection
                  title="Viandes"
                  options={viandes}
                  loading={viandesLoading}
                  error={viandesError}
                  selectedOptions={viandesSelectionnees}
                  onToggleOption={setViandesSelectionnees}
                  multiSelect={false}
                />

                <OptionSection
                  title="Supplements"
                  options={supplements}
                  loading={supplementsLoading}
                  error={supplementsError}
                  selectedOptions={supplementsSelectionnes}
                  onToggleOption={setSupplementsSelectionnes}
                />

                <OptionSection
                  title="Ingrédients"
                  options={ingredients}
                  loading={ingredientsLoading}
                  error={ingredientsError}
                  selectedOptions={ingredientsSelectionnes}
                  onToggleOption={setIngredientsSelectionnes}
                />

                <OptionSection
                  title="Sauces"
                  options={sauces}
                  loading={saucesLoading}
                  error={saucesError}
                  selectedOptions={saucesSelectionnees}
                  onToggleOption={setSaucesSelectionnees}
                />
              </>
            )}
          </section>
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Annuler
          </Button>

          <Button onClick={handleAjouterCommande} disabled={!canAddCommande}>
            Ajouter la commande
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
