import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { copy } from '../lib/copy';

const inputCls =
  "w-full px-4 py-3 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none transition-all";
const labelCls = "block text-sm font-semibold text-white/80 mb-2";

const QuoteModal = ({ isOpen, onClose }) => {
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

  const [status, setStatus] = useState(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen) {
      const focusableElements = document.querySelectorAll(
        '#quote-modal input, #quote-modal select, #quote-modal textarea, #quote-modal button'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

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
      // ✅ Call FastAPI backend instead of mockQuotes
      const res = await fetch("https://pressure-wash.onrender.com/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus('success');

      // Reset form and close modal after success
      setTimeout(() => {
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
        setStatus(null);
        onClose();
      }, 2000);

    } catch (error) {
      console.error("Error submitting:", error);
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          id="quote-modal"
          className="relative bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">Get Free Quote</h2>
              <p className="text-white/50">Tell us about your cleaning needs</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="modal-name" className={labelCls}>
                    Name *
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className={labelCls}>
                    Phone *
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="0412 345 678"
                  />
                </div>

                <div>
                  <label htmlFor="modal-email" className={labelCls}>
                    Email *
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="modal-suburb" className={labelCls}>
                    Suburb
                  </label>
                  <input
                    id="modal-suburb"
                    type="text"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="e.g. Bondi, Manly, Chatswood"
                  />
                </div>

                <div>
                  <label htmlFor="modal-service" className={labelCls}>
                    Select a service
                  </label>
                  <select
                    id="modal-service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className={`${inputCls} [&>option]:bg-[#0a0f1a]`}
                  >
                    <option value="">Select a service</option>
                    {copy.services.map((service) => (
                      <option key={service.slug} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-property" className={labelCls}>
                    Select property type
                  </label>
                  <select
                    id="modal-property"
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

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">
                  How would you like us to contact you?
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="Call"
                      checked={formData.contactPreference === 'Call'}
                      onChange={handleInputChange}
                      className="text-[#22d3ee] focus:ring-[#22d3ee]"
                    />
                    <span className="text-sm text-white/70">Call</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="Email"
                      checked={formData.contactPreference === 'Email'}
                      onChange={handleInputChange}
                      className="text-[#22d3ee] focus:ring-[#22d3ee]"
                    />
                    <span className="text-sm text-white/70">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="SMS"
                      checked={formData.contactPreference === 'SMS'}
                      onChange={handleInputChange}
                      className="text-[#22d3ee] focus:ring-[#22d3ee]"
                    />
                    <span className="text-sm text-white/70">SMS</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="modal-message" className={labelCls}>
                  Message *
                </label>
                <textarea
                  id="modal-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder="Please describe what needs cleaning, property size, any special requirements..."
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="modal-consent"
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  className="mt-1 text-[#22d3ee] focus:ring-[#22d3ee] rounded"
                />
                <label htmlFor="modal-consent" className="text-sm text-white/60">
                  I agree to be contacted about my enquiry.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#22d3ee] text-black font-bold py-4 rounded-full hover:bg-white focus:ring-2 focus:ring-[#22d3ee] focus:ring-offset-2 focus:ring-offset-[#0a0f1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                    Sending Request...
                  </>
                ) : (
                  'Get Free Quote'
                )}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-300">Thanks! We've received your request and will contact you within 2 hours during business hours.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300">Something went wrong. Please try again or call us directly on 0414 203 262.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
