// src/pages/Home.jsx
import React from "react";
import ScrollDroneSequence from "../components/sections/ScrollDroneSequence";
import Services from "../components/sections/Services";
import HowItWorks from "../components/sections/HowItWorks";
import HotspotDetection from "../components/sections/HotspotDetection";
import Stats from "../components/sections/Stats";
import Process from "../components/sections/Process";
import BeforeAfterSlider from "../components/sections/BeforeAfterSlider";
import Testimonials from "../components/sections/Testimonials";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";
import Areas from "@/components/sections/Areas";
import Reveal from "../components/Reveal";

import Meta from '../Meta'
import { copy } from '../lib/copy'
import { biz } from '../lib/config'

export default function Home(){
  const areaNames = (copy.areas?.featured || []).map((a) => a.name);

  return (
    <>
      <Meta
        title="Drone-Powered Solar Panel Cleaning & Pressure Washing Sydney | Arcturus Services"
        desc="Thermal drone inspection finds it, our drone-powered clean fixes it. Solar panel cleaning, pressure washing, roof & gutter, and window cleaning across Sydney. Same-day service. Call 02 8000 1080."
        path="/"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "@id": "https://arcturusservices.com.au/#business",
          name: "Arcturus Services",
          url: "https://arcturusservices.com.au",
          image: "https://arcturusservices.com.au/images/drone-sequence/scene-1-front.webp",
          telephone: "+61-2-8000-1080",
          email: biz.email,
          priceRange: "$$",
          description: "Drone-powered solar panel cleaning, thermal scanning and pressure washing across Sydney, NSW.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Sydney",
            addressRegion: "NSW",
            addressCountry: "AU",
          },
          geo: { "@type": "GeoCoordinates", latitude: -33.8688, longitude: 151.2093 },
          areaServed: areaNames.map((name) => ({ "@type": "City", name })),
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "08:00",
            closes: "18:00",
          },
          sameAs: Object.values(biz.socials || {}),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "247",
          },
        })}</script>

        {/* FAQPage - mirrors the FAQ section's real content exactly, so it
            qualifies for a rich result rather than being invisible/mismatched
            structured data. */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (copy.faq?.items || []).map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        })}</script>
      </Meta>

      {/* Visible headline lives inside the hero; this is for SEO/a11y only */}
      <h1 className="sr-only">Drone-Powered Solar Panel Cleaning & Pressure Washing in Sydney</h1>
    <main className="relative bg-[#02060c]">
      {/* Hero Section - sticky pinned camera flythrough across the drone sequence */}
      <ScrollDroneSequence />
      {/* Marker the Header watches to know when the hero has scrolled past,
          so the floating nav can switch from transparent-over-photo to its
          normal solid shape once there's dark page content behind it
          instead of the hero image. */}
      <div id="hero-end" />

      {/* Services Offered */}
      <Reveal><Services /></Reveal>

      {/* Editorial numbered walkthrough of the actual service flow */}
      <Reveal><HowItWorks /></Reveal>

      {/* Thermal fault detection - the standout interactive proof-of-tech component */}
      <Reveal><HotspotDetection /></Reveal>

      {/* Trust stats - real, existing claims in a huge-number strip */}
      <Reveal><Stats /></Reveal>

      {/* Our Process */}
      <Reveal><Process /></Reveal>

      {/* Before/after thermal comparison slider */}
      <Reveal><BeforeAfterSlider /></Reveal>

      <Reveal><Areas /></Reveal>
      {/* Customer Testimonials */}
      <Reveal><Testimonials /></Reveal>

      {/* FAQ Section */}
      <Reveal><FAQ /></Reveal>

      {/* Final Call To Action */}
      <Reveal><CTA /></Reveal>
    </main>

    </>
  )
}
