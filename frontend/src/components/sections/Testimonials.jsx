import React from 'react';
import { Star, Quote } from 'lucide-react';
import Section from '../ui/Section';
import Glow from '../Glow';

const items = [
  {
    name: "Sarah M.",
    location: "Bondi",
    text: "Had my solar panels cleaned by Arcturus Services and couldn't be happier! They increased our energy output by 28% and were incredibly professional throughout.",
  },
  {
    name: "Michael T.",
    location: "Chatswood",
    text: "Absolutely fantastic pressure washing service! My concrete driveway looked terrible after years of stains and weathering. Now it looks brand new.",
  },
  {
    name: "Lisa K.",
    location: "Manly",
    text: "Called Arcturus for an urgent roof and gutter clean before the storm season. They came same-day and potentially saved us from serious water damage.",
  },
];

const Testimonials = () => {
  return (
    <Section className="relative overflow-hidden bg-[#050910] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[420px] h-[420px] top-0 -left-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Reviews</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
              What Sydney Customers Say
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#22d3ee] fill-current" />
            ))}
            <span className="text-white font-semibold ml-1">5.0</span>
            <span className="text-white/40 text-sm">· 247+ verified reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl p-7 border border-white/10 transition-colors relative"
            >
              <Quote className="w-7 h-7 text-[#22d3ee]/40 mb-4" />
              <blockquote className="text-white/80 leading-relaxed text-[15px]">
                "{testimonial.text}"
              </blockquote>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#22d3ee]/15 flex items-center justify-center">
                  <span className="font-semibold text-[#22d3ee] text-sm">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-white/40">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Join our growing family of happy customers</h3>
            <p className="text-white/50 text-sm mt-1">247+ five-star reviews and counting.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.google.com/search?q=arcturus+services+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-full hover:border-white/50 transition-colors whitespace-nowrap"
            >
              Read All Reviews
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#22d3ee] text-black text-sm font-semibold rounded-full hover:bg-white transition-colors whitespace-nowrap"
            >
              Book Your Service
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;
