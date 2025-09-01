// src/pages/ServiceDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, CheckCircle, Clock, Shield, Star, Phone,
  Leaf, Zap, BadgeCheck, MapPin
} from "lucide-react";
import { copy } from "../lib/copy";

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Section = ({ tone = "white", className = "", children }) => (
  <section className={`${tone === "white" ? "bg-white" : "bg-slate-50"} ${className}`}>
    <div className="mx-auto max-w-7xl px-6">{children}</div>
  </section>
);

const StatCard = ({ icon: Icon, title, sub, tone }) => (
  <div className="bg-white p-7 rounded-2xl text-center shadow-md ring-1 ring-slate-100">
    <Icon className={`w-9 h-9 mx-auto mb-3 text-${tone}-600`} />
    <div className="font-semibold text-slate-900">{title}</div>
    <div className="text-sm text-slate-600">{sub}</div>
  </div>
);

const Pill = ({ children, icon: Icon, tone = "slate" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm shadow-sm ring-1
    ${tone === "green" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
      tone === "orange" ? "bg-orange-50 text-orange-700 ring-orange-200" :
      tone === "yellow" ? "bg-yellow-50 text-yellow-700 ring-yellow-200" :
      "bg-slate-50 text-slate-700 ring-slate-200"}`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </span>
);

const collectPopularSuburbs = () => {
  const areas = copy.areas?.featured || [];
  const preferred = ["Bondi", "Manly", "Parramatta", "Chatswood", "Coogee", "Surry Hills", "Paddington", "Newtown"];
  const set = new Set(preferred);
  for (const a of areas) {
    const list = a.coverageDetails?.map((d) => d.name) || a.coverageSuburbs || [];
    for (const n of list) { if (set.size < 12) set.add(n); }
    if (set.size >= 12) break;
  }
  return Array.from(set).slice(0, 8);
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = (copy.services || []).find((s) => s.slug === slug);

  if (!service) {
    return (
      <main className="pt-24">
        <Section className="py-24 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Service Not Found</h1>
          <p className="text-slate-600 mb-6">The service you’re looking for doesn’t exist.</p>
          <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
        </Section>
      </main>
    );
  }

  const headline = service.title;
  const sub = service.long || service.blurb || "Professional, reliable, and eco-friendly cleaning solutions.";
  const heroImg = service.image;
  const suburbs = collectPopularSuburbs();

  return (
    <main className="pt-24">
      {/* HERO */}
      <Section className="pt-10 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">{headline}</h1>
            <p className="text-xl text-slate-600 mt-3">{sub}</p>
          </div>

          {/* Dominant banner */}
          <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-slate-200">
            <div className="relative h-[460px] md:h-[520px]">
              {heroImg && <img src={heroImg} alt={headline} className="absolute inset-0 w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                <h2 className="text-white text-3xl font-bold drop-shadow">{headline}</h2>
                <p className="text-white/85 text-sm">Expert {headline.toLowerCase()} across Sydney</p>
              </div>
            </div>
          </div>
        </div>

        {/* Soft divider under hero */}
        <div className="w-full">
          <svg viewBox="0 0 1440 72" className="w-full -mb-1 text-white" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,32 C240,72 480,0 720,24 C960,48 1200,72 1440,32 L1440,72 L0,72 Z" />
          </svg>
        </div>

        {/* Floating tray with stats + CTAs */}
        <div className="max-w-7xl mx-auto -mt-10 md:-mt-12 px-0">
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-200 px-6 py-8 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={Clock} title="Same Day" sub="Service Available" tone="blue" />
              <StatCard icon={Shield} title="Fully Insured" sub="$10M Coverage" tone="green" />
              <StatCard icon={Star} title="5-Star Rated" sub="247+ Reviews" tone="yellow" />
              <div className="bg-white p-7 rounded-2xl text-center shadow-md ring-1 ring-slate-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">100%</div>
                <div className="font-semibold text-slate-900">Satisfaction</div>
                <div className="text-sm text-slate-600">Guaranteed</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-[#F79029] text-white font-semibold px-7 py-3.5 hover:bg-[#e27f17] shadow-md"
              >
                Get Free Quote Now
              </Link>
              <a
                href="tel:0414203262"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-800 hover:bg-slate-50 shadow-sm"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call for Same-Day Service
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* WHAT’S INCLUDED — airy cards + chips */}
      <Section tone="white" className="py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
          What’s Included in Our {headline}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {(service.bullets || []).map((b, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-white shadow-md ring-1 ring-slate-200 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">{b}</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Professional service with attention to detail and guaranteed results.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* chips row with spacing */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Pill icon={Star} tone="yellow">5.0 rating</Pill>
          <Pill icon={Zap} tone="orange">Same-day available</Pill>
          <Pill icon={BadgeCheck} tone="green">100% Satisfaction</Pill>
          <Pill icon={Leaf}>Eco-friendly</Pill>
        </div>
      </Section>

      {/* PROCESS */}
      <Section tone="slate" className="py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-14 text-center">Our Professional Process</h2>
        <div className="grid md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {[
            { step: "1", title: "Free Assessment", desc: "We evaluate your property and provide a detailed quote with no hidden costs." },
            { step: "2", title: "Professional Setup", desc: "Our team arrives with all necessary equipment and safety gear." },
            { step: "3", title: "Expert Cleaning", desc: "We use proven techniques and eco-friendly products for optimal results." },
            { step: "4", title: "Quality Check", desc: "Final inspection to ensure everything meets our high standards." },
          ].map((it) => (
            <div key={it.step} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="text-white font-bold text-xl">{it.step}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{it.title}</h3>
              <p className="text-slate-600 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SERVICE AREAS */}
      <Section tone="white" className="py-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">{headline} Service Areas Across Sydney</h2>
          <p className="text-slate-600 mt-3">
            Professional {headline.toLowerCase()} available throughout Sydney NSW
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {suburbs.map((name) => {
            const s = slugify(name);
            return (
              <div key={name} className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-5 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1 text-blue-600">
                    <MapPin className="w-4 h-4" /><span className="text-xs font-medium">Sydney</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="font-semibold text-slate-900 text-lg">{name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  {`Professional ${headline.toLowerCase()} in ${name}`}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to="/contact"
                    className="inline-flex justify-center items-center px-3.5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                  >
                    Book Service
                  </Link>
                  <Link
                    to={`/areas/${s}`}
                    className="inline-flex justify-center items-center px-3.5 py-2.5 rounded-lg border text-sm font-semibold hover:bg-slate-50"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* CLOSING CTA */}
      <Section tone="slate" className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F79029] text-white rounded-3xl shadow-xl p-10 text-center ring-1 ring-orange-200">
            <h3 className="text-3xl font-bold mb-3">Ready to book {headline}?</h3>
            <p className="mb-7 text-white/95 text-lg">Get a fast, no-obligation quote — same-day slots often available.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center rounded-xl bg-white text-[#F79029] font-semibold px-7 py-3.5 hover:bg-gray-100 shadow">
                Get Free Quote
              </Link>
              <a href="tel:0414203262" className="inline-flex items-center justify-center rounded-xl border border-white/60 bg-transparent px-7 py-3.5 font-semibold text-white hover:bg-white/10">
                <Phone className="w-5 h-5 mr-2" /> Call 0414 203 262
              </a>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}