import React, { useState } from "react";
import useListStore from "../store/listStore";
import useTaskStore from "../store/taskStore";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";

export default function ListColumn({ list, allLists }) {
  const { tasks } = useTaskStore();
  const { renameList, deleteList } = useListStore();
  const [addingTask, setAddingTask] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(list.title);

  const listTasks = tasks[list._id] || [];

  const handleRename = async () => {
    if (tempTitle.trim() && tempTitle !== list.title) {
      await renameList(list._id, tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDeleteList = async () => {
    if (confirm(`Delete "${list.title}" and all its tasks?`)) {
      await deleteList(list._id);
    }
  };

  const currentIndex = allLists.findIndex(l => l._id === list._id);
  const handleMoveList = async (direction) => {
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allLists.length) return;

    const targetList = allLists[targetIndex];
    const currentOrder = list.order;
    const targetOrder = targetList.order;

    // Swap orders
    await useListStore.getState().moveList(list._id, targetOrder);
    await useListStore.getState().moveList(targetList._id, currentOrder);
  };

  const getStatusColor = () => {
    const title = list.title.toLowerCase();
    if (title.includes("todo")) return "#3b82f6"; // Blue
    if (title.includes("progress")) return "#f59e0b"; // Orange
    if (title.includes("done") || title.includes("completed")) return "#10b981"; // Green
    if (title.includes("backlog")) return "#6366f1"; // Indigo
    if (title.includes("review")) return "#a855f7"; // Purple
    return "var(--border)";
  };

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, width: 280, minWidth: 280, flexShrink: 0,
      display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 160px)",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      {/* Status Bar */}
      <div style={{ height: 4, background: getStatusColor() }} />
      
      {/* Header */}
      <div style={{
        padding: "16px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        background: "rgba(255,255,255,0.01)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          {isEditingTitle ? (
            <input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
              style={{
                fontSize: 14, fontWeight: 700, background: "var(--surface2)",
                border: "1px solid var(--accent)", padding: "2px 6px", borderRadius: 4,
                width: "100%", outline: "none"
              }}
            />
          ) : (
            <span 
              onClick={() => setIsEditingTitle(true)}
              style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", cursor: "pointer" }}
            >
              {list.title}
            </span>
          )}
          <span style={{ 
            fontSize: 11, 
            color: "var(--muted)", 
            background: "var(--surface2)", 
            padding: "2px 8px", 
            borderRadius: 10,
            fontWeight: 600
          }}>
            {listTasks.length}
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {currentIndex > 0 && (
            <button 
              onClick={() => handleMoveList('left')} 
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 2 }}
              title="Move Left"
            >←</button>
          )}
          {currentIndex < allLists.length - 1 && (
            <button 
              onClick={() => handleMoveList('right')} 
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 2 }}
              title="Move Right"
            >→</button>
          )}
          
          <button
            onClick={handleDeleteList}
            style={{
              background: "none", color: "var(--muted)", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 4, borderRadius: 4, transition: "all 0.2s", marginLeft: 4
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--danger)";
              e.currentTarget.style.background = "rgba(255, 88, 88, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.background = "none";
            }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ padding: "12px 12px 0", overflowY: "auto", flex: 1 }}>
        {listTasks.map((task) => (
          <TaskCard 
            key={task._id} 
            task={task} 
            listId={list._id} 
            lists={allLists} 
            allTasksInList={listTasks} 
          />
        ))}
      </div>

      {/* Add Task */}
      <div style={{ padding: 12 }}>
        <button
          onClick={() => setAddingTask(true)}
          style={{
            width: "100%", padding: "9px", background: "var(--accent-dim)",
            color: "var(--accent)", border: "1px dashed rgba(232,255,71,0.3)",
            borderRadius: 8, fontWeight: 600, fontSize: 13, transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(232,255,71,0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-dim)"}
        >
          + Add Task
        </button>
      </div>

      {addingTask && (
        <AddTaskModal listId={list._id} onClose={() => setAddingTask(false)} />
      )}
    </div>
  );
}