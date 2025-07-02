import apiClient from "@/lib/api/apiClient";

export const getCommandes = () => apiClient.get("/commande");
export const getCommande = (id: number) => apiClient.get(`/commande/${id}`);
export const createCommande = (data: any) => apiClient.post("/commande", data);
export const updateCommande = (id: number, data: any) => apiClient.put(`/commande/${id}`, data);
export const deleteCommande = (id: number) => apiClient.delete(`/commande/${id}`);
export const getCommandeByUser = (userId: number) => apiClient.get(`/commande/user/${userId}`);
export const getCommandeByStatus = (status: string) => apiClient.get(`/commande/status/${status}`);

