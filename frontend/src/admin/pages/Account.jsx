import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../api";
import { useAdminAuth } from "../AuthContext";
import { useToast } from "../../hooks/use-toast";

const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500";

export default function AdminAccount() {
  const { admin } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/auth/change-password", { currentPassword, newPassword });
      toast({ title: "Password changed" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      toast({ title: "Failed to change password", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Account">
      <div className="max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <div className="text-sm text-slate-500">Signed in as</div>
          <div className="font-bold text-slate-900">{admin?.username}</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-slate-900">Change Password</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className={inputCls} />
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
