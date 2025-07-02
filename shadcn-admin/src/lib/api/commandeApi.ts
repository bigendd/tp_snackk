import apiClient from "@/lib/api/apiClient";

export const getCommandes = () => apiClient.get("/commandes");
export const getCommande = (id: number) => apiClient.get(`/commandes/${id}`);
export const createCommande = (data: any) => apiClient.post("/commandes", data);
export const updateCommande = (id: number, data: any) => apiClient.put(`/commandes/${id}`, data);
export const deleteCommande = (id: number) => apiClient.delete(`/commandes/${id}`);
export const getCommandesByUser = (userId: number) => apiClient.get(`/commandes/user/${userId}`);
export const getCommandesByStatus = (status: string) => apiClient.get(`/commandes/status/${status}`);

