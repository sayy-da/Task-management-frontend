import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    set({ user: data.user });
  },

  register: async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },
}));

export default useAuthStore;