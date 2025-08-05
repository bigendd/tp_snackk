'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/commande-columns.tsx'

import { CommandeDialogs } from './components/commande-dialogs.tsx'
import { CommandeTable } from './components/data-table.tsx'
import CommandeProvider from './context/commande-context'
import { commandeListSchema, Commande as CommandeType } from './data/schema'
import { getCommande } from './data/commande'
import { AddCommandeButton } from './components/add-commande'

export default function Commande() {
  const [commandeList, setCommandeList] = useState<CommandeType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCommande() {
      setLoading(true)
      try {
        const commandeFromApi = await getCommande()
        const parsed = commandeListSchema.parse(commandeFromApi)
        setCommandeList(parsed.member)
      } catch (err) {
        console.error('Erreur de validation des commandes :', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommande()
  }, [])

  const handleCommandeCreated = (newCommande: CommandeType) => {
    setCommandeList(prev => [newCommande, ...prev])
  }

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
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Liste des commandes</h2>
            <p className="text-muted-foreground">
              Gérez vos commandes et leur disponibilité ici.
            </p>
          </div>
          <AddCommandeButton onCommandeCreated={handleCommandeCreated} />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des commandes...
            </div>
          ) : commandeList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucune commande trouvée.
            </div>
          ) : (
            <CommandeTable data={commandeList} columns={columns} />
          )}
        </div>
      </Main>

      <CommandeDialogs />
    </CommandeProvider>
  )
}
