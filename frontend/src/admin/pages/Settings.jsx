import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import MediaPicker from "../components/MediaPicker";
import { api } from "../api";
import { useToast } from "../../hooks/use-toast";

const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

export default function AdminSettings() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { api.get("/api/admin/settings").then(setData); }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setSocial = (k, v) => setData((d) => ({ ...d, socials: { ...d.socials, [k]: v } }));

  const save = async () => {
    setSaving(true);
    try {
      const saved = await api.put("/api/admin/settings", data);
      setData(saved);
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <AdminLayout title="Website Settings"><p className="text-sm text-slate-400">Loading…</p></AdminLayout>;

  return (
    <AdminLayout title="Website Settings">
      <div className="max-w-3xl space-y-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-5">Branding</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={labelCls}>Business Name</label>
              <input value={data.businessName || ""} onChange={(e) => set("businessName", e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Tagline</label>
              <input value={data.tagline || ""} onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
            </div>
            <MediaPicker label="Logo" mediaId={data.logoMediaId} url={data.logoUrl} category="general" onChange={(id, url) => setData((d) => ({ ...d, logoMediaId: id, logoUrl: url }))} />
            <MediaPicker label="Light Logo (for dark backgrounds)" mediaId={data.logoLightMediaId} url={data.logoLightUrl} category="general" onChange={(id, url) => setData((d) => ({ ...d, logoLightMediaId: id, logoLightUrl: url }))} />
            <MediaPicker label="Favicon" mediaId={data.faviconMediaId} url={data.faviconUrl} category="general" onChange={(id, url) => setData((d) => ({ ...d, faviconMediaId: id, faviconUrl: url }))} />
            <MediaPicker label="Footer Logo" mediaId={data.footerLogoMediaId} url={data.footerLogoUrl} category="general" onChange={(id, url) => setData((d) => ({ ...d, footerLogoMediaId: id, footerLogoUrl: url }))} />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-5">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Phone</label><input value={data.phone || ""} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Email</label><input value={data.email || ""} onChange={(e) => set("email", e.target.value)} className={inputCls} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Address</label><input value={data.address || ""} onChange={(e) => set("address", e.target.value)} className={inputCls} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Business Hours</label><input value={data.businessHours || ""} onChange={(e) => set("businessHours", e.target.value)} className={inputCls} /></div>
            {["facebook", "instagram", "tiktok", "linkedin"].map((s) => (
              <div key={s}><label className={labelCls}>{s[0].toUpperCase() + s.slice(1)} URL</label>
                <input value={data.socials?.[s] || ""} onChange={(e) => setSocial(s, e.target.value)} className={inputCls} /></div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-5">General</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div><label className={labelCls}>Main CTA Label</label><input value={data.mainCtaLabel || ""} onChange={(e) => set("mainCtaLabel", e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Main CTA URL</label><input value={data.mainCtaUrl || ""} onChange={(e) => set("mainCtaUrl", e.target.value)} className={inputCls} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Footer Text</label><textarea value={data.footerText || ""} onChange={(e) => set("footerText", e.target.value)} rows={2} className={`${inputCls} h-auto py-2 resize-y`} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Copyright Text</label><input value={data.copyrightText || ""} onChange={(e) => set("copyrightText", e.target.value)} className={inputCls} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Emergency / Contact CTA Text</label><input value={data.emergencyCtaText || ""} onChange={(e) => set("emergencyCtaText", e.target.value)} className={inputCls} /></div>
          </div>
        </section>

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
