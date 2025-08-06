'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getColumns } from './components/supplements-columns'

import { SupplementsDialogs } from './components/supplements-dialogs'
import { SupplementsTable } from './components/data-table'
import SupplementsProvider from './context/supplements-context'
import { supplementSchema, Supplement } from './data/schema'
import { getSupplements } from './data/supplements'
import { AddSupplementButton } from './components/add-supplements'
import { produitSchema, Produit } from '../products/data/schema'
import { getProduits } from '../products/data/produits'

export default function Supplements() {
  const [supplementList, setSupplementList] = useState<Supplement[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSupplements() {
      setLoading(true)
      try {
        const supplementsFromApi = await getSupplements()
        const parsed = supplementsFromApi.map((s: any) => supplementSchema.parse(s))
        setSupplementList(parsed)
      } catch (err) {
        console.error('Erreur de validation des suppléments :', err)
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

    fetchSupplements()
    fetchProduits()
  }, [])

  const columns = getColumns(produits)

  const handleSupplementCreated = (newSupplement: Supplement) => {
    setSupplementList(prev => [newSupplement, ...prev])
  }

  return (
    <SupplementsProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Liste des suppléments</h2>
            <p className="text-muted-foreground">
              Gérez vos suppléments et leur disponibilité ici.
            </p>
          </div>
          <AddSupplementButton onSupplementCreated={handleSupplementCreated} produits={produits} />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des suppléments...
            </div>
          ) : supplementList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucun supplément trouvé.
            </div>
          ) : (
            <SupplementsTable data={supplementList} columns={columns} />
          )}
        </div>
      </Main>

      <SupplementsDialogs produits={produits} />
    </SupplementsProvider>
  )
}
