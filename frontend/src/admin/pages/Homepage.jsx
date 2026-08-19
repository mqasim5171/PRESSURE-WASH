import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ResourceListPage from "./ResourceListPage";
import JsonSectionEditor from "../components/JsonSectionEditor";
import { heroConfig, beforeAfterConfig } from "../resourceConfigs";

const TABS = ["Hero", "Combined Services", "Three Faults", "Why Us Stats", "Same Roof Story", "Before & After"];

export default function AdminHomepage() {
  const [tab, setTab] = useState("Hero");

  return (
    <AdminLayout title="Homepage">
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Hero" && <ResourceListPage key="hero" config={heroConfig} />}

      {tab === "Combined Services" && (
        <JsonSectionEditor
          sectionKey="why_us_value"
          title="Combined Services / More Value in One Visit"
          description="The section replacing '1 Flight / 4 Steps' - four reasons Horizon is better value."
          scalarFields={[
            { key: "eyebrow", label: "Eyebrow" },
            { key: "heading", label: "Heading" },
            { key: "description", label: "Description", type: "textarea", fullWidth: true },
          ]}
          arrayField={{ key: "points", label: "Value Points", itemLabel: "point", itemFields: [
            { key: "number", label: "Number (e.g. 01)" },
            { key: "title", label: "Title" },
            { key: "text", label: "Text", type: "textarea" },
          ] }}
        />
      )}

      {tab === "Three Faults" && (
        <JsonSectionEditor
          sectionKey="three_faults"
          title="Three Faults, One Roof"
          description="Interactive thermal fault-detection markers."
          scalarFields={[
            { key: "eyebrow", label: "Eyebrow" },
            { key: "heading", label: "Heading" },
            { key: "description", label: "Description", type: "textarea", fullWidth: true },
          ]}
          arrayField={{ key: "faults", label: "Faults", itemLabel: "fault", itemFields: [
            { key: "label", label: "Label" },
            { key: "severity", label: "Severity (Critical / High / Moderate)" },
            { key: "detail", label: "Detail", type: "textarea" },
          ] }}
        />
      )}

      {tab === "Why Us Stats" && (
        <JsonSectionEditor
          sectionKey="why_us_stats"
          title="Why Horizon — Statistics"
          description="The huge-number stat strip."
          scalarFields={[{ key: "eyebrow", label: "Eyebrow" }]}
          arrayField={{ key: "stats", label: "Statistics", itemLabel: "statistic", itemFields: [
            { key: "value", label: "Value (e.g. 2400+)" },
            { key: "label", label: "Label" },
          ] }}
        />
      )}

      {tab === "Same Roof Story" && (
        <JsonSectionEditor
          sectionKey="same_roof_story"
          title="Same Roof, Different Story"
          description="Visual vs thermal comparison slider intro copy."
          scalarFields={[
            { key: "eyebrow", label: "Eyebrow" },
            { key: "heading", label: "Heading" },
            { key: "description", label: "Description", type: "textarea", fullWidth: true },
          ]}
          arrayField={null}
        />
      )}

      {tab === "Before & After" && <ResourceListPage key="before-after" config={beforeAfterConfig} />}
    </AdminLayout>
  );
}
