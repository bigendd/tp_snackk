'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getColumns } from './components/viandes-columns'

import { ViandesDialogs } from './components/viandes-dialogs'
import { ViandesTable } from './components/data-table'
import ViandesProvider from './context/viandes-context'
import { viandeSchema, Viande } from './data/schema'
import { getViandes } from './data/viandes'
import { AddViandeButton } from './components/add-viandes'
import { produitSchema, Produit } from '../products/data/schema'
import { getProduits } from '../products/data/produits'

export default function Viandes() {
  const [viandeList, setViandeList] = useState<Viande[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchViandes() {
      setLoading(true)
      try {
        const viandesFromApi = await getViandes()
        const parsed = viandesFromApi.map((v: any) => viandeSchema.parse(v))
        setViandeList(parsed)
      } catch (err) {
        console.error('Erreur de validation des viandes :', err)
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

    fetchViandes()
    fetchProduits()
  }, [])

  const columns = getColumns(produits)

  const handleViandeCreated = (newViande: Viande) => {
    setViandeList(prev => [newViande, ...prev])
  }

  return (
    <ViandesProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Liste des viandes</h2>
            <p className="text-muted-foreground">
              Gérez vos viandes et leur disponibilité ici.
            </p>
          </div>
          <AddViandeButton onViandeCreated={handleViandeCreated} produits={produits} />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des viandes...
            </div>
          ) : viandeList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucune viande trouvée.
            </div>
          ) : (
            <ViandesTable data={viandeList} columns={columns} />
          )}
        </div>
      </Main>

      <ViandesDialogs produits={produits} />
    </ViandesProvider>
  )
}
