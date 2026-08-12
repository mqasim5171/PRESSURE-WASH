// src/components/sections/Areas.jsx
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';
import Glow from '../Glow';
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
    <Section id="areas" className="relative overflow-hidden bg-[#03070d] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[460px] h-[460px] -top-40 -right-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Coverage</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">{areas.title}</h2>
          <p className="text-white/60 mt-4 text-lg">{areas.sub}</p>
        </div>

        {/* Featured Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {areas.featured.map((area, index) => (
            <Link
              key={index}
              to={`/areas/${slugify(area.name)}`}
              className="group block bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl p-7 border border-white/10 hover:border-[#22d3ee]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#22d3ee]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase">{area.postcode}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{area.name}</h3>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">{area.tagline}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#22d3ee] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        {showCTA && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-14">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-white mb-1">Don't see your area listed?</h3>
              <p className="text-white/50 text-sm">We serve all Sydney suburbs — contact us to confirm availability.</p>
            </div>
            <Link
              to="/areas"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition"
            >
              {areas.cta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Coverage chips */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white">Complete Sydney Coverage</h3>
          <p className="text-white/50 max-w-2xl mx-auto mt-2 text-sm">
            From the Eastern Beaches to the Western Suburbs, we provide professional cleaning services across greater Sydney.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Eastern Suburbs","Northern Beaches","North Shore","Inner West","South Sydney",
            "Western Sydney","Hills District","Canterbury-Bankstown","Sutherland Shire",
            "Blacktown","Parramatta","Liverpool",
          ].map((region, index) => (
            <Link
              key={index}
              to={`/areas/${slugify(region)}`}
              className="rounded-full px-4 py-2 text-sm text-white/60 border border-white/10 hover:border-[#22d3ee]/50 hover:text-[#22d3ee] transition"
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
