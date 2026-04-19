import { create } from "zustand";
import api from "../api/axios";

const useTaskStore = create((set) => ({
  tasks: {},  // { listId: [tasks] }

  fetchTasks: async (listId) => {
    const { data } = await api.get(`/tasks/list/${listId}`);
    set((s) => ({ tasks: { ...s.tasks, [listId]: data } }));
  },

  createTask: async (listId, taskData) => {
    const { data } = await api.post(`/tasks/list/${listId}`, taskData);
    set((s) => ({
      tasks: { ...s.tasks, [listId]: [...(s.tasks[listId] || []), data] },
    }));
  },

  updateTask: async (taskId, listId, updates) => {
    const { data } = await api.patch(`/tasks/${taskId}`, updates);
    set((s) => ({
      tasks: {
        ...s.tasks,
        [listId]: s.tasks[listId]?.map((t) => (t._id === taskId ? data : t)),
      },
    }));
  },

  deleteTask: async (taskId, listId) => {
    await api.delete(`/tasks/${taskId}`);
    set((s) => ({
      tasks: {
        ...s.tasks,
        [listId]: s.tasks[listId]?.filter((t) => t._id !== taskId),
      },
    }));
  },

  moveTask: async (taskId, fromListId, toListId, order) => {
    const { data } = await api.patch(`/tasks/${taskId}/move`, { targetListId: toListId, order });
    set((s) => {
      let newTasks = { ...s.tasks };
      
      if (fromListId === toListId) {
        newTasks[toListId] = (s.tasks[toListId] || [])
          .map(t => t._id === taskId ? data : t)
          .sort((a, b) => a.order - b.order);
      } else {
        newTasks[fromListId] = (s.tasks[fromListId] || []).filter(t => t._id !== taskId);
        newTasks[toListId] = [...(s.tasks[toListId] || []), data]
          .sort((a, b) => a.order - b.order);
      }
      
      return { tasks: newTasks };
    });
  },

  clearTasks: () => set({ tasks: {} }),
}));

export default useTaskStore;