import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Section from '../components/ui/Section';
import Glow from '../components/Glow';
import { copy } from '../lib/copy';
import { biz } from '../lib/config';
import Meta from '../Meta';

const inputCls =
  "w-full px-4 py-3 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none transition-all";
const labelCls = "block text-sm font-semibold text-white/80 mb-2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    service: '',
    propertyType: 'Residential',
    contactPreference: 'Call',
    message: '',
    consent: false
  });

  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message || !formData.consent) {
      alert('Please fill in all required fields and accept the consent.');
      return;
    }

    setStatus('loading');

    try {
      // ✅ send to FastAPI (same as QuoteModal)
      const res = await fetch("https://pressure-wash.onrender.com/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus('success');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        suburb: '',
        service: '',
        propertyType: 'Residential',
        contactPreference: 'Call',
        message: '',
        consent: false
      });

      setTimeout(() => setStatus(null), 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <>
      <Meta title="Contact Arcturus Services | Free Quote Sydney" desc="Get a free quote for pressure washing, solar, roof & gutter, and window cleaning. Call 0414 203 262." path="/contact" />
      <main className="pt-28 bg-[#02060c]">
        {/* Hero Section */}
        <Section className="relative overflow-hidden pt-12 pb-20">
          <Glow color="#22d3ee" className="w-[500px] h-[500px] -top-40 -right-40" />
          <div className="relative text-center mb-12">
            <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Contact</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white mb-4">
              {copy.contact.title}
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              {copy.contact.sub}
            </p>
          </div>

          <div className="relative grid lg:grid-cols-3 gap-6">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className={inputCls} />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="02 8000 1080"
                        className={inputCls} />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        className={inputCls} />
                    </div>

                    {/* Suburb */}
                    <div>
                      <label className={labelCls}>Suburb</label>
                      <input
                        type="text"
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleInputChange}
                        placeholder="e.g. Bondi, Manly, Chatswood"
                        className={inputCls} />
                    </div>

                    {/* Service */}
                    <div>
                      <label className={labelCls}>Service Required</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
                      >
                        <option value="">Select a service</option>
                        {copy.services.map(service => (
                          <option key={service.slug} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className={labelCls}>Property Type</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Preference */}
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-6">
                      {['Call', 'Email', 'SMS'].map(option => (
                        <label key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="contactPreference"
                            value={option}
                            checked={formData.contactPreference === option}
                            onChange={handleInputChange}
                            className="text-[#22d3ee] focus:ring-[#22d3ee]" />
                          <span className="text-sm text-white/70">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelCls}>Tell us about your cleaning needs *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Please describe what needs cleaning..."
                      className={`${inputCls} resize-none`} />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      id="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      required
                      className="mt-1 text-[#22d3ee] focus:ring-[#22d3ee] rounded" />
                    <label htmlFor="consent" className="text-sm text-white/60">
                      {copy.contact.consent}
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#22d3ee] text-black font-bold py-4 rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                        Sending Request...
                      </>
                    ) : (
                      'Get My Free Quote'
                    )}
                  </button>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300">
                      <CheckCircle className="w-5 h-5" />
                      <p>{copy.contact.success}</p>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                      <p>{copy.contact.error}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {/* Call / Email */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Get Instant Response
                </h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-4 p-4 bg-white/[0.04] rounded-xl hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#22d3ee]/15 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#22d3ee]" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Call Now</div>
                      <div className="text-white/60">{biz.phone}</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${biz.email}`}
                    className="flex items-center gap-4 p-4 bg-white/[0.04] rounded-xl hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#f79029]/15 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#f79029]" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Email Us</div>
                      <div className="text-white/60 text-sm">{biz.email}</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Business Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#22d3ee]" />
                    <span className="font-semibold text-white">{biz.hours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#22d3ee]" />
                    <span className="text-white/60">{biz.address}</span>
                  </div>
                  <div className="text-sm text-white/50 bg-white/[0.04] border border-white/10 p-4 rounded-lg">
                    <strong className="text-white/80">Emergency Note:</strong><br />
                    {copy.contact.emergencyNote}
                  </div>
                </div>
              </div>

              {/* Service Promise */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Our Promise to You</h3>
                <ul className="space-y-3 text-white/70">
                  {['Response within 2 hours', 'Same-day service available', '100% satisfaction guarantee', 'Fully licensed & insured'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#22d3ee] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Contact;
