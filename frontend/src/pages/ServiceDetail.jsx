import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Shield, Star, Phone } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/button';
import CTA from '../components/sections/CTA';
import { copy } from '../lib/copy';

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = copy.services.find(s => s.slug === slug);

  if (!service) {
    return (
      <main>
        <Section className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <p className="text-slate-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </Section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {service.long}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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

      {/* Service Benefits */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            What's Included in Our {service.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {service.bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">{bullet}</h3>
                  <p className="text-slate-600 text-sm">
                    Professional service with attention to detail and guaranteed results.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process Section */}
      <Section className="bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Our Professional Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Free Assessment",
                description: "We evaluate your property and provide a detailed quote with no hidden costs."
              },
              {
                step: "2", 
                title: "Professional Setup",
                description: "Our team arrives with all necessary equipment and safety gear for the job."
              },
              {
                step: "3",
                title: "Expert Cleaning", 
                description: "We use proven techniques and eco-friendly products for optimal results."
              },
              {
                step: "4",
                title: "Quality Check",
                description: "Final inspection to ensure everything meets our high standards before we leave."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      
      

      <CTA />
    </main>
  );
};

export default ServiceDetail;