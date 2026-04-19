import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const { login, user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("All fields required");
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>TaskFlow</h1>
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>Sign in to your workspace</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => set("password", e.target.value)} />
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={submitting} style={btnStyle}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 20 }}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh", display: "flex", alignItems: "center",
  justifyContent: "center", background: "var(--bg)",
};
const cardStyle = {
  background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: 16, padding: "40px 36px", width: 400, maxWidth: "95vw",
};
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" };
const btnStyle = { padding: "12px", background: "var(--accent)", color: "#0e0e10", borderRadius: 8, fontWeight: 700, fontSize: 15, marginTop: 4, transition: "opacity 0.2s" };