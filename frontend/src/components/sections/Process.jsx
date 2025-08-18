import React from 'react';
import { Shield, Clock, CheckCircle, Star } from 'lucide-react';
import Section from '../ui/Section';
import { copy } from '../../lib/copy';

const iconMap = {
  Shield: Shield,
  Clock: Clock,
  CheckCircle: CheckCircle,
  Star: Star
};

const Process = () => {
  const { process } = copy;

  return (
    <Section className="bg-slate-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {process.title}
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          {process.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {process.cards.map((card, index) => {
          const IconComponent = iconMap[card.icon];
          
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100"
            >
              {/* Number Badge */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {card.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {card.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Trust Indicators */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">$10M</div>
          <div className="text-sm text-slate-600">Insurance Coverage</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">247+</div>
          <div className="text-sm text-slate-600">5-Star Reviews</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">1000+</div>
          <div className="text-sm text-slate-600">Happy Customers</div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">7</div>
          <div className="text-sm text-slate-600">Days a Week</div>
        </div>
      </div>
    </Section>
  );
};

export default Process;