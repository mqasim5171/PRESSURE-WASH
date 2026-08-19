import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";
import OfferCountdown, { isOfferActive } from "./OfferCountdown";

/**
 * PackageCard
 * -------------
 * Shared card for both individual service packages and multi-service
 * bundles. Price block only renders real, supplied numbers - with no
 * originalPrice/offerPrice it falls back to a plain "Request a custom
 * quote" CTA rather than showing a blank or fabricated price.
 */
export default function PackageCard({
  name,
  tagline,
  badge,
  image,
  features = [],
  originalPrice,
  offerPrice,
  offerEndDate,
  cta,
  highlight = false,
}) {
  const offerActive = isOfferActive(offerEndDate);
  const hasPrice = typeof offerPrice === "number" || typeof originalPrice === "number";

  return (
    <div
      className={`relative flex flex-col rounded-3xl border overflow-hidden bg-white/[0.03] transition-colors ${
        highlight ? "border-[#22d3ee]/50 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]" : "border-white/10 hover:border-white/20"
      }`}
    >
      {badge && (
        <div className={`px-5 py-2 text-center text-[11px] font-bold tracking-widest uppercase ${
          highlight ? "bg-[#22d3ee] text-black" : "bg-white/10 text-white/80"
        }`}>
          <span className="inline-flex items-center gap-1.5">
            {highlight && <Star className="w-3 h-3 fill-current" />}
            {badge}
          </span>
        </div>
      )}

      {image && (
        <div className="relative h-40 w-full">
          <img src={image} alt={name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03070d] to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        {tagline && <p className="text-white/60 text-sm mt-1">{tagline}</p>}

        {features.length > 0 && (
          <ul className="mt-4 space-y-2 flex-1">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-[#22d3ee] mt-0.5 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Price / offer area */}
        <div className="mt-6 pt-5 border-t border-white/10">
          {offerActive && <OfferCountdown endDate={offerEndDate} className="mb-3" />}

          {hasPrice ? (
            <div className="flex items-baseline gap-3">
              {/* offerActive gates this, not just "is offerPrice lower" -
                  otherwise an expired offer keeps showing its discounted
                  price forever instead of reverting to originalPrice. */}
              {offerActive && typeof originalPrice === "number" && typeof offerPrice === "number" && offerPrice < originalPrice && (
                <span className="text-white/40 text-sm line-through">${originalPrice}</span>
              )}
              <span className="text-2xl font-extrabold text-white">
                ${offerActive && typeof offerPrice === "number" ? offerPrice : (originalPrice ?? offerPrice)}
              </span>
            </div>
          ) : (
            <p className="text-white/50 text-sm">Custom pricing — get a free, no-obligation quote.</p>
          )}
        </div>

        {cta && (
          <Link
            to={cta.href}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 bg-[#22d3ee] text-black text-sm font-bold uppercase tracking-wide hover:bg-white transition-colors"
          >
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
