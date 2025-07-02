import apiClient from "@/lib/api/apiClient";

export const getUsers = () => apiClient.get("/users");
