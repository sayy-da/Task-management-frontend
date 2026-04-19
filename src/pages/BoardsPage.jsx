import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BoardCard from "../components/BoardCard";
import useBoardStore from "../store/boardStore";

export default function BoardsPage() {
  const { boards, fetchBoards, createBoard } = useBoardStore();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchBoards(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    setLoading(true);
    setError("");
    try {
      await createBoard(title.trim());
      setTitle("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>My Boards</h2>

        {/* Create board */}
        <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          <input
            placeholder="New board name…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button type="submit" disabled={loading} style={{
            padding: "10px 22px", background: "var(--accent)", color: "#0e0e10",
            borderRadius: 8, fontWeight: 700, whiteSpace: "nowrap",
          }}>
            {loading ? "…" : "+ Create Board"}
          </button>
        </form>
        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 16 }}>{error}</p>}

        {/* Boards grid */}
        {boards.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 15 }}>No boards yet. Create one above.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {boards.map((b) => <BoardCard key={b._id} board={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}