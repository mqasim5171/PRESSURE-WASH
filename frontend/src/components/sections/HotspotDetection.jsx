import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Section from "../ui/Section";
import Glow from "../Glow";

// scene-6-thermal.webp (the real thermal photo) is already used in the
// hero, the how-it-works walkthrough and the before/after slider - reusing
// it a 4th time here would make the page feel repetitive. Instead this
// panel array (scene-4-isometric.webp, a different angle, only otherwise
// seen once in the hero flythrough) gets a stylized false-color treatment
// below, so the page isn't showing the exact same photo over and over.
const findings = [
  {
    id: 1,
    label: "Cell hotspot",
    severity: "Critical",
    tone: "#f79029",
    x: 52,
    y: 30,
    detail: "Module C4 running 21°C above array median — resistive junction, high fire-risk indicator.",
  },
  {
    id: 2,
    label: "Bypass diode failure",
    severity: "High",
    tone: "#f79029",
    x: 60,
    y: 40,
    detail: "Localised droppings are shading three cells in this string.",
  },
  {
    id: 3,
    label: "Soiling band",
    severity: "Moderate",
    tone: "#22d3ee",
    x: 45,
    y: 46,
    detail: "A light residue layer, early-stage soiling that's easy to miss visually.",
  },
];

export default function HotspotDetection() {
  const [active, setActive] = useState(null);
  const finding = findings.find((f) => f.id === active);
  const toggleFinding = (id) => setActive((current) => current === id ? null : id);

  return (
    <Section className="relative overflow-hidden bg-[#03070d] py-24 border-t border-white/5 mobile-hotspot-detection">
      <Glow color="#f79029" className="w-[420px] h-[420px] bottom-0 -left-32" opacity={0.06} />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Fault Detection</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            Three faults on one roof.
          </h2>
          <p className="text-white/60 mt-4 text-lg">
            Select a marker to see what the thermal pass found — and why a plain visual
            check would have missed it.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          {/* Findings list - a full-width vertical stack on mobile, not a
              horizontal scroller (easy to miss that there's more to scroll
              to, and awkward to tap while scrolling past). */}
          <div className="flex flex-col gap-3">
            {findings.map((f) => (
              <button
                key={f.id}
                onClick={() => toggleFinding(f.id)}
                className={`flex-shrink-0 w-full text-left rounded-xl border px-5 py-4 transition-all ${
                  active === f.id
                    ? "bg-white/[0.06] border-[#22d3ee]/40"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/40 text-xs font-semibold tabular-nums">
                    {String(f.id).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: f.tone }}
                  >
                    {f.severity}
                  </span>
                </div>
                <div className="text-white font-semibold mt-1">{f.label}</div>
              </button>
            ))}

            <Link
              to="/services/drone-based-washing"
              className="hidden lg:inline-flex items-center gap-2 text-sm font-semibold text-[#22d3ee] hover:text-white transition-colors mt-2"
            >
              This is what our clean removes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stylized false-color thermal treatment over a normal drone photo -
              see the note above on why this isn't the literal thermal photo. */}
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 mobile-hotspot-image">
            <img
              src="/images/drone-sequence/scene-4-isometric.webp"
              alt="Solar array with a false-color thermal overlay flagging soiling hotspots"
              className="absolute inset-0 h-full w-full object-cover grayscale contrast-125 brightness-90"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(155deg, #1e1b8c 0%, #6d28d9 35%, #be185d 62%, #f97316 100%)",
                mixBlendMode: "color",
              }}
            />
            {/* Warm glow radiating from each finding, so the false-color image
                actually looks hot right where the markers are. */}
            {findings.map((f) => (
              <div
                key={`glow-${f.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  background: "radial-gradient(circle, rgba(255,180,60,0.9) 0%, rgba(255,90,30,0.5) 40%, transparent 70%)",
                  mixBlendMode: "screen",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {findings.map((f) => (
              <button
                key={f.id}
                onClick={() => toggleFinding(f.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                aria-label={f.label}
              >
                <span
                  className={`absolute inset-0 rounded-full ${active === f.id ? "animate-ping" : ""}`}
                  style={{ background: f.tone, opacity: 0.4 }}
                />
                <span
                  className="relative w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: f.tone }}
                />
              </button>
            ))}

            {/* Detail card */}
            {finding && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-white font-bold">{finding.label}</h3>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: finding.tone }}
                  >
                    {finding.severity}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{finding.detail}</p>
              </div>
            )}
          </div>
        </div>

        <Link
          to="/services/solar-cleaning-maintenance"
          className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-[#22d3ee] hover:text-white transition-colors mt-6"
        >
          This is what our clean removes
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}
