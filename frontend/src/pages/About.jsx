import React from 'react';
import { CheckCircle, Shield, Award, Clock, Users, Star } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import CTA from '../components/sections/CTA';
import { copy } from '../lib/copy';

const About = () => {
  const { about } = copy;

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {about.title}
              </h1>
              <p className="text-xl text-blue-600 font-semibold">
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
              <Button size="lg" href="/contact">
                Get Free Quote Now
              </Button>
              <Button variant="outline" size="lg" href="tel:0414203262">
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
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Licensed & Insured</div>
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Why Choose Arcturus Services?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We're not just another cleaning service. We're your trusted partner in property maintenance and care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {about.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature}</h3>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Our Track Record Speaks for Itself
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">1000+</div>
              <div className="text-slate-600">Happy Customers This Year</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">247+</div>
              <div className="text-slate-600">Five-Star Reviews</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">$10M</div>
              <div className="text-slate-600">Insurance Coverage</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">7</div>
              <div className="text-slate-600">Days a Week Service</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Team Values */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Our Commitment to Excellence
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Every job we complete is backed by our unwavering commitment to quality, safety, and customer satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-blue-50 rounded-2xl">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Safety First</h3>
            <p className="text-slate-600 leading-relaxed">
              Every technician is fully trained in safety protocols and uses professional-grade equipment to ensure safe, effective cleaning.
            </p>
          </div>

          <div className="text-center p-8 bg-green-50 rounded-2xl">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Quality Guaranteed</h3>
            <p className="text-slate-600 leading-relaxed">
              We stand behind our work with a 100% satisfaction guarantee. If you're not happy, we'll return to make it right.
            </p>
          </div>

          <div className="text-center p-8 bg-cyan-50 rounded-2xl">
            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Reliable Service</h3>
            <p className="text-slate-600 leading-relaxed">
              Same-day service available, punctual arrivals, and clear communication every step of the way.
            </p>
          </div>
        </div>
      </Section>

      <CTA />
    </main>
  );
};

export default About;