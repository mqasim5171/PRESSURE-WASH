import React from "react";
import { Plane } from "lucide-react";

/**
 * DroneTechnologyBadge
 * ----------------------
 * Small premium equipment badge naming the actual hardware Horizon flies -
 * positions the business as technologically advanced, not just "a cleaner
 * with a drone". No specs are stated beyond what's publicly true (it's a
 * DJI Matrice 4T used for thermal inspection) - nothing invented.
 * See: https://enterprise.dji.com/matrice-4-series
 */
export default function DroneTechnologyBadge({ variant = "light", className = "" }) {
  const isDark = variant === "dark";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 border ${
        isDark
          ? "bg-black/40 border-white/15"
          : "bg-white/[0.06] border-white/15"
      } backdrop-blur-xl ${className}`}
    >
      <div className="w-6 h-6 rounded-lg bg-[#22d3ee]/15 flex items-center justify-center flex-shrink-0">
        <Plane className="w-3 h-3 text-[#22d3ee]" />
      </div>
      <div className="leading-tight">
        <span className="text-white font-semibold text-xs">DJI Matrice 4T</span>
        <span className="text-white/40 text-xs"> · Advanced thermal imaging</span>
      </div>
    </div>
  );
}
