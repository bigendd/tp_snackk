'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getColumns } from './components/sauces-columns'

import { SaucesDialogs } from './components/sauces-dialogs'
import { SaucesTable } from './components/data-table'
import SaucesProvider from './context/sauces-context'
import { sauceSchema, Sauce } from './data/schema'
import { getSauces } from './data/sauces'
import { AddSauceButton } from './components/add-sauces'
import { produitSchema, Produit } from '../products/data/schema'
import { getProduits } from '../products/data/produits'

export default function Sauces() {
  const [sauceList, setSauceList] = useState<Sauce[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSauces() {
      setLoading(true)
      try {
        const saucesFromApi = await getSauces()
        const parsed = saucesFromApi.map((s: any) => sauceSchema.parse(s))
        setSauceList(parsed)
      } catch (err) {
        console.error('Erreur de validation des sauces :', err)
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

    fetchSauces()
    fetchProduits()
  }, [])

  const columns = getColumns(produits)

  const handleSauceCreated = (newSauce: Sauce) => {
    setSauceList(prev => [newSauce, ...prev])
  }

  return (
    <SaucesProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Liste des sauces</h2>
            <p className="text-muted-foreground">
              Gérez vos sauces et leur disponibilité ici.
            </p>
          </div>
          <AddSauceButton onSauceCreated={handleSauceCreated} produits={produits} />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des sauces...
            </div>
          ) : sauceList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucune sauce trouvée.
            </div>
          ) : (
            <SaucesTable data={sauceList} columns={columns} />
          )}
        </div>
      </Main>

<SaucesDialogs produits={produits} />
    </SaucesProvider>
  )
}
