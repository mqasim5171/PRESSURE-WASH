import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, Upload, Trash2, Loader2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../api";
import { useToast } from "../../hooks/use-toast";
import { resolveMediaUrl } from "../../lib/media";

const CATEGORIES = ["general", "hero", "services", "packages", "blog", "reviews", "before-after", "areas"];

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("general");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState(null);
  const inputRef = useRef(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const data = await api.get(`/api/admin/media${q}`);
      setItems(data.items);
    } catch (err) {
      toast({ title: "Failed to load media", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("category", category);
        await api.upload("/api/admin/media/upload", form);
      }
      toast({ title: `${files.length} image${files.length > 1 ? "s" : ""} uploaded` });
      load();
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/media/${deleteTarget.id}`);
      setItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSelected(null);
      toast({ title: "Image deleted" });
    } catch (err) {
      toast({ title: "Can't delete", description: err.message, variant: "destructive" });
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout title="Media">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search filename or alt text..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
        </button>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-14 text-center">
          <p className="text-sm text-slate-500">No images yet.</p>
          <button onClick={() => inputRef.current?.click()} className="mt-3 text-sm font-semibold text-cyan-700 hover:text-cyan-800">Upload your first image</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((m) => (
            <button key={m.id} onClick={() => setSelected(m)} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={resolveMediaUrl(m.url)} alt={m.altText} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                <span className="text-white text-xs truncate">{m.filename}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="font-bold text-sm">{selected.filename}</h3>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <img src={resolveMediaUrl(selected.url)} alt={selected.altText} className="w-full max-h-80 object-contain bg-slate-50" />
            <div className="p-5 space-y-2 text-sm text-slate-500">
              <div>{selected.width}×{selected.height}px · {(selected.sizeBytes / 1024).toFixed(0)} KB</div>
              <div className="break-all text-xs">{selected.url}</div>
            </div>
            <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setDeleteTarget(selected)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this image?"
        description="If it's still used anywhere on the site, deletion will be blocked until you replace it there first."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
