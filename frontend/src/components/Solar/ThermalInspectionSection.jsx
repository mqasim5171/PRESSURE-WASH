import React from "react";
import { Link } from "react-router-dom";
import { Flame, TrendingDown, ScanEye, ArrowRight } from "lucide-react";
import Section from "../ui/Section";
import Glow from "../Glow";

/**
 * ThermalInspectionSection
 * ---------------------------
 * Compact homeowner-facing education on why thermal scanning matters -
 * original copy, written for this site (not copied from any third-party
 * source). Sits lower on the page as a shorter companion to the interactive
 * HotspotDetection component above it.
 */
const cards = [
  {
    icon: Flame,
    label: "Hotspots",
    text: "A hotspot is a small area of a panel running hotter than the rest of the array — often caused by dirt, damage or a failing cell. Left unchecked, it can shorten the panel's life.",
  },
  {
    icon: TrendingDown,
    label: "Underperformance",
    text: "Panels can look spotless and still produce less power than they should. Heat patterns often reveal underperformance long before it's visible to the eye.",
  },
  {
    icon: ScanEye,
    label: "Thermal Detection",
    text: "A radiometric drone pass turns temperature into colour, so any panel running abnormally hot stands out immediately — pinpointing exactly where to look.",
  },
];

export default function ThermalInspectionSection() {
  return (
    <Section className="relative overflow-hidden bg-[#02060c] py-24 border-t border-white/5">
      <Glow color="#f79029" className="w-[460px] h-[460px] -bottom-32 -right-32" opacity={0.06} />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          {/* Thermal photo with a couple of decorative hotspot markers */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 order-2 lg:order-1">
            <img
              src="/images/drone-sequence/scene-6-thermal.webp"
              alt="Thermal drone scan of a solar array"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {[{ x: 38, y: 32 }, { x: 58, y: 55 }].map((m, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                style={{ left: `${m.x}%`, top: `${m.y}%`, background: "#f79029" }}
              >
                <span className="absolute inset-0 rounded-full bg-[#f79029]/50 animate-ping" />
              </span>
            ))}
          </div>

          {/* Copy + cards */}
          <div className="order-1 lg:order-2">
            <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Solar Education</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Your Panels Can Look Fine — And Still Have a Problem.
            </h2>
            <p className="mt-4 text-white/60 text-lg">
              A visual check only shows what's on the surface. Thermal imaging shows how each panel
              is actually performing underneath.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {cards.map(({ icon: Icon, label, text }) => (
                <div key={label} className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                  <Icon className="w-5 h-5 text-[#22d3ee]" />
                  <div className="mt-3 text-xs font-bold tracking-widest uppercase text-white">{label}</div>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition"
              >
                Book a Solar Health Scan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
