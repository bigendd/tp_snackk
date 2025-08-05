'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getColumns } from './components/ingredients-columns'

import { IngredientsDialogs } from './components/ingredients-dialogs'
import { IngredientsTable } from './components/data-table'
import IngredientsProvider from './context/ingredients-context'
import { ingredientSchema, Ingredient } from './data/schema'
import { getIngredients } from './data/ingredients'
import { AddIngredientButton } from './components/add-ingredients'
import { produitSchema, Produit } from '../products/data/schema'
import { getProduits } from '../products/data/produits'

export default function Ingredients() {
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIngredients() {
      setLoading(true)
      try {
        const ingredientsFromApi = await getIngredients()
        const parsed = ingredientsFromApi.map((i: any) => ingredientSchema.parse(i))
        setIngredientList(parsed)
      } catch (err) {
        console.error('Erreur de validation des ingrédients :', err)
      } finally {
        setLoading(false)
      }
    }

    async function fetchProduits() {
      try {
        const res = await getProduits()
        const parsed = res.map((p: any) => produitSchema.parse(p))
        setProduits(parsed)
      } catch (error) {
        console.error('Erreur lors du chargement ou validation des produits', error)
        setProduits([])
      }
    }

    fetchIngredients()
    fetchProduits()
  }, [])

  const columns = getColumns(produits)

  const handleIngredientCreated = (newIngredient: Ingredient) => {
    setIngredientList(prev => [newIngredient, ...prev])
  }

  return (
    <IngredientsProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Liste des ingrédients</h2>
            <p className="text-muted-foreground">
              Gérez vos ingrédients et leur disponibilité ici.
            </p>
          </div>
          <AddIngredientButton onIngredientCreated={handleIngredientCreated} produits={produits} />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des ingrédients...
            </div>
          ) : ingredientList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucun ingrédient trouvé.
            </div>
          ) : (
            <IngredientsTable data={ingredientList} columns={columns} />
          )}
        </div>
      </Main>

      <IngredientsDialogs produits={produits} />
    </IngredientsProvider>
  )
}
