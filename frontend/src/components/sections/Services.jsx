import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Home, Square, Droplets } from 'lucide-react';
import Section from '../ui/Section';
import { copy } from '../../lib/copy';

const iconMap = {
  Sun: Sun,
  Home: Home, 
  Square: Square,
  Droplets: Droplets
};

const Services = () => {
  const { servicesIntro, services } = copy;

  return (
    <Section id="services" className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {servicesIntro.title}
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          {servicesIntro.sub}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon];
          
          return (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <IconComponent className="w-8 h-8 text-blue-600" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.blurb}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.bullets.slice(0, 2).map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Learn More */}
                <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Need Multiple Services?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Save time and money with our comprehensive cleaning packages. We can handle all your property maintenance needs in one visit.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Custom Package Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default Services;