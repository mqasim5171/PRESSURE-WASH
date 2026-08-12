// src/components/sections/Services.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Star, ArrowRight, Zap } from "lucide-react";
import Section from "../ui/Section";
import Glow from "../Glow";
import { copy } from "../../lib/copy";

const Tile = ({ s, big, badge }) => (
  <div className={`group relative rounded-3xl overflow-hidden ${big ? "h-[420px]" : "h-[240px]"}`}>
    {s.image && (
      <img
        src={s.image}
        alt={s.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

    {badge && (
      <span className="absolute top-5 left-6 md:top-6 md:left-8 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
        <Zap className="w-3.5 h-3.5 text-[#22d3ee]" />
        {badge}
      </span>
    )}

    <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
      <h3 className={`font-bold text-white ${big ? "text-2xl md:text-3xl" : "text-lg"}`}>{s.title}</h3>
      <p className={`text-white/70 mt-2 max-w-md ${big ? "text-base" : "text-sm"}`}>{s.blurb}</p>

      <div className="mt-5">
        <Link
          to={`/services/${s.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-[#22d3ee] transition-colors"
        >
          Explore Service
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </div>
);

// Minimal, photo-led tile for the secondary services - just the image and a
// small name pill, no blurb/CTA copy. The gallery is meant to read as a
// wall of real work, not another row of sales cards.
const GalleryTile = ({ s, wide }) => (
  <Link
    to={`/services/${s.slug}`}
    className={`group relative block rounded-3xl overflow-hidden ${wide ? "aspect-[16/11]" : "aspect-[4/5]"}`}
  >
    {(s.galleryImage || s.image) && (
      <img
        src={s.galleryImage || s.image}
        alt={s.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
    <span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-black/50 backdrop-blur border border-white/15 text-white text-xs font-semibold px-3 py-1.5">
      {s.title}
    </span>
  </Link>
);

export default function Services() {
  const { servicesIntro, services = [] } = copy;
  const flagship = services.filter((s) => s.flagship);
  const extras = services.filter((s) => !s.flagship);

  return (
    <Section id="services" className="relative overflow-hidden bg-[#03070d] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[560px] h-[560px] -top-64 -right-52" />
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12 max-w-2xl">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">What We Do</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            {servicesIntro.title}
          </h2>
          <p className="text-white/60 mt-4 text-lg">{servicesIntro.sub}</p>
        </header>

        {/* Flagship pair - drone thermal scanning finds it, solar cleaning fixes it.
            These two are the actual core of the business; everything else is secondary. */}
        <div className="grid md:grid-cols-2 gap-4">
          {flagship.map((s) => (
            <Tile
              key={s.slug}
              s={s}
              big
              badge={
                s.slug === "solar-cleaning-maintenance" ? "Drone-Powered" :
                s.slug === "drone-based-washing" ? "Flagship" : null
              }
            />
          ))}
        </div>

        {/* Everything above the roofline - the secondary services as a
            photo-led gallery rather than another row of sales cards. Header
            runs side-by-side (headline left, description right) on desktop. */}
        <div className="mt-20 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-white/40 tracking-widest text-xs font-semibold uppercase">Services</span>
            <h3 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              <span className="text-white">Everything</span>{" "}
              <span className="text-white/40">above the roofline.</span>
            </h3>
          </div>
          <p className="text-white/50 max-w-sm md:text-right">
            Roof, gutter and window care — everything else your property needs, from the same drone-equipped team.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {extras[0] && (
            <div className="md:col-span-2">
              <GalleryTile s={extras[0]} wide />
            </div>
          )}
          {extras.slice(1).map((s) => (
            <GalleryTile key={s.slug} s={s} />
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-10 rounded-2xl bg-white/[0.04] backdrop-blur border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="flex items-center gap-3 p-5 justify-center">
              <Clock className="w-5 h-5 text-[#22d3ee]" />
              <div className="text-sm">
                <div className="font-semibold text-white">Same-day Service</div>
                <div className="text-white/50">Sydney-wide availability</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 justify-center">
              <Shield className="w-5 h-5 text-[#22d3ee]" />
              <div className="text-sm">
                <div className="font-semibold text-white">Fully Insured</div>
                <div className="text-white/50">$10M public liability</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 justify-center">
              <Star className="w-5 h-5 text-[#22d3ee]" />
              <div className="text-sm">
                <div className="font-semibold text-white">5-Star Rated</div>
                <div className="text-white/50">247+ verified reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle CTA */}
        <div className="mt-6 rounded-3xl bg-gradient-to-r from-[#22d3ee]/10 via-white/[0.03] to-transparent border border-white/10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Prefer a custom bundle?</h3>
            <p className="text-white/60 mt-1">Save time and money with a tailored package across multiple services.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition whitespace-nowrap"
          >
            Get a tailored quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
