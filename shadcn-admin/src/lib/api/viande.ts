import apiClient from "@/lib/api/apiClient";

export const getViandes = () => apiClient.get("/viandes");