import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import MediaPicker from "./MediaPicker";
import RichTextEditor from "./RichTextEditor";
import { api } from "../api";

const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

function ArrayField({ label, value = [], onChange, placeholder }) {
  const items = Array.isArray(value) ? value : [];
  const update = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={(e) => update(i, e.target.value)} className={inputCls} placeholder={placeholder} />
            <button type="button" onClick={() => remove(i)} className="w-10 h-10 flex-shrink-0 rounded-lg border border-slate-300 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:text-cyan-800">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>
    </div>
  );
}

// Links a package to one or more services (many-to-many). Loads the
// service list once and renders it as a checkbox group; the parent form
// just stores an array of service ids under `f.name` (default "serviceIds").
function ServiceLinksField({ label, value, onChange }) {
  const [services, setServices] = useState(null);
  useEffect(() => {
    api.get("/api/admin/services").then(setServices).catch(() => setServices([]));
  }, []);

  const selected = new Set((value || []).map(Number));
  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    onChange([...next]);
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      {services === null ? (
        <p className="text-xs text-slate-400">Loading services…</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                selected.has(s.id) ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Repeatable { name, note } pairs - e.g. a service area's suburb
// breakdown (Bondi / "Premium beachside cleaning services", ...).
function PairArrayField({ label, value = [], onChange, keys = ["name", "note"] }) {
  const items = Array.isArray(value) ? value : [];
  const [k1, k2] = keys;
  const update = (i, key, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { [k1]: "", [k2]: "" }]);

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item[k1] || ""} onChange={(e) => update(i, k1, e.target.value)} className={inputCls} placeholder="Name" />
            <input value={item[k2] || ""} onChange={(e) => update(i, k2, e.target.value)} className={inputCls} placeholder="Note" />
            <button type="button" onClick={() => remove(i)} className="w-10 h-10 flex-shrink-0 rounded-lg border border-slate-300 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:text-cyan-800">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>
    </div>
  );
}

/**
 * ResourceForm
 * --------------
 * Renders an edit form from a declarative field list. Field types:
 * text, textarea, number, boolean, select, array, date, datetime, image.
 */
export default function ResourceForm({ fields, value, onChange }) {
  const set = (name, v) => onChange({ ...value, [name]: v });

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {fields.map((f) => {
        const val = value[f.name];
        const full = f.fullWidth ? "sm:col-span-2" : "";

        if (f.type === "richtext") {
          return (
            <div key={f.name} className={full || "sm:col-span-2"}>
              <label className={labelCls}>{f.label}{f.required && " *"}</label>
              <RichTextEditor value={val} onChange={(html) => set(f.name, html)} />
            </div>
          );
        }
        if (f.type === "textarea") {
          return (
            <div key={f.name} className={full || "sm:col-span-2"}>
              <label className={labelCls}>{f.label}{f.required && " *"}</label>
              <textarea
                value={val ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                rows={f.rows || 4}
                required={f.required}
                className={`${inputCls} h-auto py-2 resize-y`}
              />
            </div>
          );
        }
        if (f.type === "boolean") {
          return (
            <label key={f.name} className={`flex items-center gap-2.5 ${full}`}>
              <input type="checkbox" checked={!!val} onChange={(e) => set(f.name, e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
            </label>
          );
        }
        if (f.type === "select") {
          return (
            <div key={f.name} className={full}>
              <label className={labelCls}>{f.label}</label>
              <select value={val ?? ""} onChange={(e) => set(f.name, e.target.value)} className={`${inputCls} bg-white`}>
                <option value="">—</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          );
        }
        if (f.type === "array") {
          return <div key={f.name} className={full || "sm:col-span-2"}><ArrayField label={f.label} value={val} onChange={(v) => set(f.name, v)} placeholder={f.placeholder} /></div>;
        }
        if (f.type === "pairArray") {
          return <div key={f.name} className={full || "sm:col-span-2"}><PairArrayField label={f.label} value={val} onChange={(v) => set(f.name, v)} /></div>;
        }
        if (f.type === "number") {
          return (
            <div key={f.name} className={full}>
              <label className={labelCls}>{f.label}</label>
              <input type="number" step="0.01" value={val ?? ""} onChange={(e) => set(f.name, e.target.value === "" ? null : Number(e.target.value))} className={inputCls} />
            </div>
          );
        }
        if (f.type === "date" || f.type === "datetime") {
          const dateVal = val ? new Date(val).toISOString().slice(0, f.type === "date" ? 10 : 16) : "";
          return (
            <div key={f.name} className={full}>
              <label className={labelCls}>{f.label}</label>
              <input
                type={f.type === "date" ? "date" : "datetime-local"}
                value={dateVal}
                onChange={(e) => set(f.name, e.target.value ? new Date(e.target.value).toISOString() : null)}
                className={inputCls}
              />
              {f.helpText && <p className="text-xs text-slate-400 mt-1">{f.helpText}</p>}
            </div>
          );
        }
        if (f.type === "services") {
          return <div key={f.name} className={full || "sm:col-span-2"}><ServiceLinksField label={f.label} value={val} onChange={(v) => set(f.name, v)} /></div>;
        }
        if (f.type === "image") {
          return (
            <div key={f.name} className={full}>
              <MediaPicker
                label={f.label}
                mediaId={val}
                url={value[f.urlField]}
                category={f.category || "general"}
                onChange={(id, url) => onChange({ ...value, [f.name]: id, [f.urlField]: url })}
              />
            </div>
          );
        }
        // default: text
        return (
          <div key={f.name} className={full}>
            <label className={labelCls}>{f.label}{f.required && " *"}</label>
            <input value={val ?? ""} onChange={(e) => set(f.name, e.target.value)} required={f.required} className={inputCls} placeholder={f.placeholder} />
            {f.helpText && <p className="text-xs text-slate-400 mt-1">{f.helpText}</p>}
          </div>
        );
      })}
    </div>
  );
}
