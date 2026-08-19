import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(undefined); // undefined = still checking, null = logged out
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await api.get("/api/auth/me");
      setAdmin(me);
    } catch {
      setAdmin(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (username, password) => {
    const result = await api.post("/api/auth/login", { username, password });
    setAdmin(result);
    return result;
  };

  const logout = async () => {
    await api.post("/api/auth/logout").catch(() => {});
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, checking, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
