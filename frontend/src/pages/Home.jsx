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


import Meta from '../Meta'

export default function Home(){

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Delay popup by 1s
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Meta
        title="Pressure Washing & Exterior Cleaning Sydney | Arcturus Services"
        desc="Pressure washing, solar panel, roof & gutter, and window cleaning across Sydney. Same-day service. Call 0414 203 262."
        path="/"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"LocalBusiness",
          name:"Arcturus Services",
          url:"https://arcturusservices.com.au",
          telephone:"+61 02 8000 1080",
          areaServed:"Sydney, NSW",
          address:{ "@type":"PostalAddress", addressLocality:"Sydney", addressRegion:"NSW", addressCountry:"AU" }
        })}</script>
      </Meta>

      <h1>Pressure Washing & Cleaning in Sydney</h1>
      {/* your existing home UI */}
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

    </>
  )
}
