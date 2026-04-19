import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: 56,
    background: "var(--surface)", borderBottom: "1px solid var(--border)",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: {
    fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20,
    color: "var(--accent)", letterSpacing: "-0.5px",
  },
  btn: {
    background: "transparent", color: "var(--muted)", padding: "6px 16px",
    border: "1px solid var(--border)", borderRadius: 8,
    transition: "all 0.2s",
  },
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>TaskFlow</Link>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{user.name}</span>
          <button style={styles.btn} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}