import apiClient from "@/lib/api/apiClient";

export const getProducts = () => apiClient.get("/products");
export const getProduct = (id: number) => apiClient.get(`/products/${id}`);
export const createProduct = (data: any) => apiClient.post("/products", data);
export const updateProduct = (id: number, data: any) => apiClient.put(`/products/${id}`, data);
export const deleteProduct = (id: number) => apiClient.delete(`/products/${id}`);
