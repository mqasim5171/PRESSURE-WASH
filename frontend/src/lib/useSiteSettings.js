import { biz } from "./config";
import { useCms } from "./useCms";
import { resolveMediaUrl } from "./media";

/**
 * useSiteSettings
 * -----------------
 * Returns a `biz`-shaped object (same fields Header/Footer/Contact already
 * use) sourced from Admin > Website Settings, falling back field-by-field
 * to the static lib/config.js values for anything not yet set in the CMS
 * (or while the API is still loading/unreachable).
 *
 * logoUrl/logoLightUrl/footerLogoUrl/faviconUrl default to null (not the
 * static /logo.png) so callers can tell "nothing uploaded yet" apart from
 * "an admin explicitly wants this logo" and fall back to their own local
 * asset themselves - see Header.jsx/Footer.jsx.
 */
export function useSiteSettings() {
  const { data } = useCms("/api/settings", null);
  if (!data) return { ...biz, logoUrl: null, logoLightUrl: null, footerLogoUrl: null, faviconUrl: null };

  return {
    ...biz,
    name: data.businessName || biz.name,
    phone: data.phone || biz.phone,
    email: data.email || biz.email,
    address: data.address || biz.address,
    hours: data.businessHours || biz.hours,
    socials: {
      facebook: data.socials?.facebook || biz.socials.facebook,
      instagram: data.socials?.instagram || biz.socials.instagram,
      tiktok: data.socials?.tiktok || biz.socials.tiktok,
      linkedin: data.socials?.linkedin || biz.socials.linkedin,
    },
    logoUrl: resolveMediaUrl(data.logoUrl) || null,
    logoLightUrl: resolveMediaUrl(data.logoLightUrl) || null,
    footerLogoUrl: resolveMediaUrl(data.footerLogoUrl) || null,
    faviconUrl: resolveMediaUrl(data.faviconUrl) || null,
  };
}
