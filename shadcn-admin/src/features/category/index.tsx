'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/categories-columns'

import { CategoriesDialogs } from './components/categories-dialogs'
import { CategoriesTable } from './components/data-table'
import CategoriesProvider from './context/categories-context'
import { categoryListSchema, Category } from './data/schema'
import { getCategories } from './data/categories'
import { AddCategoryButton } from './components/add-categories'

export default function Categories() {
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      try {
        const categoriesFromApi = await getCategories()
        const parsed = categoryListSchema.parse(categoriesFromApi)
        setCategoryList(parsed.member)
      } catch (err) {
        console.error('Erreur de validation des catégories :', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryCreated = (newCategory: Category) => {
    setCategoryList(prev => [newCategory, ...prev])
  }

  return (
    <CategoriesProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Liste des catégories</h2>
            <p className="text-muted-foreground">
              Gérez vos catégories et leur disponibilité ici.
            </p>
          </div>
          <AddCategoryButton onCategoryCreated={handleCategoryCreated} /> {/* <-- bouton ajouté ici */}
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {loading ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Chargement des catégories...
            </div>
          ) : categoryList.length === 0 ? (
            <div className="w-full py-10 text-center text-muted-foreground">
              Aucune catégorie trouvée.
            </div>
          ) : (
            <CategoriesTable data={categoryList} columns={columns} />
          )}
        </div>
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
