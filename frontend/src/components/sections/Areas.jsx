// src/components/sections/Areas.jsx
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/button';
import { copy } from '../../lib/copy';
import { Link } from 'react-router-dom';

// ✅ Slugify helper (same as AreasPage.jsx)
const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Areas = ({ showCTA = true }) => {
  const { areas } = copy;

  return (
    <Section id="areas" className="bg-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {areas.title}
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          {areas.sub}
        </p>
      </div>

      {/* ✅ Featured Area Cards (Clickable) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {areas.featured.map((area, index) => (
          <Link
            key={index}
            to={`/areas/${slugify(area.name)}`}
            className="block bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors duration-300 border border-slate-100 hover:border-blue-200"
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
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ CTA */}
      {showCTA && (
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-900 text-white p-8 rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2">
                Don't see your area listed?
              </h3>
              <p className="text-slate-300">
                We serve all Sydney suburbs. Contact us to confirm availability in your area.
              </p>
            </div>
            <Link to="/Areas">
              <Button 
                variant="secondary" 
                size="lg"
                className="whitespace-nowrap"
              >
                {areas.cta.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ✅ Service Coverage Map (Clickable Buttons) */}
      <div className="mt-16 bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Complete Sydney Coverage
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From the Eastern Beaches to the Western Suburbs, we provide professional cleaning services across greater Sydney.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
          {[
            "Eastern Suburbs",
            "Northern Beaches", 
            "North Shore",
            "Inner West",
            "South Sydney",
            "Western Sydney",
            "Hills District",
            "Canterbury-Bankstown",
            "Sutherland Shire",
            "Blacktown",
            "Parramatta",
            "Liverpool"
          ].map((region, index) => (
            <Link
              key={index}
              to={`/areas/${slugify(region)}`}
              className="block bg-white rounded-lg p-4 text-sm font-medium text-slate-700 
                         hover:bg-blue-100 hover:text-blue-700 transition shadow-sm border border-slate-200"
            >
              {region}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Areas;
