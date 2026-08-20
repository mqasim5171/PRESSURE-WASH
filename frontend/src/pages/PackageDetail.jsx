// src/pages/PackageDetail.jsx
//
// Dynamic package detail page - /packages/:slug. Mirrors ServiceDetail.jsx's
// visual language (dark sections, Glow accents, rounded cards, cyan accent)
// deliberately, so it reads as the same site rather than a bolted-on
// mini-app. Fully database-driven: looks the slug up in Package first (the
// "Individual Packages" grid), then Bundle (the "Combine services" grid) -
// both share this one URL namespace and one detail-page template, see
// lib/cmsAdapters.js's mapPackageDetail() for how the two different table
// shapes get normalised into one.
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, Star, Phone, Zap,
  Leaf, BadgeCheck, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";
import Meta from "../Meta";
import Glow from "../components/Glow";
import OfferCountdown, { isOfferActive } from "../components/Packages/OfferCountdown";
import { useCms } from "../lib/useCms";
import { mapPackageDetail } from "../lib/cmsAdapters";
import { submitLead } from "../lib/submitLead";

const Section = ({ tone = "dark", className = "", children }) => (
  <section className={`${tone === "dark" ? "bg-[#02060c]" : "bg-[#050910]"} border-b border-white/5 ${className}`}>
    <div className="mx-auto max-w-7xl px-6">{children}</div>
  </section>
);

const Pill = ({ children, icon: Icon }) => (
  <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-white/[0.04] border border-white/10 text-white/70">
    {Icon && <Icon className="w-4 h-4 text-[#22d3ee]" />}
    {children}
  </span>
);

/**
 * Price block shared by hero. originalPrice/offerPrice is a genuine manual
 * "before/after" price pair (already the site's real discount mechanism -
 * see backend/src/models/index.js's Package/Bundle originalPrice/offerPrice/
 * offerEndDate). When no offerBadge text is set, the savings badge is
 * computed from the two real numbers rather than left blank.
 */
function PriceBlock({ pkg }) {
  const offerActive = isOfferActive(pkg.offerEndDate);
  const hasDiscount = offerActive && typeof pkg.originalPrice === "number" && typeof pkg.offerPrice === "number" && pkg.offerPrice < pkg.originalPrice;
  const hasPrice = typeof pkg.offerPrice === "number" || typeof pkg.originalPrice === "number" || typeof pkg.price === "number";
  // Once the offer has expired (or was never active), the discounted
  // offerPrice must NOT keep showing on its own - only ever displayed
  // alongside its struck-through original as part of an active discount.
  // The normal price (price, or originalPrice as a plain number if that's
  // all that's set) takes over automatically, no manual admin step needed.
  const displayPrice = hasDiscount ? pkg.offerPrice : (pkg.price ?? pkg.originalPrice ?? pkg.offerPrice);
  const savings = hasDiscount
    ? (pkg.offerBadge || `SAVE ${Math.round((1 - pkg.offerPrice / pkg.originalPrice) * 100)}%`)
    : null;

  if (!hasPrice) {
    return <p className="text-white/60 text-lg">Custom pricing — get a free, no-obligation quote.</p>;
  }

  return (
    <div>
      {offerActive && (
        <div className="flex items-center gap-3 mb-2">
          {savings && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f79029]/15 border border-[#f79029]/30 text-[#f79029] text-xs font-bold tracking-wide uppercase px-3 py-1">
              {savings}
            </span>
          )}
          <OfferCountdown endDate={pkg.offerEndDate} />
        </div>
      )}
      <div className="flex items-baseline gap-3">
        {pkg.startingFrom && <span className="text-white/50 text-lg">From</span>}
        {hasDiscount && <span className="text-white/40 text-xl line-through">${pkg.originalPrice}</span>}
        <span className="text-5xl font-extrabold text-white">${displayPrice}</span>
        {pkg.unitLabel && <span className="text-white/50 text-lg">{pkg.unitLabel}</span>}
      </div>
    </div>
  );
}

/**
 * Compact inline quote form - same submitLead() helper every form on the
 * site uses, so this lands in Admin > Leads like everything else. Package
 * context (id, name, slug, the price actually shown, active offer) is
 * folded into the message rather than added as one-off Lead columns - the
 * same pattern lib/submitLead.js already uses for propertyType/
 * contactPreference.
 */
function PackageQuoteForm({ pkg }) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", suburb: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const offerActive = isOfferActive(pkg.offerEndDate);
    const displayPrice = pkg.offerPrice ?? pkg.price ?? pkg.originalPrice;
    const context = [
      `${pkg.kind === "bundle" ? "Bundle" : "Package"} enquiry: ${pkg.name}`,
      displayPrice != null ? `Displayed price: $${displayPrice}` : "Displayed price: custom quote",
      offerActive ? `Active offer: ${pkg.offerBadge || "limited-time discount"} (ends ${new Date(pkg.offerEndDate).toLocaleString()})` : null,
      `Source: ${window.location.href}`,
    ].filter(Boolean).join("\n");

    try {
      await submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        suburb: formData.suburb,
        // Lead.packageId is a real FK to the packages table - only set it
        // when this really is a Package, not a Bundle (Bundles have their
        // own separate id space, see backend/src/models/index.js).
        packageId: pkg.kind === "package" ? pkg.id : undefined,
        message: context,
        sourcePage: `Package Detail - ${pkg.name}`,
      });
      setStatus("success");
      setFormData({ name: "", phone: "", email: "", suburb: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 justify-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        Thanks! We've received your enquiry for {pkg.name} and will be in touch shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
      <input name="name" required placeholder="Your name" value={formData.name} onChange={handleChange}
        className="px-4 py-3 bg-white/[0.04] border border-white/15 rounded-xl text-white text-sm placeholder:text-white/35 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none sm:col-span-1" />
      <input name="phone" required type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange}
        className="px-4 py-3 bg-white/[0.04] border border-white/15 rounded-xl text-white text-sm placeholder:text-white/35 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none" />
      <input name="email" required type="email" placeholder="Email" value={formData.email} onChange={handleChange}
        className="px-4 py-3 bg-white/[0.04] border border-white/15 rounded-xl text-white text-sm placeholder:text-white/35 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none" />
      <input name="suburb" placeholder="Suburb (optional)" value={formData.suburb} onChange={handleChange}
        className="px-4 py-3 bg-white/[0.04] border border-white/15 rounded-xl text-white text-sm placeholder:text-white/35 focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent outline-none" />
      <button type="submit" disabled={status === "loading"}
        className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#22d3ee] text-black font-bold px-7 py-3.5 hover:bg-white transition-colors disabled:opacity-60">
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {pkg.ctaLabel}
      </button>
      {status === "error" && (
        <p className="sm:col-span-2 flex items-center gap-2 text-red-400 text-xs justify-center">
          <AlertCircle className="w-4 h-4" /> Something went wrong. Please call us directly on 02 8000 1080.
        </p>
      )}
    </form>
  );
}

export default function PackageDetail() {
  const { slug } = useParams();
  // Fetched in parallel (not "try package, then try bundle") - useCms has
  // no way to conditionally skip a fetch without passing it a changing
  // `path` (null -> a real path), which would just trigger a second fetch
  // later instead of avoiding one. Two small requests in parallel is
  // simpler and no slower than one request followed by a conditional
  // second one.
  const { data: apiPackage, loading: loadingPackage } = useCms(`/api/packages/${slug}`, null);
  const { data: apiBundle, loading: loadingBundle } = useCms(`/api/bundles/${slug}`, null);

  const loading = loadingPackage || loadingBundle;
  const pkg = apiPackage
    ? mapPackageDetail(apiPackage, "package")
    : apiBundle
      ? mapPackageDetail(apiBundle, "bundle")
      : null;

  const title = pkg
    ? (pkg.seoTitle || `${pkg.name} Sydney | Horizon Solar & Exterior Care`)
    : "Packages | Horizon Solar & Exterior Care";
  const desc = pkg
    ? (pkg.seoDescription || pkg.shortDescription || `${pkg.name} - professional service across Sydney.`)
    : "Solar, roof and concrete cleaning packages across Sydney.";
  const canon = pkg ? `/packages/${pkg.slug}` : "/packages";

  if (!pkg && loading) {
    return (
      <main className="pt-24 bg-[#02060c] min-h-screen">
        <Section className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-[#22d3ee] rounded-full animate-spin" />
        </Section>
      </main>
    );
  }

  if (!pkg) {
    return (
      <>
        <Meta title={title} desc={desc} path={canon} />
        <main className="pt-24 bg-[#02060c] min-h-screen">
          <Section className="py-24 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Package Not Found</h1>
            <p className="text-white/60 mb-6">The package you're looking for doesn't exist.</p>
            <Link to="/#packages" className="inline-flex items-center gap-2 text-[#22d3ee] hover:text-white font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Packages
            </Link>
          </Section>
        </main>
      </>
    );
  }

  // Real price only - schema.org/Google structured-data guidelines
  // explicitly warn against fake/placeholder pricing, and most packages
  // are genuinely "custom quote" (no fixed number) until an admin sets
  // one. The offers block is simply omitted rather than filled with a
  // guessed value when there's nothing real to report.
  const displayPrice = pkg.offerPrice ?? pkg.price ?? pkg.originalPrice;
  const offerActive = isOfferActive(pkg.offerEndDate);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: pkg.name,
    name: pkg.name,
    description: desc,
    image: pkg.imageUrl || undefined,
    provider: {
      "@type": "LocalBusiness",
      name: "Horizon Solar & Exterior Care",
      url: "https://horizonsolar.com.au",
      telephone: "+61-2-8000-1080",
      areaServed: "Sydney, NSW, Australia",
    },
    ...(typeof displayPrice === "number" ? {
      offers: {
        "@type": "Offer",
        price: displayPrice,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        url: `https://horizonsolar.com.au${canon}`,
        ...(offerActive && pkg.offerEndDate ? { priceValidUntil: new Date(pkg.offerEndDate).toISOString().slice(0, 10) } : {}),
      },
    } : {}),
  };

  return (
    <>
      <Meta title={title} desc={desc} path={canon} image={pkg.imageUrl}>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Meta>

      <main className="pt-24 bg-[#02060c]">
        {/* HERO */}
        <Section className="relative overflow-hidden pt-10 pb-20">
          <Glow color="#22d3ee" className="w-[480px] h-[480px] -top-32 -right-32" />
          <div className="relative mb-6">
            <Link to="/#packages" className="inline-flex items-center gap-2 text-[#22d3ee] hover:text-white font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Packages
            </Link>
          </div>

          <div className="text-center mb-6">
            {pkg.badge && (
              <span className="inline-flex items-center gap-1.5 text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">
                <Star className="w-3.5 h-3.5 fill-current" /> {pkg.badge}
              </span>
            )}
            <h1 className="mt-3 text-5xl md:text-6xl font-extrabold tracking-tight text-white">{pkg.name}</h1>
            {pkg.tagline && <p className="text-xl text-white/60 mt-3">{pkg.tagline}</p>}
          </div>

          {pkg.imageUrl && (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 mb-10">
              <picture>
                {pkg.mobileImageUrl && <source media="(max-width: 768px)" srcSet={pkg.mobileImageUrl} />}
                <div className="relative h-[380px] md:h-[460px]">
                  <img src={pkg.imageUrl} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              </picture>
            </div>
          )}

          <div className="max-w-xl mx-auto text-center">
            <PriceBlock pkg={pkg} />
            <a href="#get-quote" className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 bg-[#22d3ee] text-black font-bold hover:bg-white transition-colors">
              {pkg.ctaLabel} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Section>

        {/* OVERVIEW */}
        {(pkg.shortDescription || pkg.fullDescription) && (
          <Section tone="alt" className="py-16">
            <div className="max-w-3xl mx-auto text-center">
              {pkg.shortDescription && <p className="text-xl text-white/80 leading-relaxed">{pkg.shortDescription}</p>}
              {pkg.fullDescription && <p className="text-white/60 mt-4 leading-relaxed">{pkg.fullDescription}</p>}
            </div>
          </Section>
        )}

        {/* SERVICES INCLUDED - real linked Service records (Packages only) */}
        {pkg.services.length > 0 && (
          <Section className="py-16">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Services Included</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {pkg.services.map((s) => (
                <Link
                  key={s.slug || s.id}
                  to={`/services/${s.slug}`}
                  className="rounded-2xl p-5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition flex items-center justify-between gap-3"
                >
                  <span className="font-semibold text-white">{s.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#22d3ee] flex-shrink-0" />
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* INCLUSIONS / EXCLUSIONS */}
        {(pkg.features.length > 0 || pkg.excludedFeatures.length > 0) && (
          <Section tone="alt" className="py-16">
            <div className={`grid gap-10 max-w-5xl mx-auto ${pkg.excludedFeatures.length ? "md:grid-cols-2" : ""}`}>
              {pkg.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>
                  <ul className="space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-white/80">
                        <CheckCircle className="w-5 h-5 text-[#22d3ee] flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.excludedFeatures.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Not Included</h2>
                  <ul className="space-y-3">
                    {pkg.excludedFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-white/50">
                        <XCircle className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* WHY CHOOSE - same trust pills ServiceDetail uses, real/generic
            claims only, nothing package-specific fabricated. */}
        <Section className="py-16">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Pill icon={Star}>5.0 rating</Pill>
            <Pill icon={Zap}>Same-day available</Pill>
            <Pill icon={BadgeCheck}>100% Satisfaction</Pill>
            <Pill icon={Leaf}>Eco-friendly</Pill>
          </div>
        </Section>

        {/* CTA / QUOTE FORM */}
        <Section tone="alt" className="py-20" id="get-quote">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">
              <h3 className="text-3xl font-bold mb-3 text-white">Get a Free Quote for {pkg.name}</h3>
              <p className="mb-7 text-white/60 text-lg">
                Fast response, no-obligation quote — same-day slots often available.
              </p>
              <PackageQuoteForm pkg={pkg} />
              <a href="tel:0280001080" className="mt-6 inline-flex items-center justify-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4" /> Or call 02 8000 1080
              </a>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
