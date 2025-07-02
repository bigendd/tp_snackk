import { User } from './schema'
import apiClient from '@/lib/api/apiClient'

export async function getUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get('/users')
    return response.data
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs :', error)
    return []
  }
}
