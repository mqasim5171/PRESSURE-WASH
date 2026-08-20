import React, { useEffect, useState } from "react";
import { Loader2, Plus, X, GripVertical } from "lucide-react";
import { api } from "../api";
import { useToast } from "../../hooks/use-toast";
import MediaPicker from "./MediaPicker";

const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

/**
 * JsonSectionEditor
 * --------------------
 * Generic editor for a homepage_sections row (flexible JSON `content`),
 * covering the recurring shape used by "Combined Services", "Three Faults,
 * One Roof" and "Why Arcturus" statistics: a few top-level scalar fields
 * plus one repeatable list of small items. "Same Roof, Different Story"
 * just uses the scalar fields with no list.
 */
export default function JsonSectionEditor({ sectionKey, title, description, scalarFields, arrayField }) {
  const [content, setContent] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.get("/api/admin/homepage/sections").then((sections) => {
      const section = sections.find((s) => s.sectionKey === sectionKey);
      setContent(section?.content || {});
      setEnabled(section ? section.enabled : true);
    });
  }, [sectionKey]);

  if (!content) return <p className="text-sm text-slate-400">Loading…</p>;

  const setScalar = (key, value) => setContent((c) => ({ ...c, [key]: value }));

  const items = arrayField ? content[arrayField.key] || [] : [];
  const updateItem = (i, key, value) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it));
    setContent((c) => ({ ...c, [arrayField.key]: next }));
  };
  const removeItem = (i) => setContent((c) => ({ ...c, [arrayField.key]: items.filter((_, idx) => idx !== i) }));
  const addItem = () => {
    const blank = Object.fromEntries(arrayField.itemFields.map((f) => [f.key, ""]));
    setContent((c) => ({ ...c, [arrayField.key]: [...items, blank] }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/api/admin/homepage/sections/${sectionKey}`, { content, enabled });
      toast({ title: "Saved", description: `${title} updated.` });
    } catch (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-3xl">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
        <label className="flex items-center gap-2 flex-shrink-0">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-cyan-600" />
          <span className="text-sm font-medium text-slate-700">Visible</span>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        {scalarFields.map((f) => (
          <div key={f.key} className={f.fullWidth ? "sm:col-span-2" : ""}>
            <label className={labelCls}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea value={content[f.key] || ""} onChange={(e) => setScalar(f.key, e.target.value)} rows={2} className={`${inputCls} h-auto py-2 resize-y`} />
            ) : (
              <input value={content[f.key] || ""} onChange={(e) => setScalar(f.key, e.target.value)} className={inputCls} />
            )}
          </div>
        ))}
      </div>

      {arrayField && (
        <div className="mt-6">
          <label className={labelCls}>{arrayField.label}</label>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4 relative">
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <button onClick={() => removeItem(i)} className="text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid gap-3 pr-8">
                  {arrayField.itemFields.map((f) => (
                    <div key={f.key}>
                      {f.type === "image" ? (
                        // Stored as a plain URL string directly inside this
                        // item's JSON (content is a flexible JSON blob, no
                        // dedicated mediaId column to attach to like the
                        // rest of the CMS) - MediaPicker needs a truthy
                        // "id" to know an image is set, so the URL itself
                        // doubles as that here; only the URL is actually
                        // persisted.
                        <MediaPicker
                          label={f.label}
                          mediaId={item[f.key] || null}
                          url={item[f.key] || null}
                          category={f.category || "homepage"}
                          onChange={(_id, url) => updateItem(i, f.key, url)}
                        />
                      ) : (
                        <>
                          <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                          {f.type === "textarea" ? (
                            <textarea value={item[f.key] || ""} onChange={(e) => updateItem(i, f.key, e.target.value)} rows={2} className={`${inputCls} h-auto py-1.5 text-sm resize-y`} />
                          ) : (
                            <input value={item[f.key] || ""} onChange={(e) => updateItem(i, f.key, e.target.value)} className={`${inputCls} text-sm`} />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={addItem} className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:text-cyan-800">
              <Plus className="w-4 h-4" /> Add {arrayField.itemLabel || "item"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
        </button>
      </div>
    </div>
  );
}
