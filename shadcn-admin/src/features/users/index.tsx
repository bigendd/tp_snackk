'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { userListSchema, User } from './data/schema'
import { getUsers } from './data/users'

export default function Users() {
  const [userList, setUserList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const usersFromApi = await getUsers()
        const parsed = userListSchema.parse(usersFromApi)
        setUserList(parsed.member)
      } catch (err) {
        console.error('Erreur de validation des utilisateurs :', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <UsersProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des utilisateurs...
            </div>
          ) : userList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucun utilisateur trouvé.
            </div>
          ) : (
            <UsersTable data={userList} columns={columns} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
