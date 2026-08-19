import React, { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { submitLead } from "../../lib/submitLead";

const SERVICE_OPTIONS = [
  "Solar Panel Cleaning & Thermal Scan",
  "Roof Cleaning",
  "Concrete Cleaning",
  "Other",
];

const inputCls =
  "w-full px-3 py-1.5 bg-white/[0.07] border border-white/20 rounded-lg text-white text-sm placeholder:text-white/35 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none transition-all";
const labelCls = "block text-[11px] font-semibold text-white/70 mb-1";

const initialState = { name: "", phone: "", email: "", suburb: "", service: "", consent: false };

/**
 * HeroLeadForm
 * -------------
 * Compact quote form for Hero Slide 1. Submits through lib/submitLead.js -
 * the same helper every form on the site uses - so every lead lands in
 * Admin > Leads regardless of where it came from.
 */
export default function HeroLeadForm({ onInteractionStart, onInteractionEnd }) {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState(null); // null | loading | success | error
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Required";
    if (!formData.phone.trim()) next.phone = "Required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Valid email required";
    if (!formData.consent) next.consent = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      await submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        suburb: formData.suburb,
        service: formData.service,
        message: `Hero quote form enquiry${formData.service ? ` - ${formData.service}` : ""}`,
        sourcePage: "Homepage Hero",
      });
      setStatus("success");
      setFormData(initialState);
      setTimeout(() => setStatus(null), 6000);
    } catch (err) {
      console.error("Hero lead form submission failed:", err);
      setStatus("error");
      setTimeout(() => setStatus(null), 6000);
    }
  };

  return (
    <div
      className="w-full max-w-[320px] rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 p-4 shadow-2xl"
      onFocus={onInteractionStart}
      onBlur={onInteractionEnd}
      onMouseEnter={onInteractionStart}
      onMouseLeave={onInteractionEnd}
    >
      <h3 className="text-lg font-bold text-white">Get Your Free Quote</h3>
      <p className="text-white/60 text-xs mt-1">Tell us what you need and we'll get back to you.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-3 space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="hero-name" className={labelCls}>Name</label>
            <input
              id="hero-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className={inputCls}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="hero-phone" className={labelCls}>Phone</label>
            <input
              id="hero-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0412 345 678"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              className={inputCls}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="hero-email" className={labelCls}>Email</label>
          <input
            id="hero-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={inputCls}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="hero-suburb" className={labelCls}>Suburb / Postcode</label>
          <input
            id="hero-suburb"
            name="suburb"
            type="text"
            value={formData.suburb}
            onChange={handleChange}
            placeholder="e.g. Bondi, 2026"
            autoComplete="postal-code"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="hero-service" className={labelCls}>Service</label>
          <select
            id="hero-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
          >
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-2">
          <input
            id="hero-consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleChange}
            aria-invalid={!!errors.consent}
            className="mt-0.5 text-[#22d3ee] focus:ring-[#22d3ee] rounded"
          />
          <label htmlFor="hero-consent" className="text-xs text-white/50 leading-snug">
            I agree to be contacted about my enquiry via phone, email or SMS.
          </label>
        </div>
        {errors.consent && <p className="text-red-400 text-xs -mt-2">{errors.consent}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#22d3ee] text-black font-bold text-sm uppercase tracking-wide py-2 rounded-full hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Sending...
            </span>
          ) : (
            "Get My Free Quote"
          )}
        </button>

        <p className="text-center text-white/40 text-[11px]">Fast response • No-obligation quote</p>

        {status === "success" && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Thanks! We've received your request and will be in touch shortly.
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Something went wrong. Please call us directly on 02 8000 1080.
          </div>
        )}
      </form>
    </div>
  );
}
