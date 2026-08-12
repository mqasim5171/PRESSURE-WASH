import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * InspectionJourney
 * -------------------
 * A normal, real-scrolling sequence of full-bleed photo sections with
 * subtle parallax and Ken Burns zoom on each - no pinning, no scroll
 * hijacking, no 3D. This is the standard, proven pattern for this kind
 * of "walk through the inspection" storytelling (the same technique
 * behind most Awwwards-style scroll pages): each section reacts to
 * being scrolled through, but your scroll input always moves the page
 * itself, so it never feels like a slideshow.
 */

const scenes = [
  {
    image: "/images/drone-sequence/scene-1-front.webp",
    index: "01",
    eyebrow: "Approach",
    title: "See What Your Solar System Can't Tell You",
    caption: "Every inspection begins at ground level.",
  },
  {
    image: "/images/drone-sequence/scene-2-rising.webp",
    index: "02",
    eyebrow: "Ascending",
    title: "Advanced Aerial Inspection",
    caption: "The camera lifts for a wider view.",
  },
  {
    image: "/images/drone-sequence/scene-3-elevated.webp",
    index: "03",
    eyebrow: "Elevated",
    title: "Every Panel. Every Cell.",
    caption: "Rising above the roofline.",
  },
  {
    image: "/images/drone-sequence/scene-4-isometric.webp",
    index: "04",
    eyebrow: "Aerial Profile",
    title: "A Complete Rooftop Map",
    caption: "Full panel layout, captured in detail.",
  },
  {
    image: "/images/drone-sequence/scene-5-drone.webp",
    index: "05",
    eyebrow: "Scanning",
    title: "Thermal Imaging Reveals Hidden Problems",
    caption: "Precision drone inspection in progress.",
  },
  {
    image: "/images/drone-sequence/scene-6-thermal.webp",
    index: "06",
    eyebrow: "Detected",
    title: "Hotspots Found Before They Become Failures",
    caption: "Three thermal anomalies flagged on this array.",
  },
];

function JourneySection({ scene, align }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax + Ken Burns, scoped to this section only - the image
  // drifts and zooms gently as it passes through view, nothing more.
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[#02060c]">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${scene.image})` }}
        />
      </motion.div>

      {/* Contrast wash for legible text, heavier at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />
      {/* Soft seam into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#02060c] to-transparent pointer-events-none" />

      <div
        className={`absolute inset-0 z-10 flex flex-col justify-end px-6 md:px-16 pb-20 md:pb-28 ${
          align === "right" ? "items-end text-right" : "items-start text-left"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[#f79029] tracking-widest text-sm md:text-base font-semibold uppercase">
            {scene.index} — {scene.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            {scene.title}
          </h2>
          <p className="mt-4 text-base md:text-xl text-gray-200 max-w-xl">
            {scene.caption}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function InspectionJourney() {
  return (
    <div className="relative">
      {scenes.map((scene, i) => (
        <JourneySection key={scene.image} scene={scene} align={i % 2 === 0 ? "left" : "right"} />
      ))}
    </div>
  );
}
