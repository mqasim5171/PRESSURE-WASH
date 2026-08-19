import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "../AuthContext";

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (admin) {
    const to = location.state?.from?.pathname || "/admin";
    return <Navigate to={to} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="font-bold text-xl tracking-tight text-slate-900">Horizon Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sign in</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your website content and leads.</p>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
