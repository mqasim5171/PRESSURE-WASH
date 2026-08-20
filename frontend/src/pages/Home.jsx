// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroCarousel from "../components/Hero/HeroCarousel";
import TrustStrip from "../components/sections/TrustStrip";
import Services from "../components/sections/Services";
import PackagesSection from "../components/Packages/PackagesSection";
import WhyChooseUs from "../components/Value/WhyChooseUs";
import HotspotDetection from "../components/sections/HotspotDetection";
import ThermalInspectionSection from "../components/Solar/ThermalInspectionSection";
import Stats from "../components/sections/Stats";
import Process from "../components/sections/Process";
import BeforeAfterResults from "../components/sections/BeforeAfterResults";
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

  // Header's "Why Us" / "Packages" links point at /#why-us and /#packages -
  // client-side routing doesn't auto-scroll to a hash the way a full page
  // load does, so do it manually whenever the hash changes (covers both
  // navigating in from another page and clicking the link while already on
  // Home, since only the hash changes in that second case).
  //
  // Once used, the hash is stripped back out of the address bar via
  // replaceState (not a router navigation - this doesn't touch history or
  // re-trigger this effect). Otherwise the hash just sits in the URL bar
  // indefinitely, and every subsequent refresh - including ones that have
  // nothing to do with that section - re-scrolls down to it instead of
  // starting at the top of the page like a normal reload.
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return undefined;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", location.pathname + location.search);
    }, 120);
    return () => clearTimeout(timer);
  }, [location.hash, location.pathname, location.search]);

  return (
    <>
      <Meta
        title="Solar Panel Cleaning & Thermal Inspection Sydney | Horizon Solar & Exterior Care"
        desc="Professional solar panel cleaning combined with DJI Matrice 4T thermal drone inspection, plus roof and concrete cleaning across Sydney. Same-day service. Call 02 8000 1080."
        path="/"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "@id": "https://horizonsolar.com.au/#business",
          name: "Horizon Solar & Exterior Care",
          url: "https://horizonsolar.com.au",
          image: "https://horizonsolar.com.au/images/drone-sequence/scene-1-front.webp",
          telephone: "+61-2-8000-1080",
          email: biz.email,
          priceRange: "$$",
          description: "Solar panel cleaning, DJI Matrice 4T thermal drone inspection, roof cleaning and concrete cleaning across Sydney, NSW.",
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

    <main className="relative bg-[#02060c]">
      {/* Hero Section - 3-slide carousel: main + lead form, solar before/after,
          thermal inspection + DJI Matrice 4T */}
      <HeroCarousel />
      {/* Marker the Header watches to know when the hero has scrolled past,
          so the floating nav can switch from transparent-over-photo to its
          normal solid shape once there's dark page content behind it
          instead of the hero image. */}
      <div id="hero-end" />

      {/* Key differentiators, directly under the hero */}
      <TrustStrip />

      {/* Services Offered - solar first, roof second, concrete third */}
      <Reveal><Services /></Reveal>

      {/* Individual + bundled packages, with configurable pricing/offers */}
      <Reveal><PackagesSection /></Reveal>

      {/* Replaces "1 Flight / 4 Steps" - why Horizon is better value */}
      <Reveal><WhyChooseUs /></Reveal>

      {/* Thermal fault detection - the standout interactive proof-of-tech component */}
      <Reveal><HotspotDetection /></Reveal>

      {/* Compact homeowner-facing thermal/hotspot education */}
      <Reveal><ThermalInspectionSection /></Reveal>

      {/* Trust stats - real, existing claims in a huge-number strip */}
      <Reveal><Stats /></Reveal>

      {/* Credentials / trust strip */}
      <Reveal><Process /></Reveal>

      {/* Before/after results - solar, roof and concrete transformations */}
      <Reveal><BeforeAfterResults /></Reveal>

      {/* Before/after thermal comparison slider (visual vs thermal, same roof) */}
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
