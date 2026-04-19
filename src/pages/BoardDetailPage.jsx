import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ListColumn from "../components/ListColumn";
import AddListModal from "../components/AddListModal";
import useListStore from "../store/listStore";
import useTaskStore from "../store/taskStore";

export default function BoardDetailPage() {
  const { id } = useParams();
  const { lists, fetchLists, clearLists, isLoading } = useListStore();
  const { fetchTasks, clearTasks } = useTaskStore();
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchLists(id);
    };
    load();
    return () => {
      clearLists();
      clearTasks();
    };
  }, [id]);

  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach((list) => fetchTasks(list._id));
    }
  }, [lists.length]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Navbar />
      
      {/* Subheader */}
      <div style={{ 
        padding: "16px 28px", 
        borderBottom: "1px solid var(--border)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        background: "rgba(14, 14, 16, 0.8)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ 
            color: "var(--muted)", 
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <span>←</span> Boards
          </Link>
          <div style={{ width: 1, height: 16, background: "var(--border)" }} />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Board Overview</h2>
        </div>
        
        <button 
          onClick={() => setShowAddList(true)}
          style={{
            background: "var(--accent)",
            color: "#0e0e10",
            padding: "8px 16px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: 18 }}>+</span> Add List
        </button>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 20, 
        padding: "24px 28px", 
        overflowX: "auto", 
        flex: 1, 
        alignItems: "flex-start",
        scrollBehavior: "smooth"
      }}>
        {isLoading ? (
          <div style={{ display: "flex", gap: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                width: 280, 
                height: 400, 
                background: "var(--surface)", 
                borderRadius: 12, 
                border: "1px solid var(--border)",
                opacity: 0.5,
                animation: "pulse 1.5s infinite"
              }} />
            ))}
          </div>
        ) : lists.length === 0 ? (
          <div style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            marginTop: 80,
            color: "var(--muted)" 
          }}>
            <div style={{ 
              width: 60, 
              height: 60, 
              borderRadius: "50%", 
              background: "var(--surface)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: 16,
              fontSize: 24
            }}>📋</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}>No lists yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Get started by creating your first list</p>
          </div>
        ) : (
          <>
            {lists.map((list) => (
              <ListColumn key={list._id} list={list} allLists={lists} />
            ))}
            
            {/* Quick Add List Slot */}
            <div 
              onClick={() => setShowAddList(true)}
              style={{
                minWidth: 280,
                height: 50,
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed var(--border)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: 13,
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "var(--muted)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              + Add another list
            </div>
          </>
        )}
      </div>

      {showAddList && (
        <AddListModal 
          boardId={id} 
          onClose={() => setShowAddList(false)} 
        />
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}