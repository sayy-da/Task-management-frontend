import React from "react";
import { useNavigate } from "react-router-dom";
import useBoardStore from "../store/boardStore";

export default function BoardCard({ board }) {
  const { deleteBoard } = useBoardStore();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm("Delete this board?")) await deleteBoard(board._id);
  };

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "20px 24px", cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{board.title}</h3>
        <span style={{ color: "var(--muted)", fontSize: 12 }}>
          {new Date(board.createdAt).toLocaleDateString()}
        </span>
      </div>
      <button
        onClick={handleDelete}
        style={{
          background: "transparent", color: "var(--muted)", fontSize: 18,
          padding: "4px 8px", borderRadius: 6, border: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
      >
        ×
      </button>
    </div>
  );
}