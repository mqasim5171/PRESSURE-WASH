// src/components/sections/Services.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Star, ArrowRight } from "lucide-react";
import Section from "../ui/Section";
import { copy } from "../../lib/copy";

const ServiceCard = ({ s }) => {
  const comingSoon = s.slug === "drone-based-washing";

  return (
    <div className="group h-full">
      <article
        className={[
          "bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm",
          "flex flex-col h-full overflow-hidden transition hover:shadow-md",
          comingSoon ? "opacity-95" : "",
        ].join(" ")}
      >
        {/* Image */}
        {s.image && (
          <div className="relative">
            <img
              src={s.image}
              alt={s.title}
              loading="lazy"
              className={[
                "h-44 w-full object-cover transition-transform",
                comingSoon ? "grayscale-[40%] blur-[1px]" : "group-hover:scale-[1.02]",
              ].join(" ")}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>

          {/* flex-1 here ensures descriptions fill spare space so heights match */}
          <p className="text-sm text-slate-600 mt-2 flex-1">{s.blurb}</p>

          {/* Bullets */}
          {Array.isArray(s.bullets) && s.bullets.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {s.bullets.slice(0, 2).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* CTA (locks to bottom with mt-auto on its container) */}
          <div className="mt-auto pt-6">
            {comingSoon ? (
              <div className="w-full text-center rounded-lg bg-slate-100 text-slate-500 font-semibold py-2.5 cursor-not-allowed select-none">
                Coming soon
              </div>
            ) : (
              <Link
                to={`/services/${s.slug}`}
                className="group/btn block w-full text-center rounded-lg bg-emerald-600 hover:bg-[#314085] text-white font-semibold py-2.5 transition"
                aria-label={`Explore ${s.title}`}
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  Explore Service
                  <ArrowRight className="w-4 h-4 transition -mr-0.5 group-hover/btn:translate-x-0.5" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>

      {/* Calm note for the disabled service */}
      {comingSoon && (
        <div className="text-center text-xs text-slate-500 mt-2">
          {s.title} — available soon
        </div>
      )}
    </div>
  );
};

export default function Services() {
  const { servicesIntro, services = [] } = copy;

  return (
    <Section id="services" className="bg-slate-50 py-20">
      {/* Header */}
      <header className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          {servicesIntro.title}
        </h2>
        <p className="text-slate-600 max-w-3xl mx-auto mt-3">{servicesIntro.sub}</p>
      </header>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {services.map((s) => (
            <ServiceCard key={s.slug} s={s} />
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-10 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="flex items-center gap-3 p-5 justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900">Same-day Service</div>
                <div className="text-slate-600">Sydney-wide availability</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900">Fully Insured</div>
                <div className="text-slate-600">$10M public liability</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 justify-center">
              <Star className="w-5 h-5 text-amber-400" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900">5-Star Rated</div>
                <div className="text-slate-600">247+ verified reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bold bundle CTA */}
        <div className="mt-14">
          <div className="rounded-3xl p-[2px] bg-gradient-to-r from-emerald-500 via-orange-400 to-indigo-500 shadow-lg">
            <div className="rounded-3xl bg-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Prefer a custom bundle?
                </h3>
                <p className="text-slate-600 mt-1">
                  Save time and money with a tailored package across multiple services.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-[#f79029] text-white font-semibold hover:bg-[#314085] transition whitespace-nowrap"
              >
                Get a tailored quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}