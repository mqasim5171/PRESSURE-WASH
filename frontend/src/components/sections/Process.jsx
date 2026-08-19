import React from 'react';
import { Shield, Clock, CheckCircle, Star } from 'lucide-react';
import Section from '../ui/Section';
import Glow from '../Glow';
import { copy } from '../../lib/copy';

const iconMap = { Shield, Clock, CheckCircle, Star };

const Process = () => {
  const { process } = copy;

  return (
    <Section className="relative overflow-hidden bg-[#050910] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[480px] h-[480px] -top-40 -left-40" />
      <div className="relative">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Credentials</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            {process.title}
          </h2>
          <p className="text-white/60 mt-4 text-lg">{process.subtitle}</p>
        </div>

        {/* Large-number stat rows */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-t border-white/10">
          {process.cards.map((card, index) => {
            const IconComponent = iconMap[card.icon];
            return (
              <div key={index} className="py-8 lg:py-2 lg:px-8 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl md:text-5xl font-extrabold text-white/15 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <IconComponent className="w-5 h-5 text-[#22d3ee]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default Process;
