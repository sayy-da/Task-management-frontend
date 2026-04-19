import { create } from "zustand";
import api from "../api/axios";

const useBoardStore = create((set) => ({
  boards: [],

  fetchBoards: async () => {
    const { data } = await api.get("/boards");
    set({ boards: data });
  },

  createBoard: async (title) => {
    const { data } = await api.post("/boards", { title });
    set((s) => ({ boards: [data, ...s.boards] }));
  },

  deleteBoard: async (id) => {
    await api.delete(`/boards/${id}`);
    set((s) => ({ boards: s.boards.filter((b) => b._id !== id) }));
  },
}));

export default useBoardStore;