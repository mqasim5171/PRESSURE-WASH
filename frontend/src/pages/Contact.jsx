import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/button';
import { copy } from '../lib/copy';
import { biz } from '../lib/config';

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
      const res = await fetch("https://your-service.onrender.com/api/submit-quote", {
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
    <main className="pt-28 bg-white"> {/* Padding top to avoid header overlap */}
      {/* Hero Section */}
      <Section className="bg-slate-50 pt-12 pb-12 rounded-b-3xl shadow-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#314085] mb-4">
            {copy.contact.title}
          </h1>
          <p className="text-xl text-[#314085]/80 max-w-3xl mx-auto">
            {copy.contact.sub}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#314085] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-[#314085] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="0412 345 678"
                      className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[#314085] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all"
                    />
                  </div>

                  {/* Suburb */}
                  <div>
                    <label className="block text-sm font-semibold text-[#314085] mb-2">
                      Suburb
                    </label>
                    <input
                      type="text"
                      name="suburb"
                      value={formData.suburb}
                      onChange={handleInputChange}
                      placeholder="e.g. Bondi, Manly, Chatswood"
                      className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-semibold text-[#314085] mb-2">
                      Service Required
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all"
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
                    <label className="block text-sm font-semibold text-[#314085] mb-2">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                </div>

                {/* Contact Preference */}
                <div>
                  <label className="block text-sm font-semibold text-[#314085] mb-3">
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
                          className="text-[#314085] focus:ring-[#314085]"
                        />
                        <span className="text-sm text-[#314085]">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-[#314085] mb-2">
                    Tell us about your cleaning needs *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Please describe what needs cleaning..."
                    className="w-full px-4 py-3 border border-[#314085]/40 rounded-lg focus:ring-2 focus:ring-[#314085] outline-none transition-all resize-none"
                  />
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
                    className="mt-1 text-[#314085] focus:ring-[#314085] rounded"
                  />
                  <label htmlFor="consent" className="text-sm text-[#314085]/80">
                    {copy.contact.consent}
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === 'loading'}
                  className="w-full bg-[#F79029] hover:bg-[#d76f0f] text-white"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    'Get My Free Quote'
                  )}
                </Button>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <p>{copy.contact.success}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <p>{copy.contact.error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Call / Email */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-[#314085] mb-6">
                Get Instant Response
              </h3>
              <div className="space-y-6">
                <a 
                  href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-4 bg-[#314085]/10 rounded-lg hover:bg-[#314085]/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#314085] rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#314085]">Call Now</div>
                    <div className="text-[#314085]">{biz.phone}</div>
                  </div>
                </a>

                <a 
                  href={`mailto:${biz.email}`}
                  className="flex items-center gap-4 p-4 bg-[#44B149]/10 rounded-lg hover:bg-[#44B149]/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#44B149] rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#314085]">Email Us</div>
                    <div className="text-[#314085]/80 text-sm">{biz.email}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-[#314085] mb-6">Business Hours</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#314085]" />
                  <span className="font-semibold text-[#314085]">{biz.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#314085]" />
                  <span className="text-[#314085]/80">{biz.address}</span>
                </div>
                <div className="text-sm text-[#314085]/70 bg-[#E1E5F5] p-4 rounded-lg">
                  <strong>Emergency Note:</strong><br />
                  {copy.contact.emergencyNote}
                </div>
              </div>
            </div>

            {/* Service Promise */}
            <div className="bg-gradient-to-br from-[#314085] to-[#44B149] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Our Promise to You</h3>
              <ul className="space-y-3 text-white/90">
                {['Response within 2 hours', 'Same-day service available', '100% satisfaction guarantee', 'Fully licensed & insured'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default Contact;
