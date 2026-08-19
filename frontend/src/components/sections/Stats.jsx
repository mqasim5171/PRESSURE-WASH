import React from "react";
import Section from "../ui/Section";

// Pure, huge-number stat strip - deliberately reuses the same claims made
// elsewhere on the site (copy.hero.metrics, servicesIntro) rather than
// inventing new figures, so nothing here contradicts the rest of the page.
const stats = [
  { value: "2400+", label: "Arrays inspected across Sydney" },
  { value: "98%", label: "Faults found on first flight" },
  { value: "48h", label: "From scan to detailed report" },
  { value: "21°C", label: "Typical hotspot delta detected" },
];

export default function Stats() {
  return (
    <Section className="bg-[#02060c] py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Why Horizon</span>

        {/* Single column on mobile - these numbers are meant to be huge and
            given room to breathe, not squeezed two-per-row into half the
            screen width. */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 sm:gap-y-12">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-5xl md:text-6xl font-extrabold text-white tabular-nums">{s.value}</div>
              <div className="mt-3 h-px w-10 bg-[#22d3ee]/50" />
              <p className="mt-3 text-white/50 text-sm md:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
