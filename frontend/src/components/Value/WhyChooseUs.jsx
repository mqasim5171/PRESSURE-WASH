import React from "react";
import Section from "../ui/Section";
import { useHomepageSection } from "../../lib/useHomepageSection";
import { resolveMediaUrl } from "../../lib/media";

/**
 * WhyChooseUs
 * -------------
 * Replaces the old "One flight. Four steps of proof." section. Keeps the
 * same editorial, numbered-walkthrough visual treatment (full-bleed image
 * alternating sides, ghost numeral) but the messaging is now about value -
 * why booking with Horizon beats arranging separate cleaners/inspectors.
 *
 * Text (eyebrow/heading/description/each point's title+text) is admin-
 * editable via Admin > Homepage > Combined Services (sectionKey
 * "why_us_value") - the images stay local assets since the CMS's array
 * editor only manages number/title/text per point, not an image upload per
 * item (see JsonSectionEditor.jsx). A point saved in admin is matched to a
 * default image by its position; extra points beyond the 4 defaults reuse
 * the first image rather than rendering with none.
 */
const DEFAULT_POINTS = [
  {
    n: "01",
    title: "Clean + Inspect in One Visit",
    text: "Professional solar cleaning and advanced thermal inspection happen in the same visit, instead of arranging multiple separate services.",
    image: "/images/drone-sequence/scene-2-rising.webp",
  },
  {
    n: "02",
    title: "More Than a Surface Clean",
    text: "Our flagship solar package includes a 12+ Point Solar Health Check, adding real inspection value on top of the clean.",
    image: "/images/solar.avif",
  },
  {
    n: "03",
    title: "Advanced Thermal Technology",
    text: "We fly the DJI Matrice 4T to provide professional thermal inspection capability alongside every solar clean.",
    image: "/images/drone.jpg",
  },
  {
    n: "04",
    title: "Save With Service Bundles",
    text: "Combine solar, roof and concrete cleaning into a single package designed to deliver stronger overall value than booking separately.",
    image: "/images/drone-sequence/scene-3-elevated.webp",
  },
];

export default function WhyChooseUs() {
  const { content, enabled } = useHomepageSection("why_us_value");
  if (!enabled) return null;

  const eyebrow = content?.eyebrow || "Why Horizon";
  const heading = content?.heading;
  const description = content?.description;
  const points = content?.points?.length
    ? content.points.map((p, i) => ({
        n: p.number || DEFAULT_POINTS[i % DEFAULT_POINTS.length].n,
        title: p.title || DEFAULT_POINTS[i % DEFAULT_POINTS.length].title,
        text: p.text || DEFAULT_POINTS[i % DEFAULT_POINTS.length].text,
        // Admin-uploaded per-point image (Admin > Homepage > Combined
        // Services > each Value Point's Image field) - falls back to the
        // matching default photo until one's been uploaded.
        image: p.image ? resolveMediaUrl(p.image) : DEFAULT_POINTS[i % DEFAULT_POINTS.length].image,
      }))
    : DEFAULT_POINTS;

  return (
    <Section id="why-us" className="bg-[#02060c] py-24 border-t border-white/5 mobile-how-it-works">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-2xl">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">{eyebrow}</span>
          {heading ? (
            <h2 className="mt-3 text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">{heading}</h2>
          ) : (
            <h2 className="mt-3 text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              More value. <span className="text-white/40">One visit.</span>
            </h2>
          )}
          <p className="mt-4 text-lg text-white/60 max-w-xl">
            {description || "Professional cleaning, advanced inspection and smarter service bundles."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
        {points.map((p, i) => (
          <div
            key={`${p.n}-${i}`}
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
              <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Point {p.n}</span>
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
