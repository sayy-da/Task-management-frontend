import React, { useState } from "react";
import useListStore from "../store/listStore";

export default function AddListModal({ boardId, onClose }) {
  const { createList } = useListStore();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    try {
      await createList(boardId, title.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  return <Modal title="New List" onClose={onClose} onSubmit={handleSubmit} error={error}>
    <input placeholder="List title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
  </Modal>;
}

// Shared Modal wrapper
export function Modal({ title, onClose, onSubmit, error, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, padding: 28, width: 420, maxWidth: "95vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 20, fontWeight: 700, fontSize: 18 }}>{title}</h3>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {children}
          {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="submit" style={{
              flex: 1, padding: "10px", background: "var(--accent)", color: "#0e0e10",
              borderRadius: 8, fontWeight: 700, fontSize: 14,
            }}>Save</button>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: "10px", background: "var(--surface2)",
              color: "var(--muted)", borderRadius: 8, border: "1px solid var(--border)",
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}