// src/lib/api/auth.ts
import axios from "@/lib/api/apiClient"

export const login = async (email: string, password: string) => {
  const response = await axios.post("/login", {
    email,
    password,
  })

  return response.data // doit contenir le token
}
