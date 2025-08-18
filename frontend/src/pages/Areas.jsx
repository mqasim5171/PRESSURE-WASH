import React from 'react';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import CTA from '../components/sections/CTA';
import { copy, biz } from '../lib/copy';

const AreasPage = () => {
  const { areas } = copy;

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {areas.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {areas.sub}
          </p>
        </div>

        {/* Featured Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.featured.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {area.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {area.blurb}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Same-day service available</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* All Suburbs */}
      <Section className="bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Complete Sydney Coverage
          </h2>
          <p className="text-xl text-slate-600">
            We proudly serve customers across all Sydney suburbs
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            All Service Areas
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
            {biz.serviceAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                {area}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 mb-6">
              Don't see your suburb? We likely serve your area too! Contact us to confirm availability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact">
                Get Quote for Your Area
              </Button>
              <Button variant="outline" href="tel:0414203262">
                <Phone className="w-4 h-4 mr-2" />
                Call to Confirm Service
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Service Promise by Area */}
      <Section className="bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Local Service Promise
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            No matter which Sydney suburb you're in, you get the same high-quality service and guarantee
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Same-Day Service
            </h3>
            <p className="text-slate-600">
              Available across most Sydney suburbs when you call before 2 PM. Emergency and urgent cleaning requests welcome.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-green-600">★</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Consistent Quality
            </h3>
            <p className="text-slate-600">
              The same 5-star service and professional standards whether you're in Bondi or Blacktown.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Local Knowledge
            </h3>
            <p className="text-slate-600">
              We understand the unique cleaning challenges in different Sydney areas - from coastal salt to city pollution.
            </p>
          </div>
        </div>
      </Section>

      <CTA />
    </main>
  );
};

export default AreasPage;