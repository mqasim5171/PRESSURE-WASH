import React from 'react';
import { Star, Quote } from 'lucide-react';
import Section from '../ui/Section';

const Testimonials = () => {
  return (
    <Section className="bg-white">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#314085] mb-4">
          What Arcturus Customers Say
        </h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#F79029] fill-current" />
            ))}
          </div>
          <span className="font-semibold text-[#314085]">5.0 Stars</span>
        </div>
        <p className="text-slate-600">Based on 247+ verified reviews</p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            name:"Sarah M.", 
            location:"Bondi",
            text:"Had my solar panels cleaned by Arcturus Services and couldn't be happier! They increased our energy output by 28% and were incredibly professional throughout. Highly recommend to anyone wanting to maximize their solar investment." 
          },
          { 
            name:"Michael T.", 
            location:"Chatswood",
            text:"Absolutely fantastic pressure washing service! My concrete driveway looked terrible after years of stains and weathering. Now it looks like we have a brand new driveway. Professional, punctual and worth every penny!" 
          },
          { 
            name:"Lisa K.", 
            location:"Manly",
            text:"Called Arcturus for an urgent roof and gutter clean before the storm season. They came same-day, cleared everything perfectly and potentially saved us from serious water damage. Professional service at its absolute best!" 
          }
        ].map((testimonial, index) => (
          <div 
            key={index}
            className="bg-slate-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#44B149]"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6">
              <Quote className="w-8 h-8 text-[#314085]/20" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#F79029] fill-current" />
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-slate-700 mb-6 leading-relaxed">
              "{testimonial.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#314085]/10 rounded-full flex items-center justify-center">
                <span className="font-semibold text-[#314085]">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-[#314085]">{testimonial.name}</div>
                <div className="text-sm text-slate-600">{testimonial.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-[#314085] to-[#44B149] rounded-2xl p-8 text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Growing Family of Happy Customers
            </h3>
            <p className="text-white/80 mb-6">
              Over 247+ five-star reviews and counting. Experience the difference professional cleaning makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.google.com/search?q=arcturus+services+reviews" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#314085] font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Read All Reviews
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#314085] transition-colors"
              >
                Book Your Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;
