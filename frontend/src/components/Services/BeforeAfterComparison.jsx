import React, { useRef, useState, useCallback, useEffect } from "react";
import { MoveHorizontal, MoveVertical } from "lucide-react";

/**
 * BeforeAfterComparison
 * -----------------------
 * Reusable draggable before/after reveal, generalised from the original
 * thermal-vs-visual slider so it can be reused for solar, roof and concrete
 * transformations. Two real image assets in, not a CSS filter trick.
 *
 * - Pointer-driven drag (mouse + touch, via native Pointer Events)
 * - Horizontal (left/right) on desktop, vertical (up/down) on mobile by
 *   default - portrait photos read better with a top/bottom reveal than a
 *   left/right one, and it's what people expect from a one-thumb swipe on a
 *   phone. This is real Y-axis pointer tracking against the element's own
 *   bounding rect (clientY / rect.top / rect.height), not a CSS rotation of
 *   the horizontal version - the clip-path, handle position and keyboard
 *   axis are all genuinely different for the two orientations.
 * - `orientation` can be forced explicitly ("horizontal" | "vertical");
 *   left at the default ("auto") it switches at the `mobileBreakpoint` via
 *   matchMedia, re-evaluated on resize/rotate.
 * - Keyboard accessible: focus the handle, use the arrow keys matching the
 *   active axis (Home/End always jump to the ends)
 * - Falls back to a clearly-labelled placeholder card instead of a broken
 *   image if an asset hasn't been supplied yet
 * - Optional dedicated mobile image pair (beforeMobileImage/afterMobileImage)
 *   - a real separate portrait asset, not a crop of the desktop photo. Falls
 *     back to the desktop pair (object-cover) when not supplied.
 */
function ComparisonImage({ src, mobileSrc, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-2 bg-white/[0.04] border border-dashed border-white/15 text-center px-6`}>
        <span className="text-white/30 text-xs font-semibold tracking-widest uppercase">Image needed</span>
        <span className="text-white/50 text-sm break-all">{src}</span>
      </div>
    );
  }

  return (
    <picture>
      {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        className={className}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

function useOrientation(forced, mobileBreakpoint) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < mobileBreakpoint
  );

  useEffect(() => {
    if (forced !== "auto") return undefined;
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [forced, mobileBreakpoint]);

  if (forced === "horizontal") return "horizontal";
  if (forced === "vertical") return "vertical";
  return isMobile ? "vertical" : "horizontal";
}

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeMobileImage,
  afterMobileImage,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  initialPosition = 50,
  aspectClassName = "aspect-[16/9]",
  className = "",
  // Full override for the outer frame's classes (used when this needs to
  // fill an existing full-bleed container edge-to-edge, e.g. inside the
  // hero carousel, instead of rendering as its own rounded bordered card).
  frameClassName,
  // "auto" (default) = horizontal on desktop, vertical below mobileBreakpoint.
  // Pass "horizontal" / "vertical" to force one regardless of viewport.
  orientation = "auto",
  mobileBreakpoint = 768,
}) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(initialPosition);
  const dragging = useRef(false);
  const active = useOrientation(orientation, mobileBreakpoint);
  const isVertical = active === "vertical";

  // Raw pointermove fires far more often than the screen can repaint
  // (well over 60/sec on many touch devices) - calling setPos() straight
  // from every event queues a React render per event, which is what read
  // as "laggy"/trailing on a real phone (the visual update always chasing
  // a backlog of renders, never actually caught up to the finger).
  // Coalescing to one setPos() per animation frame - store just the
  // latest pointer position in a ref, let a single rAF per frame read it -
  // caps this at the display's real refresh rate regardless of how many
  // pointer events land in between.
  const latestPoint = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const updateFromPoint = useCallback((clientX, clientY) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = isVertical
      ? ((clientY - rect.top) / rect.height) * 100
      : ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, [isVertical]);

  const flushPending = useCallback(() => {
    rafId.current = null;
    updateFromPoint(latestPoint.current.x, latestPoint.current.y);
  }, [updateFromPoint]);

  const onPointerDown = (e) => {
    dragging.current = true;
    updateFromPoint(e.clientX, e.clientY);
    containerRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    latestPoint.current = { x: e.clientX, y: e.clientY };
    if (rafId.current == null) rafId.current = requestAnimationFrame(flushPending);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (containerRef.current?.hasPointerCapture?.(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e) => {
    const step = 5;
    const decKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const incKey = isVertical ? "ArrowDown" : "ArrowRight";
    if (e.key === decKey) { setPos((p) => Math.max(0, p - step)); e.preventDefault(); }
    else if (e.key === incKey) { setPos((p) => Math.min(100, p + step)); e.preventDefault(); }
    else if (e.key === "Home") { setPos(0); e.preventDefault(); }
    else if (e.key === "End") { setPos(100); e.preventDefault(); }
  };

  const clipPath = isVertical
    ? `inset(0 0 ${100 - pos}% 0)`
    : `inset(0 ${100 - pos}% 0 0)`;

  return (
    <div
      ref={containerRef}
      className={
        frameClassName ??
        `relative w-full ${aspectClassName} rounded-3xl overflow-hidden select-none border border-white/10 ${className}`
      }
      style={{ touchAction: "none", cursor: isVertical ? "ns-resize" : "ew-resize" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Base layer: after (fully cleaned) photo */}
      <ComparisonImage
        src={afterImage}
        mobileSrc={afterMobileImage}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Before layer, revealed by clip-path up to the handle position */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath }}
      >
        <ComparisonImage
          src={beforeImage}
          mobileSrc={beforeMobileImage}
          alt={beforeAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Labels - describe where each image genuinely sits. Horizontal:
          before is the left image, so "top-left" reads correctly. Vertical:
          before is the TOP image (see clipPath above - inset(0 0 X% 0)
          reveals from the top down), so a left/right pair at the same
          top-4 row would just be two badges side by side over the same
          (top) image, telling the user nothing about the reveal - before
          belongs top, after belongs bottom, matching the actual up/down
          drag. */}
      {isVertical ? (
        <>
          <span className="absolute top-4 left-4 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
            {beforeLabel}
          </span>
          <span className="absolute bottom-4 left-4 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
            {afterLabel}
          </span>
        </>
      ) : (
        <>
          <span className="absolute top-4 left-4 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
            {beforeLabel}
          </span>
          <span className="absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
            {afterLabel}
          </span>
        </>
      )}

      {/* Draggable handle - also a keyboard-focusable slider control */}
      {isVertical ? (
        <div className="absolute inset-x-0 pointer-events-none" style={{ top: `${pos}%` }}>
          <div className="absolute inset-x-0 -translate-y-1/2 h-0.5 bg-white/70" />
          <button
            type="button"
            role="slider"
            aria-label={`Reveal position between ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKeyDown}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0a0f1a] border border-white/30 flex items-center justify-center shadow-xl pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]"
          >
            <MoveVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : (
        <div className="absolute inset-y-0 pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 w-0.5 bg-white/70" />
          <button
            type="button"
            role="slider"
            aria-label={`Reveal position between ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0a0f1a] border border-white/30 flex items-center justify-center shadow-xl pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]"
          >
            <MoveHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
