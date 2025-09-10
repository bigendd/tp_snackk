// src/store/useAuth.ts
import { create } from "zustand";
import api from "../api/axios";

type AuthState = {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  login: async (email, password) => {
    const res = await api.post("/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
