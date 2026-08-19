import React from "react";
import { Sun, Thermometer, ClipboardCheck, Layers } from "lucide-react";

/**
 * TrustStrip
 * ------------
 * Slim differentiator strip directly under the hero - the four things that
 * separate Horizon from "just another pressure washing company", stated
 * as plain chips rather than a heavy new section.
 */
const items = [
  { icon: Sun, label: "Solar Panel Cleaning" },
  { icon: Thermometer, label: "Thermal Drone Scanning" },
  { icon: ClipboardCheck, label: "12+ Point Solar Health Check" },
  { icon: Layers, label: "Bundled Property Cleaning" },
];

export default function TrustStrip() {
  return (
    <div className="relative bg-[#02060c] border-b border-white/5 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {items.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 text-white/70 text-sm px-4 py-2"
            >
              <Icon className="w-4 h-4 text-[#22d3ee]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
