// src/pages/Areas.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { copy } from "../lib/copy";
import { MapPin, Phone, Shield, Clock, Star, CheckCircle } from "lucide-react";
import Glow from "../components/Glow";
import Meta from '../Meta';
import { submitLead } from '../lib/submitLead';
import { useCms } from '../lib/useCms';
import { mapArea } from '../lib/cmsAdapters';

const slugify = (str) =>
  String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const inputCls =
  "w-full rounded-lg bg-white/[0.04] border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]";

const StatCard = ({ icon: Icon, title, sub }) => (
  <div className="bg-white/[0.04] p-6 rounded-xl text-center border border-white/10">
    {Icon && <Icon className="w-8 h-8 mx-auto mb-3 text-[#22d3ee]" />}
    <div className="font-bold text-white">{title}</div>
    <div className="text-sm text-white/50">{sub}</div>
  </div>
);

/* Button-like list item */
const AreaListItem = ({ name, note }) => (
  <li>
    <Link
      to={`/areas/${slugify(name)}`}
      onClick={(e) => e.stopPropagation()}
      className="group block rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3
                 hover:bg-white/[0.06] hover:border-[#22d3ee]/30 transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-white group-hover:text-[#22d3ee]">
            {name}
          </div>
          {note && <div className="text-sm text-white/40 mt-0.5">{note}</div>}
        </div>
        <div className="shrink-0 inline-flex items-center justify-center rounded-full bg-white/[0.06]
                        text-white/40 group-hover:text-[#22d3ee] h-6 w-6">
          <MapPin className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  </li>
);

const AreaGroupCard = ({ area }) => {
  const title = area.displayName || area.name;
  const details =
    Array.isArray(area.coverageDetails) && area.coverageDetails.length
      ? area.coverageDetails
      : (area.coverageSuburbs || []).map((n) => ({ name: n, note: "" }));

  return (
    <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ul className="grid gap-3">
        {details.map(({ name, note }) => (
          <AreaListItem key={name} name={name} note={note} />
        ))}
      </ul>
    </div>
  );
};

const AvailabilityForm = ({ services }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    service: "",
    propertyType: "",
    contactMethod: "",
    notes: "",
    consent: true,
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.suburb || !form.service) {
      alert("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    try {
      await submitLead({ ...form, sourcePage: "Service Areas Page" });
      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        suburb: "",
        service: "",
        propertyType: "",
        contactMethod: "",
        notes: "",
        consent: true,
      });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">Check Service Availability</h3>
      <p className="text-white/50 mb-6 text-sm">
        Get in touch to confirm service in your area and receive a free quote
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={onChange}
              placeholder="Enter your full name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Phone Number *</label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={onChange}
              placeholder="0414 203 262"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
              placeholder="your.email@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Suburb *</label>
            <input
              type="text"
              name="suburb"
              required
              value={form.suburb}
              onChange={onChange}
              placeholder="Enter your suburb"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Service Required *</label>
            <select
              name="service"
              required
              value={form.service}
              onChange={onChange}
              className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
            >
              <option value="">Select a service</option>
              {(services || []).map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white/70">Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={onChange}
              className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
            >
              <option value="">Select property type</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Townhouse</option>
              <option>Commercial</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-white/70">Preferred Contact Method</label>
            <select
              name="contactMethod"
              value={form.contactMethod}
              onChange={onChange}
              className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
            >
              <option value="">How would you like us to contact you?</option>
              <option>Phone</option>
              <option>SMS</option>
              <option>Email</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-white/70">Additional Information</label>
            <textarea
              name="notes"
              rows="4"
              value={form.notes}
              onChange={onChange}
              placeholder="Tell us about your requirements, property size, or any special instructions..."
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={form.consent}
              onChange={onChange}
              className="mr-2 text-[#22d3ee] focus:ring-[#22d3ee]"
            />
            <label htmlFor="consent" className="text-sm text-white/60">
              I agree to be contacted for this quote
            </label>
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
        <div className="flex items-center justify-center gap-3">
          <a
            href="tel:0280001080"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#22d3ee] text-black font-semibold hover:bg-white transition-colors"
          >
            <Phone className="w-4 h-4" /> 02 8000 1080
          </a>
          <a
            href="mailto:info@example.com"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-white/20 text-white font-semibold hover:border-white/50 transition-colors"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};


const AreasPage = () => {
  const { data: apiAreas } = useCms("/api/areas", null);
  const areas = apiAreas?.length ? apiAreas.map(mapArea) : (copy.areas?.featured || []);
  const desiredOrder = [
    "eastern-suburbs",
    "northern-beaches",
    "north-shore",
    "inner-west",
    "western-sydney",
    "hills-district",
    "south-sydney",
  ];

  const ordered = useMemo(() => {
    const bySlug = Object.fromEntries(areas.map(a => [a.slug, a]));
    const first = desiredOrder.map(slug => bySlug[slug]).filter(Boolean);
    const rest  = areas.filter(a => !desiredOrder.includes(a.slug));
    return [...first, ...rest];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  return (
    <>
      <Meta title="Service Areas in Sydney | Horizon Solar & Exterior Care" desc="Eastern Suburbs, Northern Beaches, North Shore, Inner West, South Sydney, Western Sydney, Hills District." path="/areas" />
      <main className="pt-24 bg-[#02060c]">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 text-center border-b border-white/5">
          <Glow color="#22d3ee" className="w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2" />
          <div className="relative">
            <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Coverage</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white mb-6">Service Areas</h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed px-6">
              We proudly provide drone-powered solar cleaning and pressure washing across Sydney and surrounding suburbs.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#050910] border-b border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto px-6 py-10">
            <StatCard icon={Clock} title="Same Day" sub="Service Available" />
            <StatCard icon={Shield} title="Fully Insured" sub="$10M Coverage" />
            <StatCard icon={Star} title="5-Star Rated" sub="247+ Reviews" />
            <div className="bg-white/[0.04] p-6 rounded-xl text-center border border-white/10">
              <div className="text-2xl font-bold text-[#22d3ee] mb-3">100%</div>
              <div className="font-bold text-white">Satisfaction</div>
              <div className="text-sm text-white/50">Guaranteed</div>
            </div>
          </div>
        </section>

        {/* Area groups */}
        <section className="bg-[#02060c] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-4">
            {ordered.map((area) => (
              <AreaGroupCard key={area.slug} area={area} />
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className="relative overflow-hidden bg-[#050910] py-16 px-6">
          <Glow color="#f79029" className="w-[420px] h-[420px] bottom-0 -left-32" opacity={0.06} />
          <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Don't See Your Area Listed?</h2>
                <p className="text-white/60">We're always expanding our service areas. Contact us to check if we service your location.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Quick Contact Options</h3>
                <a href="tel:0280001080" className="inline-flex items-center gap-2 w-full justify-center rounded-full py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition-colors">
                  <Phone className="w-5 h-5" /> Call 02 8000 1080
                </a>
                <div className="mt-4 text-sm">
                  <div className="font-semibold text-white mb-2">Business Hours:</div>
                  <div className="text-white/50">Monday – Friday: 7:00 AM – 6:00 PM</div>
                  <div className="text-white/50">Saturday: 8:00 AM – 4:00 PM</div>
                  <div className="text-white/50">Sunday: Emergency calls only</div>
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">Service Guarantee</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  {[
                    "Same-day service available",
                    "Free quotes and consultations",
                    "100% satisfaction guarantee",
                    "Fully licensed and insured",
                    "Eco-friendly cleaning solutions",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#22d3ee] mt-0.5 flex-shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <AvailabilityForm services={copy.services || []} />
          </div>
        </section>
      </main>
    </>
  );
};

export default AreasPage;
