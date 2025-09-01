import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Home, Square, Droplets, Drone } from 'lucide-react';
import Section from '../ui/Section';
import { copy } from '../../lib/copy';

const iconMap = {
  Sun: Sun,
  Home: Home,
  Square: Square,
  Droplets: Droplets,
  Drone: Drone,
};

const Services = () => {
  const { servicesIntro, services } = copy;

  return (
    <Section id="services" className="bg-gray-50">
      {/* Intro */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#314085] mb-4">
          {servicesIntro.title}
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          {servicesIntro.sub}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon];
          const isComingSoon = service.slug === "drone-based-washing";

          return (
            <Link
              key={service.slug}
              to={isComingSoon ? "#" : `/services/${service.slug}`}
              className={`group bg-white rounded-2xl p-0 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 relative overflow-hidden ${
                isComingSoon ? "pointer-events-none" : ""
              }`}
            >
              {/* Service Image */}
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#f79029]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#f79029]/30 transition-colors">
                  {IconComponent && (
                    <IconComponent className="w-8 h-8 text-[#f79029]" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#314085] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.blurb}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2">
                    {service.bullets.slice(0, 2).map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <div className="w-1.5 h-1.5 bg-[#44B149] rounded-full flex-shrink-0"></div>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Learn More CTA */}
                  <div className="pt-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#44B149] text-white rounded-lg font-medium hover:bg-[#314085] transition">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Coming Soon Overlay - only for drone service */}
              {isComingSoon && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <span className="px-6 py-2 text-lg font-bold text-white bg-gradient-to-r from-[#f79029] to-[#44B149] rounded-full shadow-lg tracking-wide animate-pulse">
                    Coming Soon
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <div className="bg-gradient-to-r from-[#44B149] via-[#f79029] to-[#314085] rounded-2xl p-[2px] shadow-lg">
          <div className="bg-white rounded-2xl p-10">
            <h3 className="text-2xl font-bold text-[#314085] mb-4">
              Need Multiple Services?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Save time and money with our comprehensive cleaning packages. We can handle all your property maintenance needs in one visit.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#f79029] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#314085] transition-colors"
            >
              Get Custom Package Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
