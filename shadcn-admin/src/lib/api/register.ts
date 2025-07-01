import axios from "@/lib/api/apiClient"

export const register = async (email: string, password: string) => {
  const response = await axios.post("/register", {
    email,
    password,
  })

  console.log("Register response:", response.data);
  return response.data 
}
