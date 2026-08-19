// src/components/sections/Services.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Star, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import Section from "../ui/Section";
import Glow from "../Glow";
import { copy } from "../../lib/copy";
import { useCms } from "../../lib/useCms";
import { mapServices } from "../../lib/cmsAdapters";

// Primary, package-style tile - used for the 3 flagship services in strict
// priority order (solar first and biggest, then roof, then concrete). Shows
// a catchline, a handful of concrete inclusions and a named CTA instead of
// just an image + one-line blurb, so these read as real service packages.
const PackageTile = ({ s, big }) => (
  <div className={`group relative rounded-3xl overflow-hidden flex flex-col justify-end ${big ? "min-h-[460px] md:min-h-[520px]" : "min-h-[420px]"}`}>
    {s.image && (
      <img
        src={s.image}
        alt={s.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10" />

    {s.badge && (
      <span className="absolute top-5 left-6 md:top-6 md:left-8 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
        <Zap className="w-3.5 h-3.5 text-[#22d3ee]" />
        {s.badge}
      </span>
    )}

    <div className="relative p-6 md:p-8">
      {s.catchline && (
        <p className="text-[#22d3ee] font-semibold text-sm md:text-base uppercase tracking-wide">{s.catchline}</p>
      )}
      <h3 className={`font-bold text-white mt-1 ${big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>{s.title}</h3>

      {s.healthCheck && (
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
          Includes {s.healthCheck}
        </p>
      )}

      {s.bullets?.length > 0 && (
        <ul className={`mt-4 grid gap-2 ${big ? "sm:grid-cols-2" : ""}`}>
          {s.bullets.slice(0, big ? 5 : 4).map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-white/75">
              <CheckCircle2 className="w-4 h-4 text-[#22d3ee] mt-0.5 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link
          to={`/services/${s.slug}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-[#22d3ee] text-black text-sm font-bold uppercase tracking-wide hover:bg-white transition-colors"
        >
          {s.ctaLabel || "Explore Service"}
          <ArrowRight className="w-4 h-4" />
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
  const { servicesIntro } = copy;
  // Services are admin-editable (Admin > Services) - this fetches the live
  // list and falls back to copy.js if the API isn't reachable yet.
  const { data: apiServices } = useCms("/api/services", null);
  const services = apiServices ? mapServices(apiServices) : copy.services;
  // Priority hierarchy: solar (1) is the flagship, roof (2) and concrete
  // (3) follow, everything else (window cleaning etc.) is secondary.
  const primary = services
    .filter((s) => s.primary)
    .sort((a, b) => a.primary - b.primary);
  const solar = primary.find((s) => s.primary === 1);
  const secondaryPrimary = primary.filter((s) => s.primary !== 1);
  const extras = services.filter((s) => !s.primary);

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

        {/* Solar - the flagship service, full width and most prominent */}
        {solar && (
          <div className="mb-4">
            <PackageTile s={solar} big />
          </div>
        )}

        {/* Roof + Concrete - second and third priority, side by side */}
        {secondaryPrimary.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {secondaryPrimary.map((s) => (
              <PackageTile key={s.slug} s={s} />
            ))}
          </div>
        )}

        {/* Everything above the roofline - the secondary services as a
            photo-led gallery rather than another row of sales cards. Header
            runs side-by-side (headline left, description right) on desktop. */}
        {extras.length > 0 && (
          <>
            <div className="mt-20 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-white/40 tracking-widest text-xs font-semibold uppercase">Also Available</span>
                <h3 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                  <span className="text-white">Everything</span>{" "}
                  <span className="text-white/40">above the roofline.</span>
                </h3>
              </div>
              <p className="text-white/50 max-w-sm md:text-right">
                Window cleaning and more, from the same drone-equipped team.
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
          </>
        )}

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
            to="/#packages"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition whitespace-nowrap"
          >
            See Service Bundles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
