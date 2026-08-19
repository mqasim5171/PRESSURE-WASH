import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Section from '../ui/Section';
import Glow from '../Glow';
import { copy } from '../../lib/copy';
import { useCms } from '../../lib/useCms';

const FAQ = () => {
  const { faq } = copy;
  const { data: apiFaqs } = useCms("/api/faqs", null);
  const items = apiFaqs?.length ? apiFaqs.map((f) => ({ q: f.question, a: f.answer })) : faq.items;
  const [openItem, setOpenItem] = useState(0);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Section className="relative overflow-hidden bg-[#03070d] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[400px] h-[400px] -top-32 left-1/2 -translate-x-1/2" />
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">FAQ</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            {faq.title}
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {items.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-6 text-left flex items-center justify-between gap-4 group"
              >
                <span className="font-semibold text-white group-hover:text-[#22d3ee] transition-colors">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 transition-transform duration-200 flex-shrink-0 ${
                    openItem === index ? 'rotate-180 text-[#22d3ee]' : ''
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openItem === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-white/55 leading-relaxed pb-6 pr-8">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Still have questions?</h3>
            <p className="text-white/50 text-sm mt-1">Our team is here to help, same-day where possible.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:0280001080"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-full hover:border-white/50 transition-colors whitespace-nowrap"
            >
              Call 02 8000 1080
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#22d3ee] text-black text-sm font-semibold rounded-full hover:bg-white transition-colors whitespace-nowrap"
            >
              Send a Message
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FAQ;
