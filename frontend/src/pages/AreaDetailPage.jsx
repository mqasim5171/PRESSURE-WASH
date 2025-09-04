// src/pages/AreaDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { copy } from "../lib/copy";
import {
  CheckCircle, Phone, Mail, MapPin, Clock,
  ShieldCheck, Zap, Leaf, BadgeCheck, Star, Users
} from "lucide-react";

/* ---------------- helpers ---------------- */
const slugify = (str) =>
  String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function resolveAreaOrSuburb(slug) {
  const areas = copy.areas?.featured || [];
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
const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);
const Input = ({ id, type = "text", ...props }) => (
  <input id={id} type={type}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]" {...props} />
);
const Select = ({ id, children, ...props }) => (
  <select id={id}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F79029]" {...props}>{children}</select>
);
const Textarea = ({ id, rows = 4, ...props }) => (
  <textarea id={id} rows={rows}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]" {...props} />
);
const Bullet = ({ children }) => (
  <div className="flex items-start gap-2"><CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} /><p className="text-gray-700 text-sm">{children}</p></div>
);
const TelButton = ({ number = "0280 001 080", className = "" }) => (
  <a href={`tel:${number.replace(/\s+/g, "")}`}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-white text-[#1D2B6F] font-semibold shadow border hover:bg-gray-100 ${className}`}>
    <Phone size={18} /> {number}
  </a>
);
const EmailButton = ({ to = "info@example.com", className = "" }) => (
  <a href={`mailto:${to}`}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 ${className}`}>
    <Mail size={18} /> Email Us
  </a>
);
const HeroMeta = ({ areaName, postcode }) => (
  <div className="space-y-2 mb-6 text-sm">
    <p className="flex items-center gap-2"><MapPin className="text-[#F79029]" size={18} /> Servicing {areaName} {postcode && <>• Postcode {postcode}</>}</p>
    <p className="flex items-center gap-2"><Clock className="text-[#F79029]" size={18} /> Quick Response • Same-Day Service Available</p>
  </div>
);

/* ---------------- section wrapper (adds separation) ---------------- */
const SectionBlock = ({ tone = "light", children }) => {
  const bg = tone === "light" ? "bg-white" : "bg-[#F7F9FC]";
  return (
    <section className={`${bg} py-12 md:py-16`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-2xl bg-white shadow-[0_6px_24px_rgba(16,24,40,0.06)] ring-1 ring-slate-100">
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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
        <h3 className="font-semibold text-lg mb-4">Why Choose Us for {areaName}?</h3>
        <div className="space-y-3">{points.map((p, i) => <Bullet key={i}>{p}</Bullet>)}</div>
      </div>
      <div className="bg-[#F79029] rounded-xl shadow p-6 text-white">
        <h4 className="font-semibold text-lg">Call Now for Immediate Service</h4>
        <div className="mt-4"><TelButton className="bg-white text-[#1D2B6F] w-full justify-center" /></div>
        <p className="text-xs opacity-90 mt-3">Available 7 days a week for {areaName} cleaning services</p>
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
    // Basic validation
    if (!form.name || !form.phone || !form.email || !form.suburb || !form.service) {
      alert("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:8000/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
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
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold mb-1">Get Your Free {areaName} Cleaning Quote</h3>
      <p className="text-gray-600 mb-6 text-sm">Professional cleaning services specifically for {areaName} properties</p>
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
          className="w-full rounded-lg bg-[#F79029] hover:bg-[#e27f17] text-white font-semibold py-3"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Get Free Quote"}
        </button>
        {status === "success" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-center">
            Thank you! Your request was sent successfully.
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-center">
            Sorry, there was a problem submitting your request. Please try again.
          </div>
        )}
      </form>
      <div className="text-center mt-6 text-sm">
        <p className="mb-3">Prefer to speak directly? Call us now!</p>
        <div className="flex items-center justify-center gap-3"><TelButton /><EmailButton /></div>
      </div>
    </div>
  );
};

/* ---------------- Insights + Coverage ---------------- */
const AreaInsightsAndCoverage = ({ area, brandShort = "Arcturus" }) => {
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
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Why {area.name} Residents Choose {brandShort} Services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {area.areaIntro ||
              `As your local ${area.name} specialists, we understand the area’s property challenges and tailor our cleaning to local conditions.`}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="text-[#1D2B6F]" size={18} />
            <h3 className="font-semibold">Local {area.name} Expertise</h3>
          </div>
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="text-green-400 mt-0.5" size={18} />
                <span className="text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#EAF2FF] rounded-xl p-6 ring-1 ring-blue-100">
          <h4 className="font-semibold mb-4">Our {area.name} Service Guarantee</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-[#1D2B6F]">
            {guarantees.map((g, i) => {
              const Icon = iconCycle[i % iconCycle.length];
              return (
                <div key={g} className="flex items-center gap-2">
                  <Icon size={16} />
                  <span>{g}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coverage */}
      <aside className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-[#1D2B6F]" size={18} />
          <h3 className="font-semibold">Service Coverage Area</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">We proudly service {area.name} and surrounding areas:</p>

        {suburbs?.length ? (
          <div className="grid grid-cols-2 gap-2">
            {suburbs.map((s) => (
              <Link
                key={s}
                to={`/areas/${slugify(s)}`}
                className="text-sm px-3 py-2 bg-[#F7F9FC] rounded-md hover:bg-[#EAF2FF] hover:text-[#1D2B6F] transition"
              >
                {s}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600 italic">Coverage list coming soon.</div>
        )}

        <div className="mt-4 rounded-md bg-[#FEEAD8] text-[#7A3E06] text-sm px-3 py-3">
          <strong className="font-semibold">Local to {area.name}:</strong>{" "}
          Fast response times, competitive pricing, and personalized service from neighborhood experts.
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
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {faqs.map((f, i) => (
          <div key={i} className="border border-gray-200 rounded-lg shadow-sm bg-white">
            <button
              className="w-full flex justify-between items-center px-5 py-4 text-left text-base md:text-lg font-medium text-gray-800"
              onClick={() => toggle(i)} aria-expanded={open === i} aria-controls={`faq-${i}`}
            >
              {f.question}
              <span className="ml-2 text-xl">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div id={`faq-${i}`} className="px-5 pb-4 text-gray-600 text-sm md:text-base">{f.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */
const AreaDetailPage = () => {
  const { slug } = useParams();
  const { vm: area, parent } = resolveAreaOrSuburb(slug);

  if (!area) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Area Not Found</h1>
        <Link to="/areas" className="text-[#F79029] underline mt-4 block">Back to All Areas</Link>
      </div>
    );
  }

  const services = (copy.services || []).filter((s) => s.slug !== "drone-based-washing");
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
    <div className="pt-24">
      {/* HERO */}
      <section className="bg-[#1D2B6F] text-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Professional Cleaning Services <span className="text-[#F79029]">{area.name}</span>
            </h1>
            {area.tagline && <p className="text-lg mb-6">{area.tagline}</p>}
            <HeroMeta areaName={area.name} postcode={area.postcode} />
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="bg-[#F79029] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-md">
                Get Free Quote for {area.name}
              </Link>
              <a href="tel:0414203262" className="bg-white text-[#1D2B6F] px-6 py-3 rounded-lg font-semibold shadow-md border hover:bg-gray-100">
                Call 0414 203 262
              </a>
            </div>
          </div>
          <div>
            {(area.lat && area.lng) ? (
              <iframe
                title={`${area.name} map`}
                src={`https://www.google.com/maps?q=${area.lat},${area.lng}&z=14&output=embed`}
                className="w-full h-80 md:h-96 rounded-xl shadow-lg"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="bg-gray-200 w-full h-80 md:h-96 flex items-center justify-center rounded-xl shadow-lg">
                <p className="text-gray-700">Map not available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES — premium cards */}
      <SectionBlock tone="light">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Premium Cleaning Services in {area.name}</h2>
          <p className="text-slate-600 mt-2">
            Professional, reliable, and eco-friendly cleaning solutions tailored for {area.name} properties
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((svc) => (
            <article
              key={svc.slug}
              className="rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-100 bg-white"
            >
              {/* image banner with overlay title */}
              <div className="relative h-52 w-full">
                {svc.image && (
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow">{svc.title}</h3>
                  <p className="text-white/80 text-sm">
                    Professional {svc.title.toLowerCase()} in {area.name}
                  </p>
                </div>
              </div>

              {/* body */}
              <div className="p-5">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {svc.blurb} Our professional team uses advanced equipment and eco-friendly
                  solutions to deliver outstanding results for {area.name} residents and businesses.
                </p>

                {/* trust badges */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-700">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" /> 5.0 rating
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" /> 200+ happy customers
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Zap className="w-4 h-4 text-orange-500" /> Same-day available
                  </span>
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <ShieldCheck className="w-4 h-4" /> 100% Satisfaction Guarantee
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-5 flex justify-end">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-[#F79029] text-white font-semibold px-4 py-2 hover:bg-[#e27f17] shadow"
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
        <AreaInsightsAndCoverage area={parent || area} brandShort="Arcturus" />
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
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F79029] text-white rounded-2xl shadow-lg p-10 text-center ring-1 ring-orange-200">
            <h2 className="text-3xl font-bold mb-6">Ready to Book Your {area.name} Cleaning Service?</h2>
            <p className="mb-6 text-lg">Get your free, no-obligation quote today. Our {area.name} cleaning experts are standing by.</p>
            <a href="/contact" className="bg-white text-[#F79029] font-semibold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition">
              Get Free Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AreaDetailPage;