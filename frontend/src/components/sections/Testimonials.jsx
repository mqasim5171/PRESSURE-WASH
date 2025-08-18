import React from 'react';
import { Star, Quote } from 'lucide-react';
import Section from '../ui/Section';
import { copy } from '../../lib/copy';

const Testimonials = () => {
  const { testimonials } = copy;

  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {testimonials.title}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="font-semibold text-slate-900">{testimonials.rating}</span>
        </div>
        <p className="text-slate-600">{testimonials.sub}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.items.map((testimonial, index) => (
          <div 
            key={index}
            className="bg-slate-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow duration-300"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6">
              <Quote className="w-8 h-8 text-blue-200" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-slate-700 mb-6 leading-relaxed">
              "{testimonial.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-blue-600">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">{testimonial.name}</div>
                <div className="text-sm text-slate-600">{testimonial.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Reviews CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join Our Growing Family of Happy Customers
            </h3>
            <p className="text-blue-100 mb-6">
              Over 247 five-star reviews and counting. Experience the difference professional cleaning makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.google.com/search?q=arcturus+services+reviews" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Read All Reviews
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
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