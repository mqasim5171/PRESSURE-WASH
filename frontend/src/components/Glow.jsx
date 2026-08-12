/**
 * Glow
 * -----
 * A soft, blurred color blob used to break up flat dark section
 * backgrounds. Positioned absolutely by the caller via className
 * (the section wrapper needs `relative overflow-hidden`).
 *
 *   <Section className="relative overflow-hidden ...">
 *     <Glow color="#22d3ee" className="w-[520px] h-[520px] -top-52 -right-40" />
 *     ...
 *   </Section>
 */
export default function Glow({ color = "#22d3ee", opacity = 0.08, className = "" }) {
  return (
    <div
      aria-hidden
      // Smaller blur radius on mobile - a large blur filter is expensive to
      // sample on weaker GPUs, and these already sit at low opacity so the
      // softness difference barely registers on a small screen.
      className={`absolute rounded-full blur-[60px] sm:blur-[130px] pointer-events-none ${className}`}
      style={{ background: color, opacity }}
    />
  );
}
