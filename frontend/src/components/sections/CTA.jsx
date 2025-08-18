import React, { useState } from 'react';
import { Phone, MessageSquare, Clock, Shield } from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/Button';
import QuoteModal from '../QuoteModal';

const CTA = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <Section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Free Quotes • Same Day Service
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional cleaning services across Sydney with guaranteed results
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                onClick={() => setIsQuoteModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Get Free Quote
              </Button>
              <Button 
                variant="outline"
                size="lg"
                href="tel:0414203262"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 0414 203 262
              </Button>
            </div>

            <p className="text-blue-200 text-sm">
              Response within 2 hours during business hours • Same-day service available
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-blue-700 pt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Same-Day Service</h4>
              <p className="text-blue-200 text-sm">Call before 2 PM</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Fully Insured</h4>
              <p className="text-blue-200 text-sm">$10M coverage</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold">★</div>
              </div>
              <h4 className="font-bold mb-2">5-Star Rated</h4>
              <p className="text-blue-200 text-sm">200+ reviews</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-xl font-bold">100%</div>
              </div>
              <h4 className="font-bold mb-2">Satisfaction</h4>
              <p className="text-blue-200 text-sm">Guaranteed</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </>
  );
};

export default CTA;