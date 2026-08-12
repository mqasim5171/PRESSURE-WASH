import React from "react";
import Section from "../ui/Section";

/**
 * HowItWorks
 * -----------
 * Editorial, numbered walkthrough of the actual service flow - full-bleed
 * image alternating sides per step, huge ghost numeral, short copy. Unlike
 * a pure inspection business, step 4 ends in an actual clean (not just a
 * PDF report) since that's what Arcturus does with what the scan finds.
 */
const steps = [
  {
    n: "01",
    eyebrow: "Step 01",
    title: "Drone Inspection",
    text: "Our drone flies a survey grid over your roof, capturing every panel from directly overhead.",
    image: "/images/drone-sequence/scene-2-rising.webp",
  },
  {
    n: "02",
    eyebrow: "Step 02",
    title: "Thermal Scan",
    text: "Radiometric sensors read the temperature of every cell as the drone sweeps the array.",
    image: "/images/drone-sequence/scene-5-drone.webp",
  },
  {
    n: "03",
    eyebrow: "Step 03",
    title: "Detect Soiling",
    text: "Hotspots reveal dust, pollen and debris that a visual check from the ground would miss entirely.",
    image: "/images/drone-sequence/scene-6-thermal.webp",
  },
  {
    n: "04",
    eyebrow: "Step 04",
    title: "Targeted Clean",
    text: "We clean exactly where the scan shows output is being lost — not just wherever looks dusty.",
    image: "/images/solar.avif",
  },
];

export default function HowItWorks() {
  return (
    <Section className="bg-[#02060c] py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-2xl">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">The Inspection</span>
          <h2 className="mt-3 text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            One flight. <span className="text-white/40">Four steps of proof.</span>
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 relative">
              <span className="absolute top-4 left-5 text-6xl md:text-7xl font-extrabold text-white/20 z-10">
                {s.n}
              </span>
              <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">{s.eyebrow}</span>
              <h3 className="mt-3 text-3xl md:text-5xl font-bold text-white">{s.title}</h3>
              <p className="mt-4 text-lg text-white/60 max-w-md">{s.text}</p>
              <div className="mt-6 h-px w-16 bg-[#22d3ee]/50" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
