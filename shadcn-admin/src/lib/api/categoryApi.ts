import apiClient from "@/lib/api/apiClient";


export const getCategories = () => apiClient.get("/categories");
export const getCategory = (id: number) => apiClient.get(`/categories/${id}`);

