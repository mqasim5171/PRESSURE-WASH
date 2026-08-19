// src/lib/packages.js
//
// Config-driven data for the Packages section (individual services +
// bundles). Deliberately ships with `originalPrice` / `offerPrice` /
// `offerEndDate` set to null - the brief this was built from was explicit
// that no real pricing exists yet, and a placeholder number would read to a
// visitor as a genuine live offer. PackageCard and OfferCountdown both
// handle null gracefully (quote-only CTA, no countdown rendered) so the
// site never shows an invented price.
//
// To go live with real pricing: fill in originalPrice/offerPrice (numbers,
// AUD) and offerEndDate (an ISO timestamp string, e.g.
// "2026-09-01T23:59:59+10:00") on any entry below. Leave offerEndDate null
// for a package with a fixed price and no time-limited promotion.

export const packages = [
  {
    id: "solar-care",
    slug: "solar-cleaning-maintenance",
    name: "Solar Care",
    tagline: "Bring Your Solar Back to Life",
    badge: "Flagship Service",
    image: "/images/solar.avif",
    originalPrice: null,
    offerPrice: null,
    offerEndDate: null,
    features: [
      "Professional drone-powered solar panel cleaning",
      "DJI Matrice 4T thermal drone scan",
      "12+ Point Solar Health Check",
      "Hotspot & soiling detection report",
    ],
    cta: { label: "View Solar Package", href: "/services/solar-cleaning-maintenance" },
  },
  {
    id: "roof-clean",
    slug: "roof-gutter-cleaning",
    name: "Roof Clean",
    tagline: "Moss, Lichen & Grime — Gone",
    badge: null,
    image: "/images/hero2.jpg",
    originalPrice: null,
    offerPrice: null,
    offerEndDate: null,
    features: [
      "Full roof surface clean",
      "Moss & lichen removal",
      "Weather staining treated",
      "Gutters cleared of debris",
    ],
    cta: { label: "View Roof Package", href: "/services/roof-gutter-cleaning" },
  },
  {
    id: "concrete-clean",
    slug: "concrete-cleaning",
    name: "Concrete Clean",
    tagline: "Driveways, Paths & Patios Refreshed",
    badge: null,
    image: "/images/pressure.png",
    originalPrice: null,
    offerPrice: null,
    offerEndDate: null,
    features: [
      "Driveways, paths & patios",
      "Built-up dirt & staining removed",
      "All concrete surface types",
      "Eco-friendly process",
    ],
    cta: { label: "View Concrete Package", href: "/services/concrete-cleaning" },
  },
];

export const bundles = [
  {
    id: "solar-care-bundle",
    name: "Solar Care",
    badge: null,
    includes: ["Solar Panel Cleaning", "DJI Matrice 4T Thermal Scan", "12+ Point Solar Health Check"],
    originalPrice: null,
    offerPrice: null,
    offerEndDate: null,
    cta: { label: "Get This Bundle", href: "/contact" },
  },
  {
    id: "home-exterior-bundle",
    name: "Home Exterior",
    badge: null,
    includes: ["Roof Cleaning", "Concrete Cleaning"],
    originalPrice: null,
    offerPrice: null,
    offerEndDate: null,
    cta: { label: "Get This Bundle", href: "/contact" },
  },
  {
    id: "complete-property-care-bundle",
    name: "Complete Property Care",
    badge: "Best Value",
    includes: ["Solar Panel Cleaning", "Thermal Scan", "Roof Cleaning", "Concrete Cleaning"],
    originalPrice: null,
    offerPrice: null,
    offerEndDate: null,
    cta: { label: "Get This Bundle", href: "/contact" },
  },
];
