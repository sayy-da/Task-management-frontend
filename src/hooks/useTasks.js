import { useState, useCallback } from "react";

export const useTasks = (taskService) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("All");

  const fetchTasks = useCallback(async (status) => {
    const filterToUse = status !== undefined ? status : currentFilter;
    if (status !== undefined) setCurrentFilter(status);
    
    try {
      setLoading(true);
      const data = await taskService.getTasks(filterToUse);
      setTasks(data);
    } catch (err) {
      setError("Failed to fetch tasks. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [taskService, currentFilter]);

  const createTask = async (task) => {
    await taskService.createTask(task);
    await fetchTasks(currentFilter);
  };

  const updateTask = async (id, data) => {
    await taskService.updateTask(id, data);
    await fetchTasks(currentFilter);
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    await fetchTasks(currentFilter);
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};