import { create } from "zustand";
import api from "../api/axios";

const useListStore = create((set, get) => ({
  lists: [],
  isLoading: false,

  fetchLists: async (boardId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/lists/board/${boardId}`);
      set({ lists: data });
    } finally {
      set({ isLoading: false });
    }
  },

  createList: async (boardId, title) => {
    const { data } = await api.post(`/lists/board/${boardId}`, { title });
    set({ lists: [...get().lists, data] });
  },

  renameList: async (listId, title) => {
    const { data } = await api.patch(`/lists/${listId}`, { title });
    set({ lists: get().lists.map((l) => (l._id === listId ? data : l)) });
  },

  deleteList: async (listId) => {
    await api.delete(`/lists/${listId}`);
    set({ lists: get().lists.filter((l) => l._id !== listId) });
  },

  moveList: async (listId, newOrder) => {
    const { data } = await api.patch(`/lists/${listId}/move`, { order: newOrder });
    // Refetch or local update
    const updatedLists = get().lists.map((l) => (l._id === listId ? data : l));
    set({ lists: updatedLists.sort((a, b) => a.order - b.order) });
  },

  clearLists: () => set({ lists: [], isLoading: false }),
}));

export default useListStore;