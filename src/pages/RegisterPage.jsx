import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const { register, user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError("All fields required");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setSubmitting(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>TaskFlow</h1>
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={submitting} style={btnStyle}>
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 20 }}>
          Have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" };
const cardStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px 36px", width: 400, maxWidth: "95vw" };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" };
const btnStyle = { padding: "12px", background: "var(--accent)", color: "#0e0e10", borderRadius: 8, fontWeight: 700, fontSize: 15, marginTop: 4 };