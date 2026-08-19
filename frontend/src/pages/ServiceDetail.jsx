// src/pages/ServiceDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, CheckCircle, Star, Phone,
  Leaf, Zap, BadgeCheck, MapPin
} from "lucide-react";
import { copy } from "../lib/copy";
import Glow from "../components/Glow";
import Meta from "../Meta";

// --- helpers ---
const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Section = ({ tone = "dark", className = "", children }) => (
  <section className={`${tone === "dark" ? "bg-[#02060c]" : "bg-[#050910]"} border-b border-white/5 ${className}`}>
    <div className="mx-auto max-w-7xl px-6">{children}</div>
  </section>
);

const Pill = ({ children, icon: Icon }) => (
  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-white/[0.04] border border-white/10 text-white/70">
    {Icon && <Icon className="w-4 h-4 text-[#22d3ee]" />}
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

// --- main component ---
export default function ServiceDetail() {
  const { slug } = useParams();
  const service = (copy.services || []).find((s) => s.slug === slug);

  // fallback meta
  const title = service
    ? `${service.title} Sydney | Horizon Solar & Exterior Care`
    : "Cleaning Services Sydney | Horizon Solar & Exterior Care";
  const desc = service
    ? `${service.blurb} Same-day service. Fully insured. Call 0414 203 262.`
    : "Professional cleaning across Sydney. Same-day service.";
  const canon = service ? `/services/${service.slug}` : `/services`;
  const jsonLd = service && {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.title,
    "name": service.title,
    "description": service.blurb,
    "image": service.image ? `https://arcturusservices.com.au${service.image}` : undefined,
    "areaServed": (copy.areas?.featured || []).map((a) => ({
      "@type": "City",
      "name": a.name,
      "containedInPlace": { "@type": "AdministrativeArea", "name": "Sydney, NSW" },
    })),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Horizon Solar & Exterior Care",
      "url": "https://arcturusservices.com.au",
      "telephone": "+61-2-8000-1080",
      "areaServed": "Sydney, NSW, Australia",
    }
  };

  // service not found
  if (!service) {
    return (
      <>
        <Meta title={title} desc={desc} path={canon} />
        <main className="pt-24 bg-[#02060c] min-h-screen">
          <Section className="py-24 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Service Not Found</h1>
            <p className="text-white/60 mb-6">The service you’re looking for doesn’t exist.</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[#22d3ee] hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
          </Section>
        </main>
      </>
    );
  }

  // destructure service
  const headline = service.title;
  const sub = service.long || service.blurb || "Professional, reliable, and eco-friendly cleaning solutions.";
  const heroImg = service.image;
  const suburbs = collectPopularSuburbs();

  return (
    <>
      <Meta title={title} desc={desc} path={canon} image={service.image}>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Meta>

      <main className="pt-24 bg-[#02060c]">
        {/* HERO */}
        <Section className="relative overflow-hidden pt-10 pb-20">
          <Glow color="#22d3ee" className="w-[480px] h-[480px] -top-32 -right-32" />
          <div className="relative mb-6">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[#22d3ee] hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
          </div>

          <div className="text-center mb-6">
            {service.flagship && (
              <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Flagship Service</span>
            )}
            <h1 className="mt-3 text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              {headline}
            </h1>
            <p className="text-xl text-white/60 mt-3">{sub}</p>
          </div>

          {/* Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <div className="relative h-[460px] md:h-[520px]">
              {heroImg && (
                <img
                  src={heroImg}
                  alt={headline}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                <h2 className="text-white text-3xl font-bold drop-shadow">{headline}</h2>
                <p className="text-white/70 text-sm">
                  Expert {headline.toLowerCase()} across Sydney
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* WHAT’S INCLUDED */}
        <Section tone="alt" className="py-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            What’s Included in Our {headline}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {(service.bullets || []).map((b, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#22d3ee]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-6 h-6 text-[#22d3ee]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{b}</h3>
                    <p className="text-white/50 text-sm mt-1">
                      Professional service with attention to detail and guaranteed results.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Pill icon={Star}>5.0 rating</Pill>
            <Pill icon={Zap}>Same-day available</Pill>
            <Pill icon={BadgeCheck}>100% Satisfaction</Pill>
            <Pill icon={Leaf}>Eco-friendly</Pill>
          </div>
        </Section>

        {/* PROCESS */}
        <Section className="py-20">
          <h2 className="text-4xl font-bold text-white mb-14 text-center">
            Our Professional Process
          </h2>
          <div className="grid md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Free Assessment", desc: "We evaluate your property and provide a detailed quote with no hidden costs." },
              { step: "2", title: "Professional Setup", desc: "Our team arrives with all necessary equipment and safety gear." },
              { step: "3", title: "Expert Cleaning", desc: "We use proven techniques and eco-friendly products for optimal results." },
              { step: "4", title: "Quality Check", desc: "Final inspection to ensure everything meets our high standards." },
            ].map((it) => (
              <div key={it.step} className="text-center">
                <div className="w-16 h-16 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#22d3ee] font-bold text-xl">{it.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{it.title}</h3>
                <p className="text-white/50 text-sm">{it.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* SERVICE AREAS */}
        <Section tone="alt" className="py-20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white">{headline} Service Areas Across Sydney</h2>
            <p className="text-white/60 mt-3">
              Professional {headline.toLowerCase()} available throughout Sydney NSW
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suburbs.map((name) => {
              const s = slugify(name);
              return (
                <div
                  key={name}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1 text-[#22d3ee]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium">Sydney</span>
                    </div>
                    <Star className="w-4 h-4 text-[#f79029]" />
                  </div>
                  <div className="font-semibold text-white text-lg">{name}</div>
                  <div className="text-sm text-white/50 mt-1">
                    {`Professional ${headline.toLowerCase()} in ${name}`}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to="/contact"
                      className="inline-flex justify-center items-center px-3.5 py-2.5 rounded-full bg-[#22d3ee] text-black text-sm font-semibold hover:bg-white transition-colors"
                    >
                      Book Service
                    </Link>
                    <Link
                      to={`/areas/${s}`}
                      className="inline-flex justify-center items-center px-3.5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:border-white/50 transition-colors"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/areas"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#22d3ee] text-black font-semibold hover:bg-white transition-colors"
            >
              See All Areas
            </Link>
          </div>
        </Section>

        {/* CTA */}
        <Section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">
              <h3 className="text-3xl font-bold mb-3 text-white">Ready to book {headline}?</h3>
              <p className="mb-7 text-white/60 text-lg">
                Get a fast, no-obligation quote — same-day slots often available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#22d3ee] text-black font-semibold px-7 py-3.5 hover:bg-white transition-colors"
                >
                  Get Free Quote
                </Link>
                <a
                  href="tel:0414203262"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white hover:border-white/50 transition-colors"
                >
                  <Phone className="w-5 h-5" /> Call 02 8000 1080
                </a>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
