'use client'

import { useEffect, useState } from 'react'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

import { columns } from './components/commande-columns'
import { CommandeDialogs } from './components/commande-dialogs'
import { CommandeTable } from './components/data-table'
import CommandeProvider from './context/commande-context'
import { Commande as CommandeType } from './data/schema'
import { getCommandes } from './data/commande'
import  AddCommandeButton  from './components/add-commandess'

export default function Commande() {
  const [commandeList, setCommandeList] = useState<CommandeType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function fetchCommandes() {
    setLoading(true)
    try {
      const commandesFromApi = await getCommandes()

      // Si commandesFromApi est un tableau, on le garde
      // Sinon si c'est un objet Collection, on récupère member
      if (Array.isArray(commandesFromApi)) {
        setCommandeList(commandesFromApi)
      } else if ('member' in commandesFromApi) {
        setCommandeList(commandesFromApi)
      } else {
        // Cas fallback, on met un tableau vide
        setCommandeList([])
      }
    } catch (error) {
      console.error('Erreur de validation des commandes :', error)
      setCommandeList([])
    } finally {
      setLoading(false)
    }
  }
  fetchCommandes()
}, [])


  const handleCommandeCreated = (newCommande: CommandeType) => {
setCommandeList(prev => {
    console.log('prev commandes:', prev)
    console.log('new commande:', newCommande)
    return [newCommande, ...prev]
  })  }

  return (
    <CommandeProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <section className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Liste des commandes</h2>
            <p className="text-muted-foreground">
              Gérez vos commandes et leur disponibilité ici.
            </p>
          </div>
          <AddCommandeButton onCommandeCreated={handleCommandeCreated} />
        </section>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <p className="w-full py-10 text-center text-muted-foreground">
              Chargement des commandes...
            </p>
          ) : commandeList.length === 0 ? (
            <p className="w-full py-10 text-center text-muted-foreground">
              Aucune commande trouvée.
            </p>
          ) : (
            <CommandeTable data={commandeList} columns={columns} />
          )}
        </div>
      </Main>

      <CommandeDialogs />
    </CommandeProvider>
  )
}
