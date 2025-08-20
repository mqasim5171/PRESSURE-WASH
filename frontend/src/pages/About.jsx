import React from 'react';
import { CheckCircle, Shield, Award, Clock, Users, Star } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/button';
import CTA from '../components/sections/CTA';
import { copy } from '../lib/copy';

const About = () => {
  const { about } = copy;

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <Section className="pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#314085] mb-4">
                {about.title}
              </h1>
              <p className="text-xl text-[#44B149] font-semibold">
                {about.subtitle}
              </p>
            </div>

            <div className="prose prose-lg text-slate-600">
              {about.body.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                href="/contact"
                className="bg-[#F79029] hover:bg-[#d76f0f] text-white"
              >
                Get Free Quote Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="tel:0414203262"
                className="border-[#314085] text-[#314085] hover:bg-[#314085] hover:text-white"
              >
                Call 0414 203 262
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={about.image.src}
              alt={about.image.alt}
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#44B149]/20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#44B149]" />
                </div>
                <div>
                  <div className="font-bold text-[#314085]">Licensed & Insured</div>
                  <div className="text-sm text-slate-600">Melbourne Registered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#314085] mb-4">
            Why Choose Arcturus Services?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We're not just another cleaning service. We're your trusted partner in property maintenance and care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {about.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-[#314085]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#314085]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#314085] mb-2">{feature}</h3>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#314085] mb-4">
            Our Track Record Speaks for Itself
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#314085] rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#314085]">1000+</div>
              <div className="text-slate-600">Happy Customers This Year</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#44B149] rounded-2xl flex items-center justify-center mx-auto">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#314085]">247+</div>
              <div className="text-slate-600">Five-Star Reviews</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#F79029] rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#314085]">$10M</div>
              <div className="text-slate-600">Insurance Coverage</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#314085] rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#314085]">7</div>
              <div className="text-slate-600">Days a Week Service</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Team Values */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#314085] mb-4">
            Our Commitment to Excellence
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Every job we complete is backed by our unwavering commitment to quality, safety, and customer satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-slate-50 rounded-2xl">
            <div className="w-16 h-16 bg-[#314085] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#314085] mb-4">Safety First</h3>
            <p className="text-slate-600 leading-relaxed">
              Every technician is fully trained in safety protocols and uses professional-grade equipment to ensure safe, effective cleaning.
            </p>
          </div>

          <div className="text-center p-8 bg-slate-50 rounded-2xl">
            <div className="w-16 h-16 bg-[#44B149] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#314085] mb-4">Quality Guaranteed</h3>
            <p className="text-slate-600 leading-relaxed">
              We stand behind our work with a 100% satisfaction guarantee. If you're not happy, we'll return to make it right.
            </p>
          </div>

          <div className="text-center p-8 bg-slate-50 rounded-2xl">
            <div className="w-16 h-16 bg-[#F79029] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#314085] mb-4">Reliable Service</h3>
            <p className="text-slate-600 leading-relaxed">
              Same-day service available, punctual arrivals, and clear communication every step of the way.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#314085]">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
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
                className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#44B149]"
              >
                <h3 className="font-bold mb-3 text-[#314085]">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTA />
    </main>
  );
};

export default About;
