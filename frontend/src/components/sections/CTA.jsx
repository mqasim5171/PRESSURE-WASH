import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import QuoteModal from '../QuoteModal';

const CTA = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#02060c] border-t border-white/5">
        <img
          src="/images/drone-sequence/scene-1-front.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Darken only where text needs to sit legibly - top for the nav,
            a soft vignette behind the copy - not a flat wash over the whole photo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/50" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">
            Sydney · Same-Week Availability
          </span>
          <h2 className="mt-5 text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold text-white tracking-tight leading-[1.05]">
            Know exactly what
            <br />
            your roof is doing.
          </h2>

          <div className="mt-10">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#22d3ee] text-black text-lg font-bold rounded-full hover:bg-white transition-colors"
            >
              Book Your Solar Inspection
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};

export default CTA;
