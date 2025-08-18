import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { copy } from '../lib/copy';
import { biz } from '../lib/config';
import { mockQuotes } from '../mock/mockData';

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
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message || !formData.consent) {
      alert('Please fill in all required fields and accept the consent.');
      return;
    }

    setStatus('loading');

    try {
      // Mock submission - in real app this would be API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Add to mock data (for development)
      const newQuote = {
        id: mockQuotes.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        suburb: formData.suburb,
        message: formData.message,
        contactPreference: formData.contactPreference,
        propertyType: formData.propertyType,
        status: 'new',
        createdAt: new Date().toISOString()
      };
      
      mockQuotes.push(newQuote);
      console.log('Quote submitted:', newQuote);

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

      // Auto-hide success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {copy.contact.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {copy.contact.sub}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="0412 345 678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Suburb
                    </label>
                    <input
                      type="text"
                      name="suburb"
                      value={formData.suburb}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Bondi, Manly, Chatswood"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Service Required
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="Call"
                        checked={formData.contactPreference === 'Call'}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Phone Call</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="Email"
                        checked={formData.contactPreference === 'Email'}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="SMS"
                        checked={formData.contactPreference === 'SMS'}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">SMS</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tell us about your cleaning needs *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Please describe what needs cleaning, property size, any special requirements, and your preferred timeframe..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    id="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    required
                    className="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label htmlFor="consent" className="text-sm text-slate-600">
                    {copy.contact.consent}
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === 'loading'}
                  className="w-full"
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
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800">{copy.contact.success}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{copy.contact.error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Get Instant Response
              </h3>
              
              <div className="space-y-6">
                <a 
                  href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Call Now
                    </div>
                    <div className="text-blue-600">{biz.phone}</div>
                  </div>
                </a>

                <a 
                  href={`mailto:${biz.email}`}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                      Email Us
                    </div>
                    <div className="text-slate-600 text-sm">{biz.email}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Business Hours
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-slate-900">{biz.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">{biz.address}</span>
                </div>
                <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg">
                  <strong>Emergency Note:</strong><br />
                  {copy.contact.emergencyNote}
                </div>
              </div>
            </div>

            {/* Service Promise */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                Our Promise to You
              </h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Response within 2 hours
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Same-day service available
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  100% satisfaction guarantee
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Fully licensed & insured
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default Contact;