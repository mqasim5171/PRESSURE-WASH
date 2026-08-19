import React, { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Copy, X, Loader2 } from "lucide-react";
import ResourceForm from "../components/ResourceForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../api";
import { useToast } from "../../hooks/use-toast";

/**
 * ResourceListPage
 * ------------------
 * Generic table + slide-over create/edit form, driven entirely by a
 * declarative `config` (see admin/resourceConfigs.js). Every simple content
 * module (Services, Packages, Bundles, Reviews, FAQs, Areas, Before/After,
 * Blog) is a two-line wrapper around this.
 */
export default function ResourceListPage({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = editing
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dirty, setDirty] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const data = await api.get(`/api/admin/${config.key}${query}`);
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      toast({ title: "Failed to load", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.key, search]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing({ ...config.emptyDefaults }); setDirty(false); };
  const openEdit = (item) => { setEditing({ ...item }); setDirty(false); };
  const closeEditor = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setEditing(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/api/admin/${config.key}/${editing.id}`, editing);
      } else {
        await api.post(`/api/admin/${config.key}`, editing);
      }
      toast({ title: "Saved", description: `${config.singular} saved successfully.` });
      setEditing(null);
      setDirty(false);
      load();
    } catch (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/${config.key}/${deleteTarget.id}`);
      toast({ title: "Deleted", description: `${config.singular} removed.` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDuplicate = async (item) => {
    try {
      await api.post(`/api/admin/${config.key}/${item.id}/duplicate`);
      toast({ title: "Duplicated" });
      load();
    } catch (err) {
      toast({ title: "Duplicate failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={config.searchPlaceholder || `Search ${config.title.toLowerCase()}...`}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <button onClick={openNew} className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
          <Plus className="w-4 h-4" /> New {config.singular}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm text-slate-500">No {config.title.toLowerCase()} yet.</p>
            <button onClick={openNew} className="mt-3 text-sm font-semibold text-cyan-700 hover:text-cyan-800">
              Create your first {config.singular.toLowerCase()}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  {config.columns.map((c) => <th key={c.key} className="px-5 py-3 font-medium whitespace-nowrap">{c.label}</th>)}
                  <th className="px-5 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    {config.columns.map((c) => (
                      <td key={c.key} className="px-5 py-3.5 whitespace-nowrap">
                        {c.render ? c.render(item) : (item[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {config.allowDuplicate && (
                          <button onClick={() => handleDuplicate(item)} title="Duplicate" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => openEdit(item)} title="Edit" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(item)} title="Delete" className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over editor */}
      {editing && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeEditor} />
          <div className="relative w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-slate-900">{editing.id ? `Edit ${config.singular}` : `New ${config.singular}`}</h2>
              <button onClick={closeEditor}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 flex-1">
              <ResourceForm
                fields={config.fields}
                value={editing}
                onChange={(v) => { setEditing(v); setDirty(true); }}
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white flex justify-end gap-2">
              <button onClick={closeEditor} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete this ${config.singular.toLowerCase()}?`}
        description={deleteTarget?.name || deleteTarget?.title || deleteTarget?.customerName || deleteTarget?.question ? `"${deleteTarget.name || deleteTarget.title || deleteTarget.customerName || deleteTarget.question}" will be permanently removed.` : "This can't be undone."}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
