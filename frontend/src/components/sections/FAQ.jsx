import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Section from '../ui/Section';
import { copy } from '../../lib/copy';

const FAQ = () => {
  const { faq } = copy;
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  if (!faq.items || faq.items.length === 0) {
    return null;
  }

  return (
    <Section className="bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {faq.title}
          </h2>
          <p className="text-xl text-slate-600">
            Got questions? We've got answers. Here are the most common questions about our services.
          </p>
        </div>

        <div className="space-y-4">
          {faq.items.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 pr-4">
                  {item.q}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                    openItem === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`transition-all duration-200 ease-in-out overflow-hidden ${
                openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <p className="text-slate-600 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-blue-100 mb-6">
              Our friendly team is here to help. Call us now for instant answers and same-day service availability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0414203262"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Call 0414 203 262
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Send a Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FAQ;