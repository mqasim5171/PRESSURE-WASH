// src/lib/cmsAdapters.js
//
// Maps CMS API responses onto the exact shapes the existing (already-built,
// already-tested) public components expect, so wiring the site up to the
// database doesn't require rewriting every component's props. Each mapper
// merges in a matching static fallback entry (by slug) purely for image
// paths - the CMS has no uploaded image for content that was migrated from
// static source files, only for anything uploaded through Admin > Media
// afterwards. Text, pricing, publish state, and ordering always come from
// the CMS once it responds; only the image URL falls back to the static
// asset until a real one is uploaded.
import { copy } from "./copy";
import { packages as staticPackages } from "./packages";
import { resolveMediaUrl } from "./media";

function imageFor(slug, apiUrl) {
  if (apiUrl) return resolveMediaUrl(apiUrl);
  const staticService = copy.services.find((s) => s.slug === slug);
  return staticService?.image || null;
}

export function mapService(s) {
  const staticMatch = copy.services.find((x) => x.slug === s.slug);
  return {
    slug: s.slug,
    title: s.name,
    flagship: !!s.isPrimary,
    primary: s.primaryOrder,
    badge: s.isPrimary ? "Flagship Service" : undefined,
    catchline: staticMatch?.catchline,
    blurb: s.shortDescription,
    // Full Description is a real, admin-editable field (Admin > Services) -
    // ServiceDetail.jsx's subtitle prefers it over the short blurb, same as
    // it always preferred the static `long` field for legacy content.
    long: s.fullDescription || staticMatch?.long,
    bullets: s.features?.length ? s.features : staticMatch?.bullets,
    benefits: s.benefits?.length ? s.benefits : undefined,
    included: s.included?.length ? s.included : undefined,
    healthCheck: staticMatch?.healthCheck,
    icon: s.icon,
    image: imageFor(s.slug, s.thumbnailUrl || s.bannerUrl),
    galleryImage: staticMatch?.galleryImage,
    ctaLabel: s.ctaLabel,
    ctaUrl: s.ctaUrl,
    startingPrice: s.startingPrice != null ? Number(s.startingPrice) : undefined,
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    // Packages this service is included in (Service.belongsToMany(Package))
    // - used for internal linking on the service detail page.
    packages: Array.isArray(s.packages) ? s.packages : [],
  };
}

export function mapServices(apiServices) {
  if (!Array.isArray(apiServices) || apiServices.length === 0) return copy.services;
  return apiServices.map(mapService);
}

export function mapPackage(p) {
  const staticMatch = staticPackages.find((x) => x.slug === p.slug);
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    badge: p.badge || (p.featured ? "Flagship Service" : null),
    image: p.packageImageUrl ? resolveMediaUrl(p.packageImageUrl) : staticMatch?.image,
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
    offerPrice: p.offerPrice != null ? Number(p.offerPrice) : null,
    offerEndDate: p.offerEndDate || null,
    offerBadge: p.offerBadge || null,
    features: p.features?.length ? p.features : staticMatch?.features || [],
    // The card itself always links to the package's own detail page - the
    // admin-configured ctaLabel/ctaUrl are still respected, but ctaUrl is
    // now what the detail page's own CTA button/quote form target, not
    // where clicking the card goes (see PackageDetail.jsx).
    cta: { label: p.ctaLabel, href: `/packages/${p.slug}` },
  };
}

export function mapArea(a) {
  return {
    name: a.city,
    displayName: a.region && a.region !== a.city ? a.region : undefined,
    slug: a.slug,
    tagline: a.tagline,
    description: a.description,
    lat: a.lat != null ? Number(a.lat) : undefined,
    lng: a.lng != null ? Number(a.lng) : undefined,
    coverageDetails: a.coverageDetails,
    coverageSuburbs: (a.coverageDetails || []).map((d) => d.name),
  };
}

/**
 * mapPackageDetail
 * ------------------
 * Packages and Bundles are two different tables with mostly-parallel but
 * not identical fields (Bundles use `includes` where Packages use
 * `features`; only Packages have linked Services; etc.) - PackageDetail.jsx
 * looks a record up by slug in Package first, then Bundle, and needs one
 * consistent shape to render regardless of which table it came from. This
 * is that normalisation, kept in one place rather than duplicated in the
 * page component.
 */
export function mapPackageDetail(raw, kind) {
  const isPackage = kind === "package";
  return {
    kind,
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline || "",
    shortDescription: raw.shortDescription || "",
    fullDescription: raw.fullDescription || "",
    imageUrl: resolveMediaUrl(isPackage ? raw.packageImageUrl : raw.imageUrl) || null,
    mobileImageUrl: resolveMediaUrl(isPackage ? raw.packageMobileImageUrl : raw.mobileImageUrl) || null,
    price: isPackage && raw.price != null ? Number(raw.price) : null,
    startingFrom: isPackage ? !!raw.startingFrom : false,
    unitLabel: isPackage ? raw.unitLabel || "" : "",
    features: (isPackage ? raw.features : raw.includes) || [],
    excludedFeatures: raw.excludedFeatures || [],
    badge: raw.badge || "",
    originalPrice: raw.originalPrice != null ? Number(raw.originalPrice) : null,
    offerPrice: raw.offerPrice != null ? Number(raw.offerPrice) : null,
    offerEndDate: raw.offerEndDate || null,
    offerBadge: raw.offerBadge || "",
    ctaLabel: raw.ctaLabel || (isPackage ? "Get This Package" : "Get This Bundle"),
    ctaUrl: raw.ctaUrl || "/contact",
    services: isPackage && Array.isArray(raw.services) ? raw.services : [],
    seoTitle: raw.seoTitle || "",
    seoDescription: raw.seoDescription || "",
  };
}

export function mapBundle(b) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    badge: b.badge,
    image: resolveMediaUrl(b.imageUrl) || null,
    includes: b.includes || [],
    originalPrice: b.originalPrice != null ? Number(b.originalPrice) : null,
    offerPrice: b.offerPrice != null ? Number(b.offerPrice) : null,
    offerEndDate: b.offerEndDate || null,
    offerBadge: b.offerBadge || null,
    // Same rule as mapPackage: the card links to the bundle's own detail
    // page, not straight to ctaUrl (that's the detail page's own CTA/quote
    // form target instead). Bundles created before the slug column existed
    // are backfilled by migrateAdditive.js, so this should always be a
    // real slug in practice - falling back to "/#packages" only protects
    // against a genuinely missing slug rather than linking to a 404.
    cta: { label: b.ctaLabel, href: b.slug ? `/packages/${b.slug}` : "/#packages" },
  };
}
