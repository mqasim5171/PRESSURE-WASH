import React from "react";
import { Link } from "react-router-dom";
import { Clock, Shield, Star, Phone } from "lucide-react";
import Section from "../components/ui/Section";
import CTA from "../components/sections/CTA";
import ServicesGrid from "../components/sections/Services"; // reusing your section
import Button from "../components/ui/button";

const Services = () => {
  return (
    // pt-24 pushes content below fixed navbar (~96px). Adjust if your navbar is taller/shorter.
    <main className="pt-24">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-16 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Our Services
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Professional pressure washing and exterior cleaning solutions to keep your property
          looking spotless and protected all year round.
        </p>
      </Section>

      {/* Quick Stats like ServiceDetail */}
      <Section className="bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="font-bold text-slate-900">Same Day</div>
            <div className="text-sm text-slate-600">Service Available</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="font-bold text-slate-900">Fully Insured</div>
            <div className="text-sm text-slate-600">$10M Coverage</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="font-bold text-slate-900">5-Star Rated</div>
            <div className="text-sm text-slate-600">247+ Reviews</div>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-3">100%</div>
            <div className="font-bold text-slate-900">Satisfaction</div>
            <div className="text-sm text-slate-600">Guaranteed</div>
          </div>
        </div>
      </Section>

      {/* Service Grid from home page */}
      <ServicesGrid />

      {/* CTA Section */}
      <Section className="bg-slate-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Refresh Your Property?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" href="/contact">
              Get Free Quote Now
            </Button>
            <Button variant="outline" size="lg" href="tel:0414203262">
              <Phone className="w-5 h-5 mr-2" />
              Call for Same-Day Service
            </Button>
          </div>
        </div>
      </Section>

      <CTA />
    </main>
  );
};

export default Services;
