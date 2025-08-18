import React from 'react';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import Areas from '../components/sections/Areas';
import Gallery from '../components/sections/Gallery';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

const Home = () => {
  return (
    <main>
      <Hero />
      <Services />
      <Process />
      <Areas />
      <Gallery />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
};

export default Home;