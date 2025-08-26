// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import Process from "../components/sections/Process";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";
import PopupNotification from "../components/PopupNotification";
import Areas from "@/components/sections/Areas";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Delay popup by 1s
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative">
      {/* Popup Notification */}
      {showPopup && <PopupNotification />}

      {/* Hero Section */}
      <Hero />

      {/* Services Offered */}
      <Services />

      {/* Our Process */}
      <Process />
      <Areas />
      {/* Customer Testimonials */}
      <Testimonials />
      
      {/* FAQ Section */}
      <FAQ />

      {/* Final Call To Action */}
      <CTA />
    </main>
  );
};

export default Home;