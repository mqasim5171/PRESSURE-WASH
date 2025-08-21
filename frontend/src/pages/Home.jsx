import React from 'react';
import Hero from '../components/sections/Hero';

import Services from '../components/sections/Services';
import Process from '../components/sections/Process';

import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';
import Areas from '@/components/sections/Areas';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      

      {/* Services Offered */}
      <Services />

      {/* Our Process */}
      <Process />

      

     

      {/* Customer Testimonials */}
      <Testimonials />

      <Areas />

      <FAQ />

      

      {/* Final Call To Action */}
      <CTA />
    </main>
  );
};

export default Home;
