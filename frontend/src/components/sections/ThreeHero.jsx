import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import PhotoGalleryScene, { CAMERA_INITIAL } from "../three/PhotoGalleryScene.jsx";

/**
 * ThreeHero
 * ----------
 * A real 3D scroll-driven "drone inspection" hero: a sticky <Canvas>
 * hosting an actual Three.js scene (see PhotoGalleryScene.jsx) whose
 * camera flies between your real photorealistic renders - mounted as
 * panels in 3D space - as the page scrolls. Captions are layered on top
 * as plain HTML, never baked into the 3D content.
 */

const scenes = [
  {
    eyebrow: "01 — Approach",
    title: "See What Your Solar System Can't Tell You",
    caption: "Every inspection begins at ground level.",
  },
  {
    eyebrow: "02 — Ascending",
    title: "Advanced Aerial Inspection",
    caption: "The camera lifts for a wider view.",
  },
  {
    eyebrow: "03 — Elevated",
    title: "Every Panel. Every Cell.",
    caption: "Rising above the roofline.",
  },
  {
    eyebrow: "04 — Aerial Profile",
    title: "A Complete Rooftop Map",
    caption: "Full panel layout, captured in detail.",
  },
  {
    eyebrow: "05 — Scanning",
    title: "Thermal Imaging Reveals Hidden Problems",
    caption: "Precision drone inspection in progress.",
  },
  {
    eyebrow: "06 — Detected",
    title: "Hotspots Found Before They Become Failures",
    caption: "Three thermal anomalies flagged on this array.",
  },
];

const N = scenes.length;
const SEGMENT = 1 / (N - 1);

export default function ThreeHero() {
  const containerRef = useRef(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progressRef.current = v;
      const idx = Math.min(N - 1, Math.max(0, Math.round(v / SEGMENT)));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
  }, [scrollYProgress]);

  const active = scenes[activeIndex];

  return (
    <section ref={containerRef} style={{ height: `${N * 90}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#02060c]">
        <Canvas
          dpr={[1, isCompact ? 1.4 : 2]}
          camera={{ fov: 42, near: 0.1, far: 220, position: CAMERA_INITIAL }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <PhotoGalleryScene progressRef={progressRef} isCompact={isCompact} />
          </Suspense>
        </Canvas>

        {/* Contrast wash so overlay text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/30 pointer-events-none z-40" />

        {/* Text overlay - discrete swap, independent of the continuous camera move */}
        <div className="absolute inset-0 z-50 flex flex-col items-start justify-end px-6 md:px-16 pb-20 md:pb-28 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.eyebrow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <span className="text-[#f79029] tracking-widest text-sm md:text-base font-semibold uppercase">
                {active.eyebrow}
              </span>
              <h2 className="mt-3 text-3xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                {active.title}
              </h2>
              <p className="mt-4 text-base md:text-xl text-gray-200 max-w-xl">
                {active.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {scenes.map((_, i) => (
            <span
              key={i}
              className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-[#f79029] scale-125" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint, only on the first frame */}
        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/70 text-sm tracking-wide"
            >
              Scroll to inspect ↓
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
