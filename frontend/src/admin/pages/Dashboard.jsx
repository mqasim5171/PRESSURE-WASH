import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Wrench, Package, Newspaper, Star, HelpCircle, MapPin, ArrowRight } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../api";

const StatCard = ({ icon: Icon, label, value, sub, to }) => (
  <Link to={to} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors">
    <div className="flex items-center justify-between">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
    </div>
    <div className="mt-4 text-2xl font-extrabold text-slate-900">{value}</div>
    <div className="text-sm text-slate-500 mt-0.5">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
  </Link>
);

const statusColors = {
  new: "bg-cyan-100 text-cyan-700",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-violet-100 text-violet-700",
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  lost: "bg-slate-200 text-slate-600",
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/admin/dashboard").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {!data ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Inbox} label="Total Leads" value={data.leads.total} sub={`${data.leads.new} new`} to="/admin/leads" />
            <StatCard icon={Wrench} label="Services" value={data.services.total} to="/admin/services" />
            <StatCard icon={Package} label="Packages" value={data.packages.total} to="/admin/packages" />
            <StatCard icon={Newspaper} label="Blog Posts" value={data.blog.total} sub={`${data.blog.published} published`} to="/admin/blog" />
            <StatCard icon={Star} label="Reviews" value={data.reviews.total} to="/admin/reviews" />
            <StatCard icon={HelpCircle} label="FAQs" value={data.faqs.total} to="/admin/faqs" />
            <StatCard icon={MapPin} label="Service Areas" value={data.areas.total} to="/admin/areas" />
            <StatCard icon={Inbox} label="Leads This Week" value={data.leads.thisWeek} sub={`${data.leads.thisMonth} this month`} to="/admin/leads" />
          </div>

          <div className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900">Recent Leads</h2>
              <Link to="/admin/leads" className="text-sm font-medium text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {data.leads.recent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No leads yet. They'll appear here the moment someone submits a form.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.leads.recent.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{lead.service || "—"} · {lead.suburb || "—"}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[lead.status] || "bg-slate-100 text-slate-600"}`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
