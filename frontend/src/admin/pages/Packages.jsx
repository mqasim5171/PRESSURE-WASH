import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import { packagesConfig, bundlesConfig } from "../resourceConfigs";

const TABS = [
  { key: "packages", label: "Individual Packages", config: packagesConfig },
  { key: "bundles", label: "Bundles", config: bundlesConfig },
];

export default function AdminPackages() {
  const [tab, setTab] = useState("packages");
  const active = TABS.find((t) => t.key === tab);

  return (
    <AdminLayout title="Packages">
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ResourceListPage key={tab} config={active.config} />
    </AdminLayout>
  );
}
