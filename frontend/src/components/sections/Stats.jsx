import React from "react";
import Section from "../ui/Section";
import { useHomepageSection } from "../../lib/useHomepageSection";

// Pure, huge-number stat strip - deliberately reuses the same claims made
// elsewhere on the site (copy.hero.metrics, servicesIntro) rather than
// inventing new figures, so nothing here contradicts the rest of the page.
// Admin-editable via Admin > Homepage > Why Us Stats (sectionKey
// "why_us_stats").
const DEFAULT_STATS = [
  { value: "2400+", label: "Arrays inspected across Sydney" },
  { value: "98%", label: "Faults found on first flight" },
  { value: "48h", label: "From scan to detailed report" },
  { value: "21°C", label: "Typical hotspot delta detected" },
];

export default function Stats() {
  const { content, enabled } = useHomepageSection("why_us_stats");
  if (!enabled) return null;

  const eyebrow = content?.eyebrow || "Why Horizon";
  const stats = content?.stats?.length
    ? content.stats.filter((s) => s.value || s.label)
    : DEFAULT_STATS;

  return (
    <Section className="bg-[#02060c] py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">{eyebrow}</span>

        {/* Single column on mobile - these numbers are meant to be huge and
            given room to breathe, not squeezed two-per-row into half the
            screen width. */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 sm:gap-y-12">
          {stats.map((s, i) => (
            <div key={`${s.value}-${i}`}>
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
