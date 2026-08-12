import React, { useRef, useState, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import Section from "../ui/Section";
import Glow from "../Glow";

/**
 * BeforeAfterSlider
 * -------------------
 * Draggable comparison between a normal drone photo and the matching
 * thermal pass of the SAME roof (scene-5 / scene-6 of the drone sequence -
 * same house, same angle, so the reveal reads as one real scan rather than
 * two unrelated stock photos). Built with plain pointer events + a
 * clip-path reveal, no slider library.
 */
export default function BeforeAfterSlider() {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50); // percent revealed (thermal side)
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    updateFromClientX(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <Section className="relative overflow-hidden bg-[#050910] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[440px] h-[440px] top-0 right-0" />
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Visual vs Thermal</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            The same roof. A different story.
          </h2>
          <p className="text-white/60 mt-4 text-lg">
            Drag the handle. On the left, panels that look perfectly clean. On the right,
            the heat signature that reveals what a visual check alone would miss.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-white/10"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Base layer: normal drone photo */}
          <img
            src="/images/drone-sequence/scene-5-drone.webp"
            alt="Normal drone photo of a solar array"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Thermal layer, revealed by clip-path up to the handle position */}
          <div
            className="absolute inset-0 h-full w-full overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            <img
              src="/images/drone-sequence/scene-6-thermal.webp"
              alt="Thermal scan of the same solar array showing hotspots"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Labels */}
          <span className="absolute top-4 left-4 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
            Visual
          </span>
          <span className="absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5">
            Thermal
          </span>

          {/* Handle */}
          <div className="absolute inset-y-0 pointer-events-none" style={{ left: `${pos}%` }}>
            <div className="absolute inset-y-0 -translate-x-1/2 w-0.5 bg-white/70" />
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#0a0f1a] border border-white/30 flex items-center justify-center shadow-xl">
              <MoveHorizontal className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
