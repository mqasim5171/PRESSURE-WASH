"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Map slides directly to service slugs
const slides = [
  {
    id: 1,
    image: "/images/main.webp",
    title: "Sydney’s #01",
    highlight: "Cleaning Services",
    description: "Trusted experts in pressure washing, window cleaning, and solar panel care.",
    link: "/services", // main services page
  },
  {
    id: 2,
    image: "/images/solar.avif",
    title: "Eco-Friendly",
    highlight: "Solar Panel Cleaning",
    description: "Boost efficiency and save energy with spotless solar panels.",
    link: "/services/solar-panel-cleaning",
  },
  {
    id: 3,
    image: "/images/window.jpg",
    title: "Shiny Windows,",
    highlight: "Clear Views",
    description: "Professional window cleaning that brightens your home or office.",
    link: "/services/window-cleaning",
  },
  {
    id: 4,
    image: "/images/pressure.png",
    title: "Powerful",
    highlight: "Pressure Washing",
    description: "Bring back the beauty of your driveway, roof, and outdoor spaces.",
    link: "/services/pressure-washing",
  },
  {
    id: 5,
    image: "/images/pressurewash.png",
    title: "Roof & Home",
    highlight: "Renovation Experts",
    description: "Restore your property with our top-rated roof and home cleaning solutions.",
    link: "/services/roof-gutter-cleaning",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-slide every 7s
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(${slides[current].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
            {/* Title + Highlight */}
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-lg"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {slides[current].title}
              <br />
              <motion.span
                className="text-[#f79029]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                {slides[current].highlight}
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {slides[current].description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6"
            >
              <a href={slides[current].link}>
                <Button className="bg-[#44b149] hover:bg-[#314085] text-white px-6 py-3 text-lg rounded-2xl shadow-lg transition-transform hover:scale-105">
                  View More
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
      >
        <ArrowLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
      >
        <ArrowRight size={28} />
      </button>
    </div>
  );
}
