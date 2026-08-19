import React, { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api, ApiError } from "../api";
import { useToast } from "../../hooks/use-toast";

const FIELDS = [
  { key: "primaryColor", label: "Primary Color" },
  { key: "secondaryColor", label: "Secondary Color" },
  { key: "accentColor", label: "Accent Color" },
  { key: "backgroundColor", label: "Background Color" },
  { key: "darkSectionColor", label: "Dark Section Color" },
  { key: "headingColor", label: "Heading Color" },
  { key: "bodyTextColor", label: "Body Text Color" },
  { key: "buttonColor", label: "Button Color" },
  { key: "buttonHoverColor", label: "Button Hover Color" },
];

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={/^#/.test(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-28 h-9 px-2.5 rounded-lg border border-slate-300 text-sm font-mono" />
      </div>
    </div>
  );
}

export default function AdminAppearance() {
  const [theme, setTheme] = useState(null);
  const [saving, setSaving] = useState(false);
  const [problems, setProblems] = useState([]);
  const { toast } = useToast();

  useEffect(() => { api.get("/api/admin/theme").then(setTheme); }, []);

  const set = (k, v) => { setTheme((t) => ({ ...t, [k]: v })); setProblems([]); };

  const save = async (force = false) => {
    setSaving(true);
    setProblems([]);
    try {
      const saved = await api.put("/api/admin/theme", { ...theme, force });
      setTheme(saved);
      toast({ title: "Theme saved", description: "The public site will pick up the new colors on next load." });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setProblems(err.data?.problems || [err.message]);
      } else {
        toast({ title: "Save failed", description: err.message, variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!theme) return <AdminLayout title="Appearance"><p className="text-sm text-slate-400">Loading…</p></AdminLayout>;

  return (
    <AdminLayout title="Appearance">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-4xl">
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-1">Theme Colors</h2>
          <p className="text-sm text-slate-500 mb-4">Applied consistently across the whole site.</p>
          {FIELDS.map((f) => (
            <ColorRow key={f.key} label={f.label} value={theme[f.key] || ""} onChange={(v) => set(f.key, v)} />
          ))}

          {problems.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-1">
                <AlertTriangle className="w-4 h-4" /> This combination may be hard to read
              </div>
              <ul className="text-sm text-amber-700 list-disc list-inside space-y-0.5">
                {problems.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              <button onClick={() => save(true)} className="mt-3 text-sm font-semibold text-amber-800 underline">
                Save anyway
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Theme
            </button>
          </div>
        </section>

        {/* Live preview */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-20">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Preview</h3>
          <div className="rounded-xl p-5" style={{ background: theme.backgroundColor }}>
            <div className="rounded-lg p-4 mb-3" style={{ background: theme.darkSectionColor }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.accentColor }}>Eyebrow</div>
              <div className="text-lg font-extrabold mb-1" style={{ color: theme.headingColor }}>Heading text</div>
              <p className="text-sm" style={{ color: theme.bodyTextColor }}>Body copy shows how readable this combination is.</p>
              <button className="mt-3 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: theme.buttonColor, color: "#000" }}>
                Call to Action
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
