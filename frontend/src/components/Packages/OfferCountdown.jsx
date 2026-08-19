import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";

/**
 * isOfferActive
 * --------------
 * True only when endDate is a real, parseable, future timestamp. Used by
 * PackageCard to decide whether to show promo badges/pricing at all, not
 * just whether to render the ticking clock.
 */
export function isOfferActive(endDate) {
  if (!endDate) return false;
  const end = new Date(endDate).getTime();
  return Number.isFinite(end) && end > Date.now();
}

function getRemaining(endDate) {
  const end = new Date(endDate).getTime();
  const diff = Math.max(0, end - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { diff, days, hours, minutes };
}

const pad = (n) => String(n).padStart(2, "0");

/**
 * OfferCountdown
 * ----------------
 * Ticks down to a real, configurable `endDate` (ISO timestamp) - never a
 * timer that silently resets on reload. Once the deadline passes it renders
 * nothing, so callers should pair it with `isOfferActive()` to also hide
 * any surrounding "Limited Time Offer" messaging/badges.
 *
 *   <OfferCountdown endDate="2026-09-01T23:59:59+10:00" />
 */
export default function OfferCountdown({ endDate, className = "" }) {
  const [remaining, setRemaining] = useState(() => (endDate ? getRemaining(endDate) : null));

  useEffect(() => {
    if (!endDate) return undefined;
    setRemaining(getRemaining(endDate));
    // Minute-level display doesn't need a per-second tick.
    const interval = setInterval(() => setRemaining(getRemaining(endDate)), 30_000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!endDate || !remaining || remaining.diff <= 0) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#f79029]">
        <Timer className="w-3.5 h-3.5" />
        Limited Time Offer
      </span>
      <span className="font-mono text-sm font-semibold text-white tabular-nums">
        {pad(remaining.days)} DAYS : {pad(remaining.hours)} HRS : {pad(remaining.minutes)} MIN
      </span>
    </div>
  );
}
