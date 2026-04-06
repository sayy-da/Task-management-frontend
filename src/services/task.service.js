import axios from "axios";
import { ITaskService } from "./interfaces/ITaskService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

export class TaskService extends ITaskService {
  async getTasks(status) {
    const res = await axios.get(API_URL, {
      params: { status }
    });
    return res.data;
  }

  async createTask(data) {
    const res = await axios.post(API_URL, data);
    return res.data;
  }

  async updateTask(id, data) {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  }

  async deleteTask(id) {
    await axios.delete(`${API_URL}/${id}`);
  }
}