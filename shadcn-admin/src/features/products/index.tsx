'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getColumns } from './components/produits-columns'

import { ProductsDialogs } from './components/produits-dialogs'
import { ProduitsTable } from './components/data-table'
import ProduitsProvider from './context/produits-context'
import { produitSchema, Produit } from './data/schema'
import { getProduits } from './data/produits'
import { AddProductButton } from './components/add-produits'
import { categoryListSchema, Category } from '../category/data/schema'

import { getCategories } from '../category/data/categories'

export default function Produits() {
  const [produitList, setProduitList] = useState<Produit[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduits() {
      setLoading(true)
      try {
        const produitsFromApi = await getProduits()
        const parsed = produitsFromApi.map((p: any) => produitSchema.parse(p))
        setProduitList(parsed)
      } catch (err) {
        console.error('Erreur de validation des produits :', err)
      } finally {
        setLoading(false)
      }
    }

    async function fetchCategories() {
      try {
        const res = await getCategories()
        const parsed = categoryListSchema.parse(res)
        setCategories(parsed.member)
      } catch (error) {
        console.error('Erreur lors du chargement ou validation des catégories', error)
        setCategories([])
      }
    }

    fetchProduits()
    fetchCategories()
  }, [])

  const columns = getColumns(categories)

  const handleProduitCreated = (newProduit: Produit) => {
    setProduitList(prev => [newProduit, ...prev])
  }

  return (
    <ProduitsProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Liste des produits</h2>
            <p className="text-muted-foreground">
              Gérez vos produits et leur disponibilité ici.
            </p>
          </div>
          <AddProductButton onProductCreated={handleProduitCreated} categories={categories} />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des produits...
            </div>
          ) : produitList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucun produit trouvé.
            </div>
          ) : (
            <ProduitsTable data={produitList} columns={columns} />
          )}
        </div>
      </Main>

      <ProductsDialogs />
    </ProduitsProvider>
  )
}
