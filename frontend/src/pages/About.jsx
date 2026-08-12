import React from 'react';
import { CheckCircle, Shield, Award, Clock, Users, Star } from 'lucide-react';
import Section from '../components/ui/Section';
import Glow from '../components/Glow';
import CTA from '../components/sections/CTA';
import { copy } from '../lib/copy';
import Meta from '../Meta';

const About = () => {
  const { about } = copy;

  return (
    <>
      <Meta title="About Arcturus Services | Sydney Cleaning Experts" desc="Melbourne registered, Sydney operating. Fully insured, same-day availability, 100% satisfaction guarantee." path="/about" />
      <main className="bg-[#02060c]">
        {/* Hero Section */}
        <Section className="relative overflow-hidden pt-32 lg:pt-48 pb-20 border-b border-white/5">
          <Glow color="#22d3ee" className="w-[500px] h-[500px] -top-40 -right-40" />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">About Us</span>
                <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white mb-4">
                  {about.title}
                </h1>
                <p className="text-xl text-[#f79029] font-semibold">
                  {about.subtitle}
                </p>
              </div>

              <div className="space-y-4 text-white/60 text-lg">
                {about.body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#22d3ee] text-black font-semibold hover:bg-white transition-colors"
                >
                  Get Free Quote Now
                </a>
                <a
                  href="tel:0280001080"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-white/50 transition-colors"
                >
                  Call 02 8000 1080
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src={about.image.src}
                alt={about.image.alt}
                className="w-full h-[500px] object-cover rounded-2xl border border-white/10" />
              <div className="absolute -bottom-6 -left-6 bg-[#0a0f1a] border border-white/10 p-6 rounded-xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#22d3ee]/15 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#22d3ee]" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Licensed & Insured</div>
                    <div className="text-sm text-white/50">Melbourne Registered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        <Section className="bg-[#050910] border-b border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Arcturus Services?
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              We're not just another cleaning service. We're your trusted partner in property maintenance and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {about.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white/[0.03] border border-white/10 rounded-xl"
              >
                <div className="w-12 h-12 bg-[#22d3ee]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-[#22d3ee]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{feature}</h3>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Stats Section */}
        <Section className="bg-[#02060c] border-b border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Track Record Speaks for Itself
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "1000+", label: "Happy Customers This Year" },
              { icon: Star, value: "247+", label: "Five-Star Reviews" },
              { icon: Shield, value: "$10M", label: "Insurance Coverage" },
              { icon: Clock, value: "7", label: "Days a Week Service" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="space-y-4">
                <div className="w-20 h-20 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Icon className="w-10 h-10 text-[#22d3ee]" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-white/50">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Team Values */}
        <Section className="bg-[#050910] border-b border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Commitment to Excellence
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Every job we complete is backed by our unwavering commitment to quality, safety, and customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Safety First", text: "Every technician is fully trained in safety protocols and uses professional-grade equipment to ensure safe, effective cleaning." },
              { icon: CheckCircle, title: "Quality Guaranteed", text: "We stand behind our work with a 100% satisfaction guarantee. If you're not happy, we'll return to make it right." },
              { icon: Clock, title: "Reliable Service", text: "Same-day service available, punctual arrivals, and clear communication every step of the way." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center p-8 bg-white/[0.03] border border-white/10 rounded-2xl">
                <div className="w-16 h-16 bg-[#22d3ee]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-[#22d3ee]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-white/60 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ Section */}
        <Section className="bg-[#02060c]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "What makes Arcturus Services different?",
                  a: "We combine years of experience with modern techniques, eco-friendly products, and a true dedication to customer satisfaction."
                },
                {
                  q: "Are your services insured?",
                  a: "Yes, we carry $10 million public liability insurance and all technicians are licensed and trained."
                },
                {
                  q: "Do you offer same-day service?",
                  a: "Absolutely! We provide reliable same-day service across most areas, depending on availability."
                },
                {
                  q: "What if I’m not satisfied?",
                  a: "We offer a 100% satisfaction guarantee. If you’re not happy, we’ll return free of charge."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] rounded-xl p-6 border border-white/10 border-l-4 border-l-[#22d3ee]"
                >
                  <h3 className="font-bold mb-3 text-white">{faq.q}</h3>
                  <p className="text-white/60">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <CTA />
      </main>
    </>
  );
};

export default About;
