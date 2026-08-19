import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, checking } = useAdminAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
