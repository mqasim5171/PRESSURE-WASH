import React from "react";
import Section from "../ui/Section";

/**
 * WhyChooseUs
 * -------------
 * Replaces the old "One flight. Four steps of proof." section. Keeps the
 * same editorial, numbered-walkthrough visual treatment (full-bleed image
 * alternating sides, ghost numeral) but the messaging is now about value -
 * why booking with Horizon beats arranging separate cleaners/inspectors.
 */
const points = [
  {
    n: "01",
    eyebrow: "Point 01",
    title: "Clean + Inspect in One Visit",
    text: "Professional solar cleaning and advanced thermal inspection happen in the same visit, instead of arranging multiple separate services.",
    image: "/images/drone-sequence/scene-2-rising.webp",
  },
  {
    n: "02",
    eyebrow: "Point 02",
    title: "More Than a Surface Clean",
    text: "Our flagship solar package includes a 12+ Point Solar Health Check, adding real inspection value on top of the clean.",
    image: "/images/solar.avif",
  },
  {
    n: "03",
    eyebrow: "Point 03",
    title: "Advanced Thermal Technology",
    text: "We fly the DJI Matrice 4T to provide professional thermal inspection capability alongside every solar clean.",
    image: "/images/drone.jpg",
  },
  {
    n: "04",
    eyebrow: "Point 04",
    title: "Save With Service Bundles",
    text: "Combine solar, roof and concrete cleaning into a single package designed to deliver stronger overall value than booking separately.",
    image: "/images/drone-sequence/scene-3-elevated.webp",
  },
];

export default function WhyChooseUs() {
  return (
    <Section id="why-us" className="bg-[#02060c] py-24 border-t border-white/5 mobile-how-it-works">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-2xl">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Why Horizon</span>
          <h2 className="mt-3 text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            More value. <span className="text-white/40">One visit.</span>
          </h2>
          <p className="mt-4 text-lg text-white/60 max-w-xl">
            Professional cleaning, advanced inspection and smarter service bundles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
        {points.map((p, i) => (
          <div
            key={p.n}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 relative">
              <span className="step-image-number absolute top-4 left-5 text-6xl md:text-7xl font-extrabold text-white/20 z-10">
                {p.n}
              </span>
              <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">{p.eyebrow}</span>
              <h3 className="mt-3 text-3xl md:text-5xl font-bold text-white">{p.title}</h3>
              <p className="mt-4 text-lg text-white/60 max-w-md">{p.text}</p>
              <div className="mt-6 h-px w-16 bg-[#22d3ee]/50" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
