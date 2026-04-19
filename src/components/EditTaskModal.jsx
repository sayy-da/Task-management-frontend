import React, { useState } from "react";
import useTaskStore from "../store/taskStore";
import { Modal } from "./Modal";

export default function EditTaskModal({ task, listId, onClose }) {
  const { updateTask } = useTaskStore();
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "medium",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
  });
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    try {
      await updateTask(task._id, listId, { ...form, dueDate: form.dueDate || null });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  return (
    <Modal title="Edit Task" onClose={onClose} onSubmit={handleSubmit} error={error}>
      <input placeholder="Task title" value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
        style={{ resize: "vertical" }}
      />
      <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
    </Modal>
  );
}