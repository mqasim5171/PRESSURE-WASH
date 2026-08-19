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
    bullets: s.features?.length ? s.features : staticMatch?.bullets,
    healthCheck: staticMatch?.healthCheck,
    icon: s.icon,
    image: imageFor(s.slug, s.thumbnailUrl || s.bannerUrl),
    galleryImage: staticMatch?.galleryImage,
    ctaLabel: s.ctaLabel,
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
    features: p.features?.length ? p.features : staticMatch?.features || [],
    cta: { label: p.ctaLabel, href: p.ctaUrl },
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

export function mapBundle(b) {
  return {
    id: b.id,
    name: b.name,
    badge: b.badge,
    includes: b.includes || [],
    originalPrice: b.originalPrice != null ? Number(b.originalPrice) : null,
    offerPrice: b.offerPrice != null ? Number(b.offerPrice) : null,
    offerEndDate: b.offerEndDate || null,
    cta: { label: b.ctaLabel, href: b.ctaUrl },
  };
}
