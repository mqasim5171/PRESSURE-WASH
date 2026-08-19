import React, { useCallback, useEffect, useState } from "react";
import { Search, Download, X, Loader2, Phone, Mail, MapPin, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../api";
import { useToast } from "../../hooks/use-toast";

const STATUSES = ["new", "contacted", "qualified", "scheduled", "completed", "lost"];
const statusColors = {
  new: "bg-cyan-100 text-cyan-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-violet-100 text-violet-700",
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  lost: "bg-slate-200 text-slate-600",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      params.set("sort", sort);
      const data = await api.get(`/api/leads/admin?${params.toString()}`);
      setLeads(data.items);
    } catch (err) {
      toast({ title: "Failed to load leads", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sort]);

  useEffect(() => { load(); }, [load]);

  const openLead = (lead) => { setSelected(lead); setNotesDraft(lead.notes || ""); };

  const updateStatus = async (lead, newStatus) => {
    try {
      await api.put(`/api/leads/admin/${lead.id}`, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l)));
      if (selected?.id === lead.id) setSelected((s) => ({ ...s, status: newStatus }));
    } catch (err) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await api.put(`/api/leads/admin/${selected.id}`, { notes: notesDraft });
      setLeads((prev) => prev.map((l) => (l.id === selected.id ? { ...l, notes: notesDraft } : l)));
      toast({ title: "Notes saved" });
    } catch (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/leads/admin/${deleteTarget.id}`);
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast({ title: "Lead deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Leads">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, suburb..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <a href="/api/leads/admin/export.csv" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50">
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">Loading…</p>
        ) : leads.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-slate-500">No leads match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-slate-50 cursor-pointer ${lead.status === "new" ? "font-semibold" : ""}`} onClick={() => openLead(lead)}>
                    <td className="px-5 py-3.5">{lead.name}</td>
                    <td className="px-5 py-3.5 text-slate-500 font-normal">{lead.phone || lead.email || "—"}</td>
                    <td className="px-5 py-3.5 font-normal">{lead.service || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-normal text-xs">{lead.sourcePage || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-normal text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead, e.target.value)}
                        className={`text-xs font-semibold rounded-full border-0 pl-2.5 pr-6 py-1 ${statusColors[lead.status]}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDeleteTarget(lead)} className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900">{selected.name}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-5 flex-1">
              <div className="flex flex-wrap gap-2">
                {selected.phone && <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200"><Phone className="w-3.5 h-3.5" /> {selected.phone}</a>}
                {selected.email && <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200"><Mail className="w-3.5 h-3.5" /> {selected.email}</a>}
                {selected.suburb && <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-slate-100"><MapPin className="w-3.5 h-3.5" /> {selected.suburb}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select value={selected.status} onChange={(e) => updateStatus(selected, e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="text-sm">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Service</div>
                <div>{selected.service || "—"}</div>
              </div>
              {selected.package && (
                <div className="text-sm">
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Package</div>
                  <div>{selected.package.name}</div>
                </div>
              )}
              <div className="text-sm">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Message</div>
                <div className="whitespace-pre-wrap">{selected.message || "—"}</div>
              </div>
              <div className="text-sm">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Source</div>
                <div>{selected.sourcePage || "—"}</div>
              </div>
              <div className="text-sm">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Submitted</div>
                <div>{new Date(selected.createdAt).toLocaleString()}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Internal Notes</label>
                <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between gap-2">
              <button onClick={() => setDeleteTarget(selected)} className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
              <button onClick={saveNotes} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this lead?"
        description={deleteTarget ? `${deleteTarget.name}'s enquiry will be permanently removed.` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
