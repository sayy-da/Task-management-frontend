import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardsPage from "./pages/BoardsPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";

export default function App() {
  const { fetchMe, loading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)" }}>
      Loading…
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><BoardsPage /></ProtectedRoute>} />
      <Route path="/board/:id" element={<ProtectedRoute><BoardDetailPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}