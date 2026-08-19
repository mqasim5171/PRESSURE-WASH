import React from "react";
import Section from "../ui/Section";
import Glow from "../Glow";
import BeforeAfterComparison from "../Services/BeforeAfterComparison";
import { useCms } from "../../lib/useCms";
import { resolveMediaUrl } from "../../lib/media";

/**
 * BeforeAfterResults
 * ---------------------
 * Real, paired before/after imagery for the flagship services. Backed by
 * Admin > Before & After Results (/api/before-after) - published entries
 * from the CMS render here directly (including any admin-uploaded
 * mobile-specific portrait pair), so an admin can add, reorder or swap
 * out results without a code change. Falls back to this static
 * placeholder set (still using the shared BeforeAfterComparison component,
 * not a fake) if the API is unreachable or no entries have been published
 * yet.
 */
const FALLBACK = [
  {
    id: "solar",
    title: "Solar Panel Cleaning",
    caption: "Dust • Grime • Reduced Output → Clean • Reflective • Restored",
    beforeImage: "/images/solar-before.jpg",
    afterImage: "/images/solar-after.jpg",
  },
  {
    id: "roof",
    title: "Roof Cleaning",
    caption: "Moss • Lichen • Built-Up Grime → Clean • Restored • Refreshed",
    beforeImage: "/images/roof-before.jpg",
    afterImage: "/images/roof-after.jpg",
  },
  {
    id: "concrete",
    title: "Concrete Cleaning",
    caption: "Stains • Grime • Weathering → Refreshed • Like New",
    beforeImage: "/images/concrete-before.jpg",
    afterImage: "/images/concrete-after.jpg",
  },
];

export default function BeforeAfterResults() {
  const { data: apiResults } = useCms("/api/before-after", null);

  const results = apiResults?.length
    ? apiResults.map((r) => ({
        id: r.id,
        title: r.title,
        caption: [r.description, r.resultMetric].filter(Boolean).join(" · "),
        beforeImage: resolveMediaUrl(r.beforeUrl) || "",
        afterImage: resolveMediaUrl(r.afterUrl) || "",
        beforeMobileImage: resolveMediaUrl(r.mobileBeforeUrl) || "",
        afterMobileImage: resolveMediaUrl(r.mobileAfterUrl) || "",
      }))
    : FALLBACK;

  return (
    <Section className="relative overflow-hidden bg-[#03070d] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[480px] h-[480px] -top-40 -left-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Real Results</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            Before &amp; After Results
          </h2>
          <p className="text-white/60 mt-4 text-lg">
            Drag the handle to see the difference professional cleaning makes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {results.map((r) => (
            <div key={r.id}>
              <BeforeAfterComparison
                beforeImage={r.beforeImage}
                afterImage={r.afterImage}
                beforeMobileImage={r.beforeMobileImage}
                afterMobileImage={r.afterMobileImage}
                beforeAlt={`${r.title} - before`}
                afterAlt={`${r.title} - after`}
                aspectClassName="aspect-[4/3]"
              />
              <h3 className="mt-4 font-bold text-white">{r.title}</h3>
              {r.caption && <p className="text-white/50 text-sm mt-1">{r.caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
