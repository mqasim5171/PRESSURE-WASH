// src/pages/Areas.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { copy } from "../lib/copy";
import { MapPin, Phone, Shield, Clock, Star, CheckCircle } from "lucide-react";

const slugify = (str) =>
  String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const StatCard = ({ icon: Icon, title, sub, tone }) => (
  <div className="bg-white p-6 rounded-xl text-center shadow-sm ring-1 ring-slate-100">
    {Icon && <Icon className={`w-8 h-8 mx-auto mb-3 text-${tone}-600`} />}
    <div className="font-bold text-slate-900">{title}</div>
    <div className="text-sm text-slate-600">{sub}</div>
  </div>
);

/* Button-like list item */
const AreaListItem = ({ name, note }) => (
  <li>
    <Link
      to={`/areas/${slugify(name)}`}
      onClick={(e) => e.stopPropagation()}
      className="group block rounded-xl bg-white ring-1 ring-slate-200/70 px-4 py-3 shadow-[0_0_0_rgba(0,0,0,0)]
                 hover:shadow-md hover:ring-slate-300 hover:bg-slate-50 transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D2B6F] focus-visible:ring-offset-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900 group-hover:text-[#1D2B6F]">
            {name}
          </div>
          {note && <div className="text-sm text-slate-500 mt-0.5">{note}</div>}
        </div>
        <div className="shrink-0 inline-flex items-center justify-center rounded-full bg-slate-100/80
                        text-slate-500 group-hover:text-[#1D2B6F] group-hover:bg-[#EAF2FF] h-6 w-6">
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
    <div className="rounded-2xl p-6 bg-slate-50 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
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
    <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold mb-1">Check Service Availability</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Get in touch to confirm service in your area and receive a free quote
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={onChange}
              placeholder="Enter your full name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={onChange}
              placeholder="0414 203 262"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
              placeholder="your.email@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Suburb *</label>
            <input
              type="text"
              name="suburb"
              required
              value={form.suburb}
              onChange={onChange}
              placeholder="Enter your suburb"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Required *</label>
            <select
              name="service"
              required
              value={form.service}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F79029]"
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
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            >
              <option value="">Select property type</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Townhouse</option>
              <option>Commercial</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
            <select
              name="contactMethod"
              value={form.contactMethod}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            >
              <option value="">How would you like us to contact you?</option>
              <option>Phone</option>
              <option>SMS</option>
              <option>Email</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Additional Information</label>
            <textarea
              name="notes"
              rows="4"
              value={form.notes}
              onChange={onChange}
              placeholder="Tell us about your requirements, property size, or any special instructions..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F79029]"
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={form.consent}
              onChange={onChange}
              className="mr-2"
            />
            <label htmlFor="consent" className="text-sm">
              I agree to be contacted for this quote
            </label>
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
        <div className="flex items-center justify-center gap-3">
          <a
            href="tel:0414203262"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-[#1D2B6F] text-white font-semibold"
          >
            <Phone className="w-4 h-4" /> 0414 203 262
          </a>
          <a
            href="mailto:info@example.com"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-100 text-gray-800 font-semibold"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};


const AreasPage = () => {
  const areas = copy.areas?.featured || [];
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
  }, [areas]);

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="bg-slate-50 pt-16 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Service Areas</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We proudly provide pressure washing and exterior cleaning services across Sydney and surrounding suburbs.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-6 pb-10">
          <StatCard icon={Clock} title="Same Day" sub="Service Available" tone="blue" />
          <StatCard icon={Shield} title="Fully Insured" sub="$10M Coverage" tone="green" />
          <StatCard icon={Star} title="5-Star Rated" sub="247+ Reviews" tone="yellow" />
          <div className="bg-white p-6 rounded-xl text-center shadow-sm ring-1 ring-slate-100">
            <div className="text-2xl font-bold text-purple-600 mb-3">100%</div>
            <div className="font-bold text-slate-900">Satisfaction</div>
            <div className="text-sm text-slate-600">Guaranteed</div>
          </div>
        </div>
      </section>

      {/* Area groups */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 pb-12 grid md:grid-cols-3 gap-6">
          {ordered.map((area) => (
            <AreaGroupCard key={area.slug} area={area} />
          ))}
        </div>
      </section>

      {/* Availability */}
      <section className="bg-[#EAF2FF] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Don't See Your Area Listed?</h2>
              <p className="text-slate-600">We're always expanding our service areas. Contact us to check if we service your location.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 ring-1 ring-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Contact Options</h3>
              <a href="tel:0414203262" className="inline-flex items-center gap-2 w-full justify-center rounded-lg py-3 bg-[#F79029] text-white font-semibold">
                <Phone className="w-5 h-5" /> Call 0280 001 080
              </a>
              <div className="mt-4 text-sm">
                <div className="font-semibold text-slate-900 mb-2">Business Hours:</div>
                <div className="text-slate-600">Monday – Friday: 7:00 AM – 6:00 PM</div>
                <div className="text-slate-600">Saturday: 8:00 AM – 4:00 PM</div>
                <div className="text-slate-600">Sunday: Emergency calls only</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 ring-1 ring-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3">Service Guarantee</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  "Same-day service available",
                  "Free quotes and consultations",
                  "100% satisfaction guarantee",
                  "Fully licensed and insured",
                  "Eco-friendly cleaning solutions",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
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
  );
};

export default AreasPage;