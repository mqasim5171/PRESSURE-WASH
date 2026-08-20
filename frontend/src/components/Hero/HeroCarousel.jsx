import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import HeroLeadForm from "./HeroLeadForm";
import ThermalInfoCard from "./ThermalInfoCard";
import DroneTechnologyBadge from "../Solar/DroneTechnologyBadge";
import BeforeAfterComparison from "../Services/BeforeAfterComparison";
import { useCms } from "../../lib/useCms";
import { resolveMediaUrl } from "../../lib/media";

/**
 * HeroCarousel
 * -------------
 * Three-slide hero. Content (headline, copy, CTA, images) is admin-editable
 * via Admin > Homepage > Hero (/api/hero) - this component fetches that and
 * merges it over the static defaults below field-by-field, so:
 *   - the hero looks identical to today if the API is unreachable
 *   - an admin can edit just the headline and everything else stays put
 *   - an uploaded image is used the moment one exists; until then the
 *     original static photo for that slide type is shown
 *
 * The three slide TYPES (standard / before_after / thermal) still map to
 * three bespoke layouts below - that part isn't data-driven, since each
 * layout is genuinely different UI (a lead form vs a draggable comparison
 * vs a floating info card), not just swapped copy.
 *
 * Autoplay pauses whenever the user hovers/focuses the carousel, or is
 * actively dragging the before/after handle or filling in the lead form -
 * and is skipped entirely under prefers-reduced-motion (manual nav only).
 */
const AUTOPLAY_MS = 8000;

const DEFAULTS = {
  standard: {
    eyebrow: "Sydney · Solar Cleaning & Thermal Inspection",
    heading: "Professional Solar Cleaning.",
    subheading: "Thermal-Verified Results.",
    description: "We combine expert solar, roof and exterior cleaning with advanced drone thermal inspection — so you know your property isn't just clean, it's actually performing.",
    ctaLabel: "View Our Services",
    ctaUrl: "/services",
    imageUrl: "/images/drone-sequence/scene-1-front.webp",
    mobileImageUrl: "/images/drone-sequence-mobile/scene-1-front-mobile.webp",
  },
  before_after: {
    eyebrow: "Solar Panel Transformation",
    heading: "Restore Your Solar.",
    subheading: "Protect Your Investment.",
    description: "Professional solar panel cleaning combined with advanced system inspection.",
    ctaLabel: "View Solar Packages",
    ctaUrl: "/#packages",
    beforeImageUrl: "/images/solar-before.jpg",
    afterImageUrl: "/images/solar-after.jpg",
    mobileBeforeImageUrl: "",
    mobileAfterImageUrl: "",
  },
  thermal: {
    eyebrow: "Thermal Solar Inspection",
    heading: "See Problems",
    subheading: "Your Eyes Can't.",
    description: "Abnormal heat patterns and hotspots can point to underperforming areas that a visual check alone would miss.",
    ctaLabel: "Book a Thermal Scan",
    ctaUrl: "/contact",
    imageUrl: "/images/drone-sequence/scene-6-thermal.webp",
    mobileImageUrl: "/images/drone-sequence-mobile/scene-6-thermal-mobile.webp",
    thermalInfo: {
      title: "See Problems Your Eyes Can't.",
      bullets: [
        "Uneven heat or dirt buildup",
        "Partial shading",
        "Damaged or ageing cells",
        "Possible system underperformance",
      ],
    },
  },
};

const SLIDE_TYPES = ["standard", "before_after", "thermal"];
const IMAGE_KEYS = new Set(["imageUrl", "mobileImageUrl", "beforeImageUrl", "afterImageUrl", "mobileBeforeImageUrl", "mobileAfterImageUrl"]);

function mergeSlideContent(apiSlide, type) {
  const base = DEFAULTS[type];
  if (!apiSlide) return { ...base, id: type };
  const merged = { ...base, id: apiSlide.id };
  for (const key of Object.keys(base)) {
    if (key === "thermalInfo") {
      merged.thermalInfo = apiSlide.thermalInfo?.title ? apiSlide.thermalInfo : base.thermalInfo;
      continue;
    }
    let apiValue = apiSlide[key];
    // Uploaded image URLs are relative (/uploads/...), correct for
    // production where the backend serves the built frontend from the
    // same origin - resolved against REACT_APP_API_BASE for local dev,
    // where the frontend and backend run on different ports. The static
    // defaults (/images/...) are left untouched - see lib/media.js.
    if (apiValue && IMAGE_KEYS.has(key)) apiValue = resolveMediaUrl(apiValue);
    if (apiValue !== null && apiValue !== undefined && apiValue !== "") merged[key] = apiValue;
  }
  return merged;
}

export default function HeroCarousel() {
  const { data: apiSlides } = useCms("/api/hero", null);

  // Build the ordered [standard, before_after, thermal] content list - one
  // merged content object per type, skipping a type entirely if an admin
  // has explicitly disabled every slide of it (apiSlides is non-null but
  // has no enabled entry of that type).
  const slideContents = SLIDE_TYPES.map((type) => {
    const apiSlide = apiSlides?.find((s) => s.slideType === type);
    if (apiSlides && !apiSlide) return null; // explicitly disabled/removed
    return { type, content: mergeSlideContent(apiSlide, type) };
  }).filter(Boolean);
  const slides = slideContents.length ? slideContents : SLIDE_TYPES.map((type) => ({ type, content: DEFAULTS[type] }));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef(null);

  // Clamp in case the slide count changed (e.g. API loaded after mount and
  // removed a disabled slide) while the carousel was sitting on a now
  // out-of-range index.
  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [slides.length, activeIndex]);

  const goTo = useCallback((i) => setActiveIndex(((i % slides.length) + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (reduceMotion || isPaused || slides.length < 2) return undefined;
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [activeIndex, isPaused, reduceMotion, next, slides.length]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  // Scroll-jacked slide transitions: while the page is scrolled all the way
  // to the top (the hero is genuinely what's on screen), scrolling down
  // advances slides instead of scrolling the page; scrolling down again
  // once already on the last slide releases control and the page scrolls
  // normally. Scrolling back up from below re-engages the same way in
  // reverse. Deliberately scoped tight to avoid regressing anything:
  //  - desktop only (lg+) - mobile's hero was specifically redesigned
  //    earlier to avoid any scroll interference, and touch scrolling
  //    doesn't fire wheel events anyway, so this would be a no-op there.
  //  - off entirely under prefers-reduced-motion - plain scroll instead.
  //  - only intercepts while scrollY is ~0 - the instant the user has
  //    actually scrolled past the hero, this never intercepts again until
  //    they're back at the very top, so it can never trap someone
  //    mid-page.
  //  - only reacts to wheel/trackpad input, not Page Down/Space/scrollbar
  //    drag - a keyboard or scrollbar user simply scrolls straight past
  //    the hero as normal, which is the safer fallback over trying to
  //    intercept keys that might legitimately be typed into the lead
  //    form's fields.
  const lastWheelTransitionAt = useRef(0);
  useEffect(() => {
    if (reduceMotion) return undefined;
    const mql = window.matchMedia("(min-width: 1024px)");
    if (!mql.matches) return undefined;

    // Doubles as both "minimum time between advancing two slides" (so one
    // continuous trackpad swipe can't blow through several at once) AND
    // "minimum time a slide - including the last one - stays on screen
    // before release is even considered." Without that second part, the
    // very last tick of the same swipe that arrived on the final slide
    // would immediately continue past it into the page below, so the last
    // slide could flash by without ever really being seen.
    const DWELL_MS = 1100;

    const onWheel = (e) => {
      if (window.scrollY > 4) return; // already past the hero - never intercept
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      if (!scrollingDown && !scrollingUp) return;

      const now = Date.now();
      // A ref, not a plain local variable: this effect re-subscribes on
      // every activeIndex change (it's a dependency, since the handler
      // needs the current index in its closure), which is every single
      // time a transition fires - a variable declared inside the effect
      // body would reset right along with it, silently defeating the
      // cooldown after the very first tick. A ref is the one thing that
      // survives the re-subscribe.
      const withinDwell = now - lastWheelTransitionAt.current < DWELL_MS;

      const canAdvance = scrollingDown && activeIndex < slides.length - 1;
      const canGoBack = scrollingUp && activeIndex > 0;

      if (canAdvance || canGoBack) {
        e.preventDefault();
        if (withinDwell) return; // still settling from the last tick - swallow it without re-triggering
        lastWheelTransitionAt.current = now;
        pause(); // hand control to the user, stop competing with autoplay
        if (canAdvance) next(); else prev();
        return;
      }

      // At a boundary (last slide scrolling down, or first slide scrolling
      // up): hold position until this slide has had its own minimum dwell
      // time, same as any other transition would, before letting the
      // browser's native scroll take over and leave the hero.
      if (withinDwell) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeIndex, slides.length, reduceMotion, next, prev, pause]);

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.4, ease: "easeInOut" };

  const active = slides[activeIndex] || slides[0];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Horizon Solar & Exterior Care highlights"
      className="relative bg-[#02060c]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Screen-reader announcement of slide changes */}
      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}: {active.content.eyebrow}
      </p>

      {/* Visual stage - fixed height on desktop (lg:) so autoplay never causes
          a layout jump between slides there. On mobile/tablet, height is
          content-driven (min-h floor on each slide's own root below, not a
          rigid 100svh here) - a rigid viewport-height box combined with
          overflow-hidden was clipping copy on short viewports (confirmed via
          real device-emulation testing at ~369x491) whenever a slide's
          content needed more room than the viewport gave it. */}
      <div className="relative w-full lg:h-[92vh] overflow-hidden">
        {/* mode="wait" (not "sync"): the outgoing slide's exit animation
            finishes before the incoming one mounts, so at most one slide is
            ever in the DOM at a time. That's what lets the mobile height
            below be genuinely content-driven (an in-flow box can't size
            itself off two overlapping absolutely-positioned slides) - the
            trade-off is a brief sequential fade instead of a simultaneous
            crossfade, kept quick via the shorter transition below. */}
        <AnimatePresence mode="wait" initial={false}>
          {slides.map((slide, i) => {
            if (i !== activeIndex) return null;
            return (
              <motion.div
                key={slide.type}
                className="w-full lg:h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
              >
                {slide.type === "standard" && (
                  <SlideMain content={slide.content} onFormInteract={pause} onFormBlurAway={resume} />
                )}
                {slide.type === "before_after" && (
                  <SlideSolarBeforeAfter content={slide.content} onDragStart={pause} onDragEnd={resume} />
                )}
                {slide.type === "thermal" && <SlideThermal content={slide.content} />}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="hidden sm:flex absolute top-1/2 left-4 md:left-6 -translate-y-1/2 z-40 items-center justify-center w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="hidden sm:flex absolute top-1/2 right-4 md:right-6 -translate-y-1/2 z-40 items-center justify-center w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5">
              {slides.map((s, i) => (
                <button
                  key={s.type}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.content.eyebrow}`}
                  aria-current={i === activeIndex}
                  className={`rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] ${
                    i === activeIndex ? "w-7 h-2.5 bg-[#22d3ee]" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile: persistent quick-quote panel directly beneath the hero
          visual, in normal document flow (not overlaid on the photo) - so
          it's visible immediately after the hero regardless of which slide
          is active, with no risk of overlapping headline copy. */}
      <div className="lg:hidden bg-[#02060c] px-5 py-8">
        <HeroLeadForm onInteractionStart={pause} onInteractionEnd={resume} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Slide 1 - main hero + lead form                                        */
/* ---------------------------------------------------------------------- */
function SlideMain({ content, onFormInteract, onFormBlurAway }) {
  return (
    <div className="relative w-full min-h-[560px] lg:h-full">
      <picture>
        {content.mobileImageUrl && <source media="(max-width: 768px)" srcSet={content.mobileImageUrl} />}
        <img
          src={content.imageUrl}
          alt="Aerial view of a home with solar panels, ready for professional cleaning and inspection"
          loading="eager"
          // Lowercase, not fetchPriority: React 18.2 (pinned in this
          // project) doesn't recognise the camelCase prop yet and warns -
          // the lowercase form passes straight through as a plain DOM
          // attribute, which is all this needs.
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

      {/* lg:justify-between: copy stays pinned left, the form docks flush
          against this row's own right edge - copy is capped at max-w-xl so
          it never balloons to fill the gap, and any leftover width (wide
          monitors especially) becomes the gap between them rather than
          unused space trailing after the form. Without this, the form was
          positioned by flex-grow alone and settled with slack space after
          it, reading as "centered" on screens much wider than max-w-7xl. */}
      <div className="relative z-10 lg:h-full max-w-7xl mx-auto px-6 sm:px-20 md:px-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-28 pb-10 lg:py-0">
        {/* Copy */}
        <div className="lg:flex-1 lg:max-w-xl">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">
            {content.eyebrow}
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.08] tracking-tight">
            {content.heading}
            <br />
            <span className="text-[#22d3ee]">{content.subheading}</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-lg leading-relaxed">
            {content.description}
          </p>
          <div className="mt-7 flex items-center gap-5">
            <Link
              to={content.ctaUrl}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition"
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-white/40 text-sm hidden sm:inline">Same-day quotes • Sydney-wide</span>
          </div>
        </div>

        {/* Lead form - desktop only, sits to the right. On mobile it's
            rendered once, outside the slide stage entirely (see
            HeroCarousel below) so it can never overlap the headline text
            regardless of which slide is active or how tall the copy gets. */}
        <div className="hidden lg:block lg:flex-shrink-0">
          <HeroLeadForm onInteractionStart={onFormInteract} onInteractionEnd={onFormBlurAway} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Slide 2 - solar before/after                                           */
/* ---------------------------------------------------------------------- */
function SlideSolarBeforeAfter({ content, onDragStart, onDragEnd }) {
  return (
    <div className="relative w-full min-h-[560px] lg:h-full bg-[#03070d]">
      <div
        className="absolute inset-0"
        onPointerDown={onDragStart}
        onPointerUp={onDragEnd}
        onPointerLeave={onDragEnd}
      >
        <BeforeAfterComparison
          beforeImage={content.beforeImageUrl}
          afterImage={content.afterImageUrl}
          beforeMobileImage={content.mobileBeforeImageUrl}
          afterMobileImage={content.mobileAfterImageUrl}
          beforeAlt="Dirty, dust-covered solar panels before professional cleaning"
          afterAlt="The same solar array after professional cleaning, clear and reflective"
          beforeLabel="Before"
          afterLabel="After"
          frameClassName="absolute inset-0 h-full w-full select-none"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 pointer-events-none" />

      <div className="relative z-10 lg:h-full max-w-7xl mx-auto px-6 sm:px-20 md:px-24 flex flex-col lg:justify-end pb-16 lg:pb-28 pt-28 pointer-events-none">
        {/* pointer-events-auto used to sit on this whole block, so the CTA
            button stayed clickable - but that makes the block's entire
            bounding box (eyebrow through button, including all the empty
            space around the actual text/button) swallow pointer/touch
            events meant for the before/after slider underneath. On mobile,
            where this text stack isn't sharing width with anything else,
            that bounding box covers a large share of the touchable slide
            surface, which read as "the slider doesn't drag where there's
            text over it." Scoping pointer-events-auto down to just the
            actual interactive element (the CTA link) instead means the
            eyebrow/heading/paragraph go back to letting touches pass
            straight through to the slider, exactly like the transparent
            space around them already did. */}
        <div className="max-w-xl">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">
            {content.eyebrow}
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {content.heading} <span className="text-[#22d3ee]">{content.subheading}</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-lg">
            {content.description}
          </p>
          <div className="mt-6 pointer-events-auto inline-block">
            <Link
              to={content.ctaUrl}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition"
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Slide 3 - thermal drone inspection                                     */
/* ---------------------------------------------------------------------- */
function SlideThermal({ content }) {
  return (
    <div className="relative w-full min-h-[560px] lg:h-full">
      <picture>
        {content.mobileImageUrl && <source media="(max-width: 768px)" srcSet={content.mobileImageUrl} />}
        <img
          src={content.imageUrl}
          alt="Thermal drone scan of a solar array showing a heat-signature overlay"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/45" />

      <div className="relative z-10 lg:h-full max-w-7xl mx-auto px-6 sm:px-20 md:px-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-28 pb-16 lg:py-0">
        <div className="lg:flex-1 lg:max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[11px] font-semibold tracking-widest uppercase px-3 py-1.5">
            <Zap className="w-3.5 h-3.5" />
            {content.eyebrow}
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {content.heading} <span className="text-[#22d3ee]">{content.subheading}</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-lg">
            {content.description}
          </p>
          <div className="mt-6">
            <DroneTechnologyBadge />
          </div>
          <div className="mt-7">
            <Link
              to={content.ctaUrl}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#22d3ee] text-black font-semibold hover:bg-white transition"
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Floating info card - desktop only, mirrors the DroneTechnologyBadge
            copy with more homeowner-facing detail */}
        <div className="hidden lg:block lg:flex-shrink-0">
          <ThermalInfoCard title={content.thermalInfo?.title} bullets={content.thermalInfo?.bullets} />
        </div>
      </div>
    </div>
  );
}
