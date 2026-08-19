// src/pages/AreaDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { copy } from "../lib/copy";
import {
  CheckCircle, Phone, Mail, MapPin, Clock,
  ShieldCheck, Zap, Leaf, BadgeCheck, Star, Users
} from "lucide-react";
import Meta from "../Meta"; // <-- SEO
import { submitLead } from "../lib/submitLead";
import { useCms } from "../lib/useCms";
import { mapArea } from "../lib/cmsAdapters";

/* ---------------- helpers ---------------- */
const slugify = (str) =>
  String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function resolveAreaOrSuburb(slug, areas) {
  const direct = areas.find((a) => a.slug === slug);
  if (direct) return { vm: direct, parent: direct, isSuburb: false };

  for (const parent of areas) {
    const details = parent.coverageDetails || [];
    const subs = parent.coverageSuburbs || [];

    const hitDetail = details.find((d) => slugify(d.name) === slug);
    if (hitDetail) {
      const vm = {
        ...parent,
        name: hitDetail.name,
        slug,
        postcode: hitDetail.postcode || parent.postcode,
        lat: hitDetail.lat ?? parent.lat,
        lng: hitDetail.lng ?? parent.lng,
        tagline:
          hitDetail.tagline ||
          parent.tagline ||
          `Professional cleaning services in ${hitDetail.name}, ${parent.displayName || parent.name}`,
      };
      return { vm, parent, isSuburb: true };
    }
    const hitName = subs.find((n) => slugify(n) === slug);
    if (hitName) {
      const vm = {
        ...parent,
        name: hitName,
        slug,
        tagline:
          parent.tagline ||
          `Professional cleaning services in ${hitName}, ${parent.displayName || parent.name}`,
      };
      return { vm, parent, isSuburb: true };
    }
  }
  return { vm: null, parent: null, isSuburb: false };
}

/* ---------------- UI atoms ---------------- */
const inputCls =
  "w-full rounded-lg bg-white/[0.04] border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]";

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-white/70 mb-1">{children}</label>
);
const Input = ({ id, type = "text", ...props }) => (
  <input id={id} type={type} className={inputCls} {...props} />
);
const Select = ({ id, children, ...props }) => (
  <select id={id} className={`${inputCls} [&>option]:bg-[#0a0f1a]`} {...props}>{children}</select>
);
const Textarea = ({ id, rows = 4, ...props }) => (
  <textarea id={id} rows={rows} className={`${inputCls} resize-none`} {...props} />
);
const Bullet = ({ children }) => (
  <div className="flex items-start gap-2"><CheckCircle className="text-[#22d3ee] flex-shrink-0 mt-0.5" size={18} /><p className="text-white/70 text-sm">{children}</p></div>
);
const TelButton = ({ number = "02 8000 1080", className = "" }) => (
  <a href={`tel:${number.replace(/\s+/g, "")}`}
    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-[#22d3ee] text-black font-semibold hover:bg-white transition-colors ${className}`}>
    <Phone size={18} /> {number}
  </a>
);
const EmailButton = ({ to = "info@example.com", className = "" }) => (
  <a href={`mailto:${to}`}
    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 border border-white/20 text-white font-semibold hover:border-white/50 transition-colors ${className}`}>
    <Mail size={18} /> Email Us
  </a>
);
const HeroMeta = ({ areaName, postcode }) => (
  <div className="space-y-2 mb-6 text-sm text-white/70">
    <p className="flex items-center gap-2"><MapPin className="text-[#22d3ee]" size={18} /> Servicing {areaName} {postcode && <>• Postcode {postcode}</>}</p>
    <p className="flex items-center gap-2"><Clock className="text-[#22d3ee]" size={18} /> Quick Response • Same-Day Service Available</p>
  </div>
);

/* ---------------- section wrapper (adds separation) ---------------- */
const SectionBlock = ({ tone = "light", children }) => {
  const bg = tone === "light" ? "bg-[#02060c]" : "bg-[#050910]";
  return (
    <section className={`${bg} py-12 md:py-16 border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- Left rail ---------------- */
const LeftRail = ({ areaName, whyPoints = [] }) => {
  const defaults = [
    `Local ${areaName} team with 5+ years experience`,
    `Same-day service available in ${areaName}`,
    "100% satisfaction guarantee",
    `Competitive ${areaName} pricing`,
  ];
  const points = (whyPoints?.length ? whyPoints : defaults).slice(0, 6);
  return (
    <div className="space-y-4">
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">Why Choose Us for {areaName}?</h3>
        <div className="space-y-3">{points.map((p, i) => <Bullet key={i}>{p}</Bullet>)}</div>
      </div>
      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
        <h4 className="font-semibold text-lg text-white">Call Now for Immediate Service</h4>
        <div className="mt-4"><TelButton className="w-full" /></div>
        <p className="text-xs text-white/50 mt-3">Available 7 days a week for {areaName} cleaning services</p>
      </div>
    </div>
  );
};

/* ---------------- Quote form ---------------- */
const QuoteForm = ({ areaName = "Parramatta", services = [], propertyTypes = [] }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    service: "",
    propertyType: "",
    contactMethod: "",
    notes: ""
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.suburb || !form.service) {
      alert("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    try {
      await submitLead({ ...form, sourcePage: "Area Detail Page" });
      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        suburb: "",
        service: "",
        propertyType: "",
        contactMethod: "",
        notes: ""
      });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">Get Your Free {areaName} Cleaning Quote</h3>
      <p className="text-white/50 mb-6 text-sm">Professional cleaning services specifically for {areaName} properties</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label htmlFor="name">Full Name *</Label><Input id="name" name="name" required value={form.name} onChange={onChange} placeholder="Enter your full name" /></div>
          <div><Label htmlFor="phone">Phone Number *</Label><Input id="phone" name="phone" required value={form.phone} onChange={onChange} placeholder="0414 203 262" /></div>
          <div><Label htmlFor="email">Email Address *</Label><Input id="email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="your.email@example.com" /></div>
          <div><Label htmlFor="suburb">Suburb *</Label><Input id="suburb" name="suburb" required value={form.suburb} onChange={onChange} placeholder="Enter your suburb" /></div>
          <div>
            <Label htmlFor="service">Service Required *</Label>
            <Select id="service" name="service" required value={form.service} onChange={onChange}>
              <option value="">Select a service</option>
              {services.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select id="propertyType" name="propertyType" value={form.propertyType} onChange={onChange}>
              <option value="">Select property type</option>
              {(propertyTypes.length ? propertyTypes : ["House", "Apartment", "Townhouse", "Commercial"]).map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="contactMethod">Preferred Contact Method</Label>
            <Select id="contactMethod" name="contactMethod" value={form.contactMethod} onChange={onChange}>
              <option value="">How would you like us to contact you?</option>
              <option>Phone</option><option>SMS</option><option>Email</option><option>WhatsApp</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="notes">Additional Information</Label>
            <Textarea id="notes" name="notes" value={form.notes} onChange={onChange}
              placeholder="Tell us about your specific requirements, property size, or any special instructions..." />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-[#22d3ee] hover:bg-white text-black font-semibold py-3 transition-colors"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Get Free Quote"}
        </button>
        {status === "success" && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-center">
            Thank you! Your request was sent successfully.
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-center">
            Sorry, there was a problem submitting your request. Please try again.
          </div>
        )}
      </form>
      <div className="text-center mt-6 text-sm">
        <p className="mb-3 text-white/60">Prefer to speak directly? Call us now!</p>
        <div className="flex items-center justify-center gap-3"><TelButton /><EmailButton /></div>
      </div>
    </div>
  );
};

/* ---------------- Insights + Coverage ---------------- */
const AreaInsightsAndCoverage = ({ area, brandShort = "Horizon" }) => {
  const bullets = area.expertiseBullets?.length
    ? area.expertiseBullets
    : [
        `Specialized cleaning for ${area.name} CBD properties`,
        "Specialized cleaning for transport hub properties",
        "Specialized cleaning for commercial district properties",
        "Specialized cleaning for mixed development properties",
      ];

  const guarantees = area.guarantees?.length
    ? area.guarantees
    : ["Fully Insured", "Same-Day Service", "100% Satisfaction", "Eco-Friendly"];

  const suburbs = (area.coverageDetails?.length
    ? area.coverageDetails.map((d) => d.name)
    : (area.coverageSuburbs || []));

  const iconCycle = [ShieldCheck, Zap, Leaf, BadgeCheck];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Why {area.name} Residents Choose {brandShort} Services
          </h2>
          <p className="text-white/60 leading-relaxed">
            {area.areaIntro ||
              `As your local ${area.name} specialists, we understand the area’s property challenges and tailor our cleaning to local conditions.`}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="text-[#22d3ee]" size={18} />
            <h3 className="font-semibold text-white">Local {area.name} Expertise</h3>
          </div>
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="text-[#22d3ee] mt-0.5 flex-shrink-0" size={18} />
                <span className="text-white/70">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4 text-white">Our {area.name} Service Guarantee</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/80">
            {guarantees.map((g, i) => {
              const Icon = iconCycle[i % iconCycle.length];
              return (
                <div key={g} className="flex items-center gap-2">
                  <Icon size={16} className="text-[#22d3ee]" />
                  <span>{g}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coverage */}
      <aside className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-[#22d3ee]" size={18} />
          <h3 className="font-semibold text-white">Service Coverage Area</h3>
        </div>
        <p className="text-sm text-white/50 mb-4">We proudly service {area.name} and surrounding areas:</p>

        {suburbs?.length ? (
          <div className="grid grid-cols-2 gap-2">
            {suburbs.map((s) => (
              <Link
                key={s}
                to={`/areas/${slugify(s)}`}
                className="text-sm px-3 py-2 bg-white/[0.04] border border-white/10 rounded-md text-white/70 hover:bg-white/[0.08] hover:text-[#22d3ee] transition"
              >
                {s}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-sm text-white/40 italic">Coverage list coming soon.</div>
        )}

        <div className="mt-4 rounded-md bg-[#f79029]/10 border border-[#f79029]/20 text-[#f79029] text-sm px-3 py-3">
          <strong className="font-semibold">Local to {area.name}:</strong>{" "}
          <span className="text-white/70">Fast response times, competitive pricing, and personalized service from neighborhood experts.</span>
        </div>
      </aside>
    </div>
  );
};

/* ---------------- FAQ grid ---------------- */
const FAQGrid = ({ title, faqs = [] }) => {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {faqs.map((f, i) => (
          <div key={i} className="border border-white/10 rounded-lg bg-white/[0.03]">
            <button
              className="w-full flex justify-between items-center px-5 py-4 text-left text-base md:text-lg font-medium text-white"
              onClick={() => toggle(i)} aria-expanded={open === i} aria-controls={`faq-${i}`}
            >
              {f.question}
              <span className="ml-2 text-xl text-[#22d3ee]">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div id={`faq-${i}`} className="px-5 pb-4 text-white/60 text-sm md:text-base">{f.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */
const AreaDetailPage = () => {
  const { slug } = useParams();
  const { data: apiAreas } = useCms("/api/areas", null);
  const areas = apiAreas?.length ? apiAreas.map(mapArea) : (copy.areas?.featured || []);
  const { vm: area, parent } = resolveAreaOrSuburb(slug, areas);

  // ---- SEO bits (added) ----
  const hasArea = !!area;
  const seoTitle = hasArea
    ? `Cleaning Services ${area.name} Sydney | Horizon`
    : "Service Areas in Sydney | Horizon";
  const seoDesc = hasArea
    ? `Drone-powered solar cleaning, thermal scanning and pressure washing in ${area.name}. Same-day service. Call 02 8000 1080.`
    : "Professional cleaning across Sydney suburbs. Same-day service. Call 02 8000 1080.";
  const canonicalPath = hasArea ? `/areas/${slug}` : `/areas`;
  const jsonLd = hasArea ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Cleaning Services in ${area.name}`,
    "areaServed": {
      "@type": "City",
      "name": area.name,
      ...(area.lat && area.lng ? { geo: { "@type": "GeoCoordinates", latitude: area.lat, longitude: area.lng } } : {}),
      containedInPlace: { "@type": "AdministrativeArea", name: "Sydney, NSW" },
    },
    "provider": {
      "@type": "LocalBusiness",
      "name": "Horizon Solar & Exterior Care",
      "url": "https://arcturusservices.com.au",
      "telephone": "+61-2-8000-1080",
    }
  } : null;

  if (!area) {
    return (
      <>
        <Meta title={seoTitle} desc={seoDesc} path={canonicalPath} />
        <div className="max-w-5xl mx-auto py-20 text-center bg-[#02060c] min-h-screen">
          <h1 className="text-3xl font-bold text-white">Area Not Found</h1>
          <Link to="/areas" className="text-[#22d3ee] underline mt-4 block">Back to All Areas</Link>
        </div>
      </>
    );
  }

  const services = copy.services || [];
  const faqs = area.faqs?.length ? area.faqs : [
    { question: `How much does cleaning cost in ${area.name}?`, answer: "Pricing depends on the service and property size. Get a free, no-obligation quote." },
    { question: "Do you clean commercial properties in this area?", answer: "Yes — offices, storefronts, and industrial units." },
    { question: "Do you offer same-day cleaning services?", answer: "Subject to availability. Call to confirm a slot." },
    { question: "Are your services insured?", answer: "Fully insured and performed by licensed professionals." },
    { question: "What payment methods do you accept?", answer: "Cash, card, and secure online payments." },
    { question: `How do I prepare my property in ${area.name}?`, answer: "Minimal prep. Clear sensitive items; we bring everything else." },
    { question: "Do you provide emergency cleaning services?", answer: "Yes. Call for fastest response." },
    { question: `What makes your ${area.name} cleaning service different?`, answer: "Local team, eco-friendly methods, strict QA, and rapid response." },
  ];

  return (
    <>
      {/* SEO head */}
      <Meta title={seoTitle} desc={seoDesc} path={canonicalPath} image={area.image}>
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
        {/* FAQPage - mirrors the FAQGrid below exactly */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        })}</script>
      </Meta>

      <div className="pt-24 bg-[#02060c]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#050910] text-white py-12 md:py-20 px-6 border-b border-white/5">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.08] -top-40 -right-40 bg-[#22d3ee] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Local Service Area</span>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight mb-4">
                Professional Cleaning Services <span className="text-[#f79029]">{area.name}</span>
              </h1>
              {area.tagline && <p className="text-lg mb-6 text-white/60">{area.tagline}</p>}
              <HeroMeta areaName={area.name} postcode={area.postcode} />
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="bg-[#22d3ee] text-black px-6 py-3 rounded-full font-semibold hover:bg-white transition-colors">
                  Get Free Quote for {area.name}
                </Link>
                <a href="tel:0280001080" className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:border-white/50 transition-colors">
                  Call 02 8000 1080
                </a>
              </div>
            </div>
            <div>
              {(area.lat && area.lng) ? (
                <iframe
                  title={`${area.name} map`}
                  src={`https://www.google.com/maps?q=${area.lat},${area.lng}&z=14&output=embed`}
                  className="w-full h-80 md:h-96 rounded-2xl border border-white/10"
                  loading="lazy"
                  allowFullScreen
                />
              ) : (
                <div className="bg-white/[0.04] border border-white/10 w-full h-80 md:h-96 flex items-center justify-center rounded-2xl">
                  <p className="text-white/50">Map not available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SERVICES — premium cards */}
        <SectionBlock tone="light">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Premium Cleaning Services in {area.name}</h2>
            <p className="text-white/60 mt-2">
              Professional, reliable, and eco-friendly cleaning solutions tailored for {area.name} properties
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {services.map((svc) => (
              <article
                key={svc.slug}
                className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]"
              >
                <div className="relative h-52 w-full">
                  {svc.image && (
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-xl drop-shadow">{svc.title}</h3>
                    <p className="text-white/70 text-sm">
                      Professional {svc.title.toLowerCase()} in {area.name}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-white/60 leading-relaxed">
                    {svc.blurb} Our professional team uses advanced equipment and eco-friendly
                    solutions to deliver outstanding results for {area.name} residents and businesses.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/60">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#f79029]" /> 5.0 rating
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#22d3ee]" /> 200+ happy customers
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-4 h-4 text-[#f79029]" /> Same-day available
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#22d3ee]">
                      <ShieldCheck className="w-4 h-4" /> 100% Satisfaction Guarantee
                    </span>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center rounded-full bg-[#22d3ee] text-black font-semibold px-4 py-2 hover:bg-white transition-colors"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionBlock>

        {/* INSIGHTS + COVERAGE */}
        <SectionBlock tone="subtle">
          <AreaInsightsAndCoverage area={parent || area} brandShort="Horizon" />
        </SectionBlock>

        {/* QUOTE SECTION */}
        <SectionBlock tone="light">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <LeftRail areaName={area.name} whyPoints={area.whyChoose} />
            <QuoteForm areaName={area.name} services={copy.services || []} propertyTypes={area.propertyTypes || []} />
          </div>
        </SectionBlock>

        {/* FAQ */}
        <SectionBlock tone="subtle">
          <FAQGrid title={`Frequently Asked Questions - ${area.name} Cleaning Services`} faqs={faqs} />
        </SectionBlock>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#02060c]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-10 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Ready to Book Your {area.name} Cleaning Service?</h2>
              <p className="mb-6 text-lg text-white/60">Get your free, no-obligation quote today. Our {area.name} cleaning experts are standing by.</p>
              <Link to="/contact" className="inline-block bg-[#22d3ee] text-black font-semibold py-3 px-8 rounded-full hover:bg-white transition-colors">
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AreaDetailPage;
