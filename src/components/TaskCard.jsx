import React, { useState } from "react";
import useTaskStore from "../store/taskStore";
import EditTaskModal from "./EditTaskModal";

const PRIORITY_COLOR = { low: "var(--low)", medium: "var(--medium)", high: "var(--high)" };

export default function TaskCard({ task, listId, lists, allTasksInList }) {
  const { deleteTask, moveTask } = useTaskStore();
  const [editing, setEditing] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm("Delete task?")) await deleteTask(task._id, listId);
  };

  const handleMove = async (e) => {
    const toListId = e.target.value;
    if (!toListId || toListId === listId) return;
    await moveTask(task._id, listId, toListId, null);
  };

  const currentIndex = allTasksInList.findIndex(t => t._id === task._id);
  const handleReorder = async (direction, e) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allTasksInList.length) return;

    const targetTask = allTasksInList[targetIndex];
    const currentOrder = task.order;
    const targetOrder = targetTask.order;

    // Swap orders within same list
    await moveTask(task._id, listId, listId, targetOrder);
    await moveTask(targetTask._id, listId, listId, currentOrder);
  };

  return (
    <>
      <div
        style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "12px 14px", marginBottom: 8,
          cursor: "pointer", transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        onClick={() => setEditing(true)}
      >
        {/* Priority dot */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.4, flex: 1 }}>
            {task.title}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {currentIndex > 0 && (
              <button 
                onClick={(e) => handleReorder('up', e)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12 }}
              >↑</button>
            )}
            {currentIndex < allTasksInList.length - 1 && (
              <button 
                onClick={(e) => handleReorder('down', e)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12 }}
              >↓</button>
            )}
            <button
              onClick={handleDelete}
              style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 16, padding: 0, marginLeft: 4 }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >×</button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
            background: `${PRIORITY_COLOR[task.priority]}22`,
            color: PRIORITY_COLOR[task.priority], textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Move dropdown */}
        <select
          onClick={(e) => e.stopPropagation()}
          onChange={handleMove}
          value=""
          style={{
            marginTop: 8, fontSize: 11, padding: "4px 8px",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 6, color: "var(--muted)", width: "100%",
          }}
        >
          <option value="">Move to…</option>
          {lists.filter((l) => l._id !== listId).map((l) => (
            <option key={l._id} value={l._id}>{l.title}</option>
          ))}
        </select>
      </div>

      {editing && (
        <EditTaskModal task={task} listId={listId} onClose={() => setEditing(false)} />
      )}
    </>
  );
}