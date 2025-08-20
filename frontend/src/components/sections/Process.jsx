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
    <Section className="bg-gradient-to-b from-[#44B149]/10 to-[#F79029]/10 py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#314085] mb-4">
          {process.title}
        </h2>
        <p className="text-xl text-[#314085]/80 max-w-3xl mx-auto">
          {process.subtitle}
        </p>
      </div>

      {/* Process Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {process.cards.map((card, index) => {
          const IconComponent = iconMap[card.icon];

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-[#F79029]/40"
            >
              {/* Icon Circle */}
              <div className="relative mb-6">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4
                    ${index % 3 === 0 ? 'bg-[#44B149]' : index % 3 === 1 ? 'bg-[#F79029]' : 'bg-[#314085]'}
                  `}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F79029] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-bold text-[#314085] mb-3">{card.title}</h3>
              <p className="text-[#314085]/80 leading-relaxed">{card.text}</p>
            </div>
          );
        })}
      </div>

      
    </Section>
  );
};

export default Process;
