"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

/**
 * ScrollDroneSequence
 * --------------------
 * Fakes a continuous 3D drone "flythrough" of one house using six flat
 * photographs, a sticky viewport, and scroll-linked transforms — no WebGL.
 *
 * FRAMING: the source photos are ultra-wide (~2.3:1), wider than a typical
 * browser viewport (~1.6-1.8:1). This used to render with `object-fit:
 * contain` to show the full uncropped frame, letterboxed like widescreen
 * footage - but that left solid black bars top and bottom on any normal
 * (non-ultrawide) window, which sat directly behind the floating nav and
 * broke its transparent-over-photo look. Every frame now uses `cover`
 * instead, cropping the sides rather than adding bars; the trade-off is
 * intentional.
 *
 * MOTION: two layers stacked on each other.
 *
 * 1. A CONTINUOUS camera move (scale + vertical drift + tiny rotation)
 *    interpolated across the ENTIRE 6-scene timeline using one set of
 *    keyframes per scene breakpoint - not a flat start/end range. Each
 *    leg of the scroll gets its own zoom/pan delta, so scene 1->2 can
 *    push in gently while scene 4->5 pushes in hard, and the motion never
 *    goes flat for an entire scene the way a single global range does.
 *    It's applied IDENTICALLY to every photo layer, so whichever photo
 *    is on top at a given instant is already mid-flight.
 *
 * 2. A crossfade that swaps WHICH photo is on top, timed so each swap
 *    happens while the shared camera move is already in progress and
 *    never resets. The cut is hidden inside the motion.
 */

// Every title is [lead, accent] - the accent half renders in the cyan
// "tech" color, matching the two-tone headline treatment throughout.
const scenes = [
  {
    image: "/images/drone-sequence/scene-1-front.webp",
    mobileImage: "/images/drone-sequence-mobile/scene-1-front-mobile.webp",
    eyebrow: "01 — Approach",
    titleLead: "See what your",
    titleAccent: "solar roof is hiding.",
    caption: "Every clean starts with a scan, not a guess.",
  },
  {
    image: "/images/drone-sequence/scene-2-rising.webp",
    mobileImage: "/images/drone-sequence-mobile/scene-2-rising-mobile.webp",
    eyebrow: "02 — Ascending",
    titleLead: "Advanced",
    titleAccent: "aerial inspection.",
    caption: "The drone lifts for a wider view of the array.",
  },
  {
    image: "/images/drone-sequence/scene-3-elevated.webp",
    mobileImage: "/images/drone-sequence-mobile/scene-3-elevated-mobile.webp",
    eyebrow: "03 — Elevated",
    titleLead: "Every panel.",
    titleAccent: "Every cell.",
    caption: "Rising above the roofline for full coverage.",
  },
  {
    image: "/images/drone-sequence/scene-4-isometric.webp",
    mobileImage: "/images/drone-sequence-mobile/scene-4-isometric-mobile.webp",
    eyebrow: "04 — Aerial Profile",
    titleLead: "A complete",
    titleAccent: "rooftop map.",
    caption: "Full panel layout, captured in detail.",
  },
  {
    image: "/images/drone-sequence/scene-5-drone.webp",
    // No dedicated mobile crop yet for this one - falls back to the
    // cover-cropped desktop photo until it's supplied.
    mobileImage: null,
    eyebrow: "05 — Scanning",
    titleLead: "Thermal imaging",
    titleAccent: "reveals hidden problems.",
    caption: "Precision drone scanning, before we ever clean a panel.",
  },
  {
    image: "/images/drone-sequence/scene-6-thermal.webp",
    mobileImage: "/images/drone-sequence-mobile/scene-6-thermal-mobile.webp",
    eyebrow: "06 — Detected",
    titleLead: "Hotspots found",
    titleAccent: "before they cost you output.",
    caption: "Three thermal anomalies flagged on this array.",
  },
];

const N = scenes.length;
const SEGMENT = 1 / (N - 1);
const BREAKPOINTS = scenes.map((_, i) => i * SEGMENT); // [0, .2, .4, .6, .8, 1]
// Fraction of each segment that's a "hold" before the crossfade starts.
// Lower = longer, more gradual blend between scenes.
const CROSSFADE_START = 0.4;

// One continuous zoom/pan/rotate value per breakpoint - the camera keeps
// pushing in and drifting up scene over scene, instead of one flat range.
// Kept deliberately small: the section clips overflow, so a pan/zoom big
// enough to be dramatic will drag content near the frame edges (the drone
// icon in scene 5, the hotspots in scene 6) right out of view. The six
// distinct camera angles crossfading are what sell the flythrough; this
// is just a subtle accent on top, not the main effect.
// Equal-sized steps per leg (rather than front-loaded deltas) so the camera
// push feels like one continuous, evenly-paced move instead of speeding up
// at the start and going flat near the end.
const ZOOM_KEYFRAMES = [1.0, 1.032, 1.064, 1.096, 1.128, 1.16];
const PAN_Y_KEYFRAMES = [0, -5.6, -11.2, -16.8, -22.4, -28]; // px, upward drift
const ROTATE_KEYFRAMES = [0, 0.14, 0.28, 0.42, 0.56, 0.7]; // deg, subtle bank

const compact = (arr, factor) => arr.map((v) => arr[0] + (v - arr[0]) * factor);
const flat = (arr) => arr.map(() => arr[0]);

// Builds the [inputRange, outputRange] opacity keyframes for scene index i,
// so each scene fades in, holds, then fades out into the next.
function opacityRangeFor(i) {
  const bp = (k) => k * SEGMENT;
  const fadeStart = (k) => bp(k) + SEGMENT * CROSSFADE_START;

  if (i === 0) {
    return [[0, fadeStart(0), bp(1)], [1, 1, 0]];
  }
  if (i === N - 1) {
    return [[fadeStart(i - 1), bp(i), 1], [0, 1, 1]];
  }
  return [
    [fadeStart(i - 1), bp(i), fadeStart(i), bp(i + 1)],
    [0, 1, 1, 0],
  ];
}

function SceneLayer({ scene, index, scrollYProgress, cameraScale, cameraY, cameraRotate, isLast, isCompact }) {
  const [inputRange, outputRange] = useMemo(() => opacityRangeFor(index), [index]);
  const opacity = useTransform(scrollYProgress, inputRange, outputRange);
  // Hooks must run unconditionally on every render, even though the sweep
  // is only rendered for the last scene - compute it here regardless.
  const sweepY = useTransform(scrollYProgress, [1 - SEGMENT, 1], ["-120%", "220%"]);

  // Mobile gets a dedicated portrait crop where one exists, composed so the
  // house sits centred top-to-bottom instead of losing its sides to a
  // `cover` crop of the wide desktop photo. Falls back to the desktop shot
  // (still `cover`-cropped) for any scene missing a mobile export.
  const hasMobileCrop = isCompact && scene.mobileImage;
  const src = hasMobileCrop ? scene.mobileImage : scene.image;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, zIndex: index, willChange: "opacity" }}
    >
      <motion.img
        src={src}
        alt=""
        draggable={false}
        // Only the very first frame needs to be ready immediately; the rest
        // decode as the user actually approaches them.
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
        className="w-full h-full select-none"
        style={{
          // Always `cover`, never `contain` - contain letterboxes these
          // ultra-wide (~2.3:1) photos with solid black bars top and
          // bottom on any screen narrower than that ratio, which is nearly
          // every real browser window. That black bar was sitting right
          // behind the floating nav, killing the transparent-over-photo
          // look the nav depends on. Full-bleed cover, cropping the sides
          // instead, is what an actual cinematic hero needs.
          objectFit: "cover",
          objectPosition: hasMobileCrop ? "center" : "center 40%",
          scale: cameraScale,
          y: cameraY,
          rotate: cameraRotate,
          willChange: "transform",
        }}
      />
      {/* Thermal scan sweep - only on the final (thermal) frame */}
      {isLast && (
        <motion.div
          className="absolute inset-x-0 h-1/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.18) 50%, transparent 100%)",
            y: sweepY,
            opacity,
          }}
        />
      )}
    </motion.div>
  );
}

export default function ScrollDroneSequence() {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();
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

  // Smooth out raw scroll input so the camera drifts instead of jittering -
  // slightly loose spring reads more like eased drone footage than a
  // snappy UI transition. Skipped on mobile: the spring adds a physics
  // simulation on every animation frame on top of transform work that's
  // already heavier on weaker GPUs, and native touch-scroll momentum
  // already reads as smooth without it.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.5,
  });
  const progress = reduceMotion || isCompact ? scrollYProgress : smoothProgress;

  // Shared camera move - identical for every photo layer (see file header).
  // Rotate is dropped on mobile entirely - a combined scale+translate+rotate
  // transform is more expensive for the browser to composite than
  // scale+translate alone, and the bank was only ever a subtle accent.
  const zoomKeyframes = reduceMotion ? flat(ZOOM_KEYFRAMES) : isCompact ? compact(ZOOM_KEYFRAMES, 0.55) : ZOOM_KEYFRAMES;
  const panKeyframes = reduceMotion ? flat(PAN_Y_KEYFRAMES) : isCompact ? compact(PAN_Y_KEYFRAMES, 0.55) : PAN_Y_KEYFRAMES;
  const rotateKeyframes = reduceMotion || isCompact ? flat(ROTATE_KEYFRAMES) : ROTATE_KEYFRAMES;

  const cameraScale = useTransform(progress, BREAKPOINTS, zoomKeyframes);
  const cameraY = useTransform(progress, BREAKPOINTS, panKeyframes);
  const cameraRotate = useTransform(progress, BREAKPOINTS, rotateKeyframes);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(N - 1, Math.max(0, Math.round(v / SEGMENT)));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
  }, [scrollYProgress]);

  const active = scenes[activeIndex];

  return (
    <section
      ref={containerRef}
      style={{ height: `${N * (isCompact ? 65 : 90)}vh` }}
      className="relative"
    >
      {/* 100svh (not 100vh) so mobile browser toolbars showing/hiding
          doesn't repeatedly resize this pinned viewport mid-scroll. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#02060c]">
        {scenes.map((scene, i) => {
          // Only the current scene and its immediate neighbours are ever
          // visible at once (the crossfade opacity is 0 everywhere else) -
          // no need to keep all 6 large images mounted and composited for
          // the entire scroll. A ±1 window is generous padding around the
          // spring-smoothed progress so nothing pops in/out mid-crossfade.
          if (Math.abs(i - activeIndex) > 1) return null;
          return (
            <SceneLayer
              key={scene.image}
              scene={scene}
              index={i}
              scrollYProgress={progress}
              cameraScale={cameraScale}
              cameraY={cameraY}
              cameraRotate={cameraRotate}
              isLast={i === N - 1}
              isCompact={isCompact}
            />
          );
        })}

        {/* Contrast wash so overlay text stays readable on every frame */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40 pointer-events-none z-40" />

        {/* Floating "live scan" glass card - hero-only flavor UI that sells
            the tech-inspection angle before the story even starts scrolling. */}
        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="absolute top-28 md:top-32 right-4 md:right-16 z-50 w-[240px] sm:w-[260px] rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 p-5 hidden sm:block"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-[11px] font-semibold tracking-widest uppercase">Live Scan</span>
                <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Array output</span>
                  <span className="text-white font-semibold text-sm">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Panel temp</span>
                  <span className="text-white font-semibold text-sm">48°C</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/40">
                2 hotspots flagged on this array
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text overlay - old and new captions cross-dissolve (no mode="wait" gap)
            so the swap feels continuous with the camera move instead of flashing
            to empty between scenes. Absolutely positioned so the overlap during
            the crossfade doesn't push either copy out of place. */}
        <div className="absolute inset-0 z-50 flex flex-col items-start justify-end px-6 md:px-16 pb-20 md:pb-28">
          <div className="relative w-full max-w-2xl">
          <AnimatePresence>
            <motion.div
              key={active.eyebrow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-x-0 bottom-0 max-w-2xl"
            >
              <span className="text-[#22d3ee] tracking-widest text-sm md:text-base font-semibold uppercase">
                {active.eyebrow}
              </span>
              <h2 className="mt-3 text-3xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                <span className="text-white">{active.titleLead} </span>
                <span className="text-[#22d3ee]">{active.titleAccent}</span>
              </h2>
              <p className="mt-4 text-base md:text-xl text-gray-300 max-w-xl">
                {active.caption}
              </p>

              {activeIndex === 0 ? (
                <div className="mt-7 flex items-center gap-5">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition"
                  >
                    Get Your Free Quote
                    <Zap className="w-4 h-4" />
                  </Link>
                  <span className="text-white/40 text-sm hidden sm:inline">Same-day quotes • Sydney-wide</span>
                </div>
              ) : (
                <div className="mt-5 h-px w-16 bg-[#22d3ee]/50" />
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {scenes.map((_, i) => (
            <span
              key={i}
              className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-[#22d3ee] scale-125" : "bg-white/30"
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
