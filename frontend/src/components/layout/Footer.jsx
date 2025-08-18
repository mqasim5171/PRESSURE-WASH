import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { biz } from '../../lib/config';
import { copy } from '../../lib/copy';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">{biz.name}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sydney's most trusted professional cleaning service. Licensed, insured, and committed to exceeding your expectations with every job.
            </p>
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">5.0 Stars • 247+ Reviews</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Our Services</h4>
            <ul className="space-y-2">
              {copy.services.map((service) => (
                <li key={service.slug}>
                  <Link 
                    to={`/services/${service.slug}`}
                    className="text-slate-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href.replace('/#', '/')}
                    className="text-slate-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Info</h4>
            <div className="space-y-3">
              <a 
                href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:text-blue-400" />
                <span className="text-sm">{biz.phone}</span>
              </a>
              <a 
                href={`mailto:${biz.email}`}
                className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:text-blue-400" />
                <span className="text-sm">{biz.email}</span>
              </a>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{biz.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{biz.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <h4 className="font-semibold text-lg mb-4">Service Areas</h4>
          <div className="text-slate-300 text-sm">
            <p className="leading-relaxed">
              Serving all Sydney suburbs including: {biz.serviceAreas.slice(0, 20).join(', ')}, and many more.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} {biz.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <span>ABN: 123 456 789</span>
            <span>Licensed & Insured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;