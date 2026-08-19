// src/pages/Services.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Shield, Star, Phone, MapPin, ArrowRight } from "lucide-react";
import Section from "../components/ui/Section";
import Glow from "../components/Glow";
import CTA from "../components/sections/CTA";
import ServicesGrid from "../components/sections/Services";
import { copy } from "../lib/copy";
import Meta from '../Meta';

const Stat = ({ icon: Icon, title, sub }) => (
  <div className="bg-white/[0.04] p-6 rounded-2xl text-center border border-white/10">
    <Icon className="w-8 h-8 mx-auto mb-3 text-[#22d3ee]" />
    <div className="font-semibold text-white">{title}</div>
    <div className="text-sm text-white/50">{sub}</div>
  </div>
);

export default function Services() {
  // collage sources (first 4 services with images)
  const collage = useMemo(() => {
    const src = (copy.services || [])
      .filter((s) => s.image)
      .slice(0, 4)
      .map((s) => ({ src: s.image, alt: s.title }));
    // fallback placeholder if fewer than 4
    while (src.length < 4) {
      src.push({
        src:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        alt: "Professional cleaning",
      });
    }
    return src.slice(0, 4);
  }, []);

  // pick 6 areas for the teaser (respect a sensible order if present)
  const areas = useMemo(() => {
    const list = copy.areas?.featured || [];
    const desired = [
      "eastern-suburbs",
      "northern-beaches",
      "north-shore",
      "inner-west",
      "western-sydney",
      "hills-district",
      "south-sydney",
    ];
    const bySlug = Object.fromEntries(list.map((a) => [a.slug, a]));
    const ordered = desired.map((s) => bySlug[s]).filter(Boolean);
    const rest = list.filter((a) => !desired.includes(a.slug));
    return [...ordered, ...rest].slice(0, 6);
  }, []);

  return (
    <>
      <Meta title="Cleaning Services in Sydney | Horizon Solar & Exterior Care" desc="Drone-powered solar panel cleaning and pressure washing, plus roof & gutter and window cleaning. Fast quotes. Same-day service." path="/services" />
      <main className="pt-24 bg-[#02060c]">
        {/* HERO with collage */}
        <Section className="relative overflow-hidden pt-12 pb-20 border-b border-white/5">
          <Glow color="#22d3ee" className="w-[560px] h-[560px] -top-64 -right-52" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Copy */}
              <div>
                <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Services</span>
                <h1 className="mt-3 text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                  Our Services
                </h1>
                <p className="text-lg md:text-xl text-white/60 mt-4">
                  Drone-powered solar panel cleaning and pressure washing are what we do best,
                  backed up by roof, gutter and window cleaning — with same-day availability.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#22d3ee] text-black font-semibold hover:bg-white transition-colors"
                  >
                    Get Free Quote Now
                  </Link>
                  <a
                    href="tel:0414203262"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-white/50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call for Same-Day Service
                  </a>
                </div>
              </div>

              {/* Collage */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-white/10">
                  <div className="grid grid-cols-2 grid-rows-2 h-[380px] md:h-[440px] gap-0.5 bg-white/10">
                    <img src={collage[0].src} alt={collage[0].alt} className="w-full h-full object-cover" />
                    <img src={collage[1].src} alt={collage[1].alt} className="w-full h-full object-cover" />
                    <img src={collage[2].src} alt={collage[2].alt} className="w-full h-full object-cover" />
                    <img src={collage[3].src} alt={collage[3].alt} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* STATS tray */}
        <Section className="bg-[#050910] py-14 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={Clock} title="Same Day" sub="Service Available" />
              <Stat icon={Shield} title="Fully Insured" sub="$10M Coverage" />
              <Stat icon={Star} title="5-Star Rated" sub="247+ Reviews" />
              <div className="bg-white/[0.04] p-6 rounded-2xl text-center border border-white/10">
                <div className="text-2xl font-bold text-[#22d3ee] mb-2">100%</div>
                <div className="font-semibold text-white">Satisfaction</div>
                <div className="text-sm text-white/50">Guaranteed</div>
              </div>
            </div>
          </div>
        </Section>

        {/* SERVICES GRID (shared, already dark-themed) */}
        <ServicesGrid />

        {/* SERVICE AREAS TEASER */}
        <Section className="bg-[#02060c] py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white">Where We Operate</h2>
              <p className="text-white/60 mt-2">
                Same-day service across Sydney — here are some of our most requested areas.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {areas.map((a) => {
                const subs = (a.coverageDetails?.map((d) => d.name) || a.coverageSuburbs || []).slice(0, 3);
                return (
                  <div
                    key={a.slug}
                    className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:bg-white/[0.06] transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{a.name}</h3>
                      <MapPin className="w-5 h-5 text-[#22d3ee]" />
                    </div>
                    <p className="text-sm text-white/50">
                      {a.tagline || a.description || "Local specialists • Fast response"}
                    </p>
                    {subs.length > 0 && (
                      <ul className="mt-4 space-y-1 text-sm text-white/70">
                        {subs.map((s) => (
                          <li key={s} className="flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-5 flex items-center gap-2">
                      <Link
                        to={`/areas/${a.slug}`}
                        className="inline-flex items-center gap-1.5 text-[#22d3ee] font-semibold hover:text-white transition-colors"
                      >
                        Explore <ArrowRight className="w-4 h-4" />
                      </Link>
                      <span className="text-white/20">|</span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/areas"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-white/50 transition-colors"
              >
                View All Areas
              </Link>
            </div>
          </div>
        </Section>

        <CTA />
      </main>
    </>
  );
}
