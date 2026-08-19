import React from "react";
import { Zap } from "lucide-react";

/**
 * ThermalInfoCard
 * -----------------
 * Compact floating info panel for Hero Slide 3 (thermal inspection). Written
 * as original, homeowner-friendly copy - not lifted from any third-party
 * source. The left side of the slide already explains the concept; this
 * card supports that story with a short, scannable list rather than
 * repeating it as a second block of prose.
 */
const DEFAULT_TITLE = "See Problems Your Eyes Can't.";
const DEFAULT_REASONS = [
  "Uneven heat or dirt buildup",
  "Partial shading",
  "Damaged or ageing cells",
  "Possible system underperformance",
];

export default function ThermalInfoCard({ className = "", title, bullets }) {
  const reasons = bullets?.length ? bullets : DEFAULT_REASONS;
  return (
    <div
      className={`w-full max-w-[300px] rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/15 p-4 shadow-2xl ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1">
        <Zap className="w-3 h-3" />
        Thermal Solar Inspection
      </span>

      <h3 className="mt-2.5 text-base font-extrabold text-white leading-tight">
        {title || DEFAULT_TITLE}
      </h3>

      <p className="mt-1 text-white/50 text-[11px]">
        See what a visual inspection misses:
      </p>

      <ul className="mt-2.5 space-y-1.5">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-xs text-white/70">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#22d3ee] flex-shrink-0" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
