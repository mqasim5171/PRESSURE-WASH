import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Shield, Star, Users, CheckCircle } from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/Button';
import { copy } from '../../lib/copy';

const Hero = () => {
  const { hero } = copy;

  return (
    <Section id="hero" className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-8 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            {hero.eyebrow}
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {hero.headline}{' '}
              <span className="text-blue-600 relative">
                {hero.headlineStrong}
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-cyan-200 opacity-30 rounded-lg"></div>
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              {hero.sub}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {hero.badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-slate-700">{badge}</span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {hero.metrics.map((metric, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border text-center">
                <div className="text-sm text-slate-500 mb-1">{metric.label}</div>
                <div className="font-bold text-blue-600">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" href={hero.ctaPrimary.href}>
              {hero.ctaPrimary.label}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              href={hero.ctaSecondary.href}
              className="group"
            >
              <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              {hero.ctaSecondary.label}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">5.0 Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>1000+ Customers</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-300">
            <img 
              src={hero.image.src}
              alt={hero.image.alt}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Same-Day Available</div>
                <div className="text-sm text-slate-600">Call before 2 PM</div>
              </div>
            </div>
          </div>

          {/* Floating Review */}
          <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border max-w-xs">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 mb-2">
              "Professional service, amazing results!"
            </p>
            <div className="text-xs text-slate-500">- Sarah M., Bondi</div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;