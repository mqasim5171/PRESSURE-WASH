import React from 'react';
import Section from '../components/ui/Section';
import { Calendar, ArrowRight } from 'lucide-react';

const Blog = () => {
  return (
    <main>
      {/* Hero Section */}
      <Section className="pt-32 lg:pt-48 bg-gradient-to-br from-blue-50 to-cyan-50 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Cleaning Tips & Insights
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional advice and industry insights from Sydney's leading cleaning experts
          </p>
        </div>
      </Section>

      {/* Coming Soon */}
      <Section className="bg-white">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Blog Coming Soon
          </h2>
          
          <p className="text-lg text-slate-600 mb-8">
            We're preparing valuable content about professional cleaning techniques, maintenance tips, 
            and industry best practices. Check back soon for expert insights from our experienced team.
          </p>

          <div className="bg-slate-50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">What to Expect:</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Solar panel maintenance guides</span>
              </li>
              <li className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Seasonal cleaning checklists</span>
              </li>
              <li className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Property maintenance tips</span>
              </li>
              <li className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span>Before & after case studies</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Cleaning Quote
            </a>
            <a 
              href="tel:0414203262"
              className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Call for Advice
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default Blog;