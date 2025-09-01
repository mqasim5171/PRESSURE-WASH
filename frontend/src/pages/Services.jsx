// src/pages/Services.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Shield, Star, Phone, MapPin, ArrowRight } from "lucide-react";
import Section from "../components/ui/Section";
import CTA from "../components/sections/CTA";
import ServicesGrid from "../components/sections/Services";
import Button from "../components/ui/button";
import { copy } from "../lib/copy";

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Stat = ({ icon: Icon, title, sub, tone }) => (
  <div className="bg-white p-7 rounded-2xl text-center shadow-md ring-1 ring-slate-100">
    <Icon className={`w-9 h-9 mx-auto mb-3 text-${tone}-600`} />
    <div className="font-semibold text-slate-900">{title}</div>
    <div className="text-sm text-slate-600">{sub}</div>
  </div>
);

export default function Services() {
  // collage sources (first 4 non-drone services with images)
  const collage = useMemo(() => {
    const src = (copy.services || [])
      .filter((s) => s.slug !== "drone-based-washing" && s.image)
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
    <main className="pt-24">
      {/* HERO with collage */}
      <Section className="bg-white pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mt-4">
                Professional pressure washing and exterior cleaning solutions that keep your
                property spotless and protected all year round — with same-day availability.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" href="/contact">
                  Get Free Quote Now
                </Button>
                <Button variant="outline" size="lg" href="tel:0414203262">
                  <Phone className="w-5 h-5 mr-2" />
                  Call for Same-Day Service
                </Button>
              </div>
            </div>

            {/* Collage */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                <div className="grid grid-cols-2 grid-rows-2 h-[380px] md:h-[440px]">
                  <img src={collage[0].src} alt={collage[0].alt} className="w-full h-full object-cover" />
                  <img src={collage[1].src} alt={collage[1].alt} className="w-full h-full object-cover" />
                  <img src={collage[2].src} alt={collage[2].alt} className="w-full h-full object-cover" />
                  <img src={collage[3].src} alt={collage[3].alt} className="w-full h-full object-cover" />
                </div>
              </div>
              {/* subtle glow */}
              <div className="absolute -inset-2 rounded-3xl pointer-events-none blur-2xl opacity-25 bg-gradient-to-tr from-blue-300 via-cyan-300 to-emerald-300" />
            </div>
          </div>
        </div>

        {/* soft wave divider */}
        <div className="w-full">
          <svg viewBox="0 0 1440 72" className="w-full -mb-1 text-slate-50" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,32 C240,72 480,0 720,24 C960,48 1200,72 1440,32 L1440,72 L0,72 Z" />
          </svg>
        </div>
      </Section>

      {/* STATS tray */}
      <Section className="bg-slate-50 pt-0 pb-14">
        <div className="max-w-7xl mx-auto -mt-10 md:-mt-12 px-6">
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-200 px-6 py-8 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Stat icon={Clock} title="Same Day" sub="Service Available" tone="blue" />
              <Stat icon={Shield} title="Fully Insured" sub="$10M Coverage" tone="green" />
              <Stat icon={Star} title="5-Star Rated" sub="247+ Reviews" tone="yellow" />
              <div className="bg-white p-7 rounded-2xl text-center shadow-md ring-1 ring-slate-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">100%</div>
                <div className="font-semibold text-slate-900">Satisfaction</div>
                <div className="text-sm text-slate-600">Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICES GRID (your existing section) */}
      <Section className="bg-white">
        <ServicesGrid />
      </Section>

      {/* SERVICE AREAS TEASER */}
      <Section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900">Where We Operate</h2>
            <p className="text-slate-600 mt-2">
              Same-day service across Sydney — here are some of our most requested areas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {areas.map((a) => {
              const subs =
                (a.coverageDetails?.map((d) => d.name) || a.coverageSuburbs || []).slice(0, 3);
              return (
                <div
                  key={a.slug}
                  className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{a.name}</h3>
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-slate-600">
                    {a.tagline || a.description || "Local specialists • Fast response"}
                  </p>
                  {subs.length > 0 && (
                    <ul className="mt-4 space-y-1 text-sm text-slate-800">
                      {subs.map((s) => (
                        <li key={s} className="flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex items-center gap-2">
                    <Link
                      to={`/areas/${a.slug}`}
                      className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Explore <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-slate-300">|</span>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                    >
                      Get a Quote
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" variant="outline" href="/areas">
              View All Areas
            </Button>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Refresh Your Property?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" href="/contact">
              Get Free Quote Now
            </Button>
            <Button variant="outline" size="lg" href="tel:0414203262">
              <Phone className="w-5 h-5 mr-2" />
              Call for Same-Day Service
            </Button>
          </div>
        </div>
      </Section>

      <CTA />
    </main>
  );
}