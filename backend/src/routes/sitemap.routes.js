const express = require("express");
const { Service, Package, Bundle, BlogPost, ServiceArea } = require("../models");
const { asyncHandler } = require("../middleware/errorHandler");

const SITE_URL = "https://horizonsolar.com.au";

// Generated from live CMS content on every request (this is a small,
// infrequent, cheap-to-query route - no caching layer needed for a site
// this size), so a service/package/blog post/area created in Admin is in
// the sitemap immediately, with no manual edit to a static XML file and no
// redeploy. Registered in server.js BEFORE the static-file middleware so
// it wins over the old hand-maintained public/sitemap.xml that used to
// ship in the build (same effective public URL, real content now).
const router = express.Router();

const urlEntry = (loc, { changefreq = "weekly", priority = "0.7", lastmod } = {}) => `  <url>
    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

router.get("/sitemap.xml", asyncHandler(async (req, res) => {
  const [services, packages, bundles, posts, areas] = await Promise.all([
    Service.findAll({ where: { published: true }, attributes: ["slug", "updatedAt"] }),
    Package.findAll({ where: { published: true }, attributes: ["slug", "updatedAt"] }),
    Bundle.findAll({ where: { published: true }, attributes: ["slug", "updatedAt"] }),
    BlogPost.findAll({ where: { status: "published" }, attributes: ["slug", "updatedAt"] }),
    // service_areas has timestamps disabled - no updatedAt column to select.
    ServiceArea.findAll({ where: { active: true }, attributes: ["slug"] }),
  ]);

  const entries = [
    urlEntry("/", { priority: "1.0" }),
    urlEntry("/services", { priority: "0.9" }),
    urlEntry("/areas", { priority: "0.8" }),
    urlEntry("/about", { priority: "0.6" }),
    urlEntry("/contact", { priority: "0.6" }),
    urlEntry("/blog", { priority: "0.7" }),
    ...services.map((s) => urlEntry(`/services/${s.slug}`, { priority: "0.8", lastmod: s.updatedAt })),
    ...packages.map((p) => urlEntry(`/packages/${p.slug}`, { priority: "0.8", lastmod: p.updatedAt })),
    ...bundles.filter((b) => b.slug).map((b) => urlEntry(`/packages/${b.slug}`, { priority: "0.8", lastmod: b.updatedAt })),
    ...posts.map((p) => urlEntry(`/blog/${p.slug}`, { priority: "0.6", lastmod: p.updatedAt })),
    ...areas.filter((a) => a.slug).map((a) => urlEntry(`/areas/${a.slug}`, { priority: "0.6", lastmod: a.updatedAt })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  res.type("application/xml").send(xml);
}));

module.exports = router;
