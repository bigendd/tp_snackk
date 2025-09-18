// src/store/useAuth.ts
import { create } from "zustand";
import { AxiosError } from "axios";
import api from "../services/api";

export interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  image: string | null;
  telephone: string;
  adresse: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[];
  userInfo: UserInfo | null;
}

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Envoi login (tokens vont dans cookies, pas dans res.data)
      const res = await api.post("/login", { email, password });
      console.log("Réponse de l'API :", res.data);

      if (res.data?.message === "Connexion réussie") {
        // Maintenant on récupère le user avec le cookie envoyé
        const me = await api.get<User>("/me", { withCredentials: true });
        set({ user: me.data, loading: false });
      } else {
        set({
          user: null,
          loading: false,
          error: "Réponse inattendue du serveur.",
        });
      }
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Identifiants ou mot de passe incorrects.";
      set({ user: null, loading: false, error: errorMessage });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    } finally {
      set({ user: null, loading: false, error: null });
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<User>("/me");
      set({ user: res.data, loading: false });
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur", err);
      set({ user: null, loading: false, error: null });
    }
  },
}));
