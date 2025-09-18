// src/store/useAuth.ts
import { create } from "zustand";
import api from "../api/axios";

// Importez les interfaces que vous venez de créer
import { User } from "../types/user";

type AuthState = {
  user: User | null; // Utilisez la nouvelle interface `User`
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
      // L'API renvoie l'utilisateur (avec ses UserInfo)
      const res = await api.post("/login", { email, password });
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({
        user: null,
        loading: false,
        error: "Identifiants incorrects ou erreur réseau."
      });
    }
  },

  logout: async () => {
    await api.post("/logout");
    set({ user: null });
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/me");
      // Mettez à jour le state avec les données typées
      set({ user: res.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));