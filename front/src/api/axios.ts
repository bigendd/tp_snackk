import axios from "axios";
import { useAuth } from "../store/useAuth";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
