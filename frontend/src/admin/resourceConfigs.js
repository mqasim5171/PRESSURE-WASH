// src/admin/resourceConfigs.js
//
// Declarative table + form definitions for every simple CRUD module. Each
// config drives ResourceListPage - see admin/pages/ResourceListPage.jsx.
import React from "react";

const StatusBadge = ({ on, onLabel = "Published", offLabel = "Draft" }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${on ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
    {on ? onLabel : offLabel}
  </span>
);

export const servicesConfig = {
  key: "services",
  title: "Services",
  singular: "Service",
  allowDuplicate: true,
  searchPlaceholder: "Search services...",
  columns: [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug", render: (i) => <code className="text-xs text-slate-500">{i.slug}</code> },
    { key: "isPrimary", label: "Flagship", render: (i) => (i.isPrimary ? <StatusBadge on onLabel={`#${i.primaryOrder}`} /> : "—") },
    { key: "published", label: "Status", render: (i) => <StatusBadge on={i.published} /> },
  ],
  emptyDefaults: { name: "", slug: "", shortDescription: "", fullDescription: "", icon: "", features: [], ctaLabel: "Get a Free Quote", ctaUrl: "/contact", isPrimary: false, primaryOrder: null, displayOrder: 0, published: true },
  fields: [
    { name: "name", label: "Service Name", required: true },
    { name: "slug", label: "URL Slug", helpText: "Leave blank to auto-generate from the name." },
    { name: "shortDescription", label: "Short Description", type: "textarea", rows: 2, fullWidth: true },
    { name: "fullDescription", label: "Full Description", type: "textarea", rows: 5, fullWidth: true },
    { name: "thumbnailMediaId", label: "Thumbnail Image", type: "image", urlField: "thumbnailUrl", category: "services" },
    { name: "bannerMediaId", label: "Banner Image", type: "image", urlField: "bannerUrl", category: "services" },
    { name: "startingPrice", label: "Starting Price ($)", type: "number" },
    { name: "features", label: "Features", type: "array", fullWidth: true, placeholder: "e.g. Drone-powered access" },
    { name: "ctaLabel", label: "CTA Label" },
    { name: "ctaUrl", label: "CTA URL" },
    { name: "isPrimary", label: "Flagship service (Solar / Roof / Concrete)", type: "boolean" },
    { name: "primaryOrder", label: "Priority Order (1 = highest)", type: "number" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "seoTitle", label: "SEO Title", fullWidth: true },
    { name: "seoDescription", label: "SEO Description", type: "textarea", rows: 2, fullWidth: true },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const packagesConfig = {
  key: "packages",
  title: "Packages",
  singular: "Package",
  allowDuplicate: true,
  searchPlaceholder: "Search packages...",
  columns: [
    { key: "name", label: "Name" },
    { key: "tagline", label: "Tagline" },
    { key: "offerPrice", label: "Price", render: (i) => (i.offerPrice != null ? `$${i.offerPrice}` : "Custom quote") },
    { key: "featured", label: "Featured", render: (i) => <StatusBadge on={i.featured} onLabel="Featured" offLabel="—" /> },
    { key: "published", label: "Status", render: (i) => <StatusBadge on={i.published} /> },
  ],
  emptyDefaults: { name: "", slug: "", tagline: "", features: [], ctaLabel: "Get This Package", ctaUrl: "/contact", displayOrder: 0, published: true, featured: false, serviceIds: [] },
  fields: [
    { name: "name", label: "Package Name", required: true },
    { name: "slug", label: "URL Slug", helpText: "Leave blank to auto-generate." },
    { name: "tagline", label: "Tagline (one-line benefit)", fullWidth: true },
    { name: "packageImageMediaId", label: "Package Image", type: "image", urlField: "packageImageUrl", category: "packages" },
    { name: "features", label: "What's Included", type: "array", fullWidth: true, placeholder: "e.g. 12+ Point Solar Health Check" },
    { name: "excludedFeatures", label: "Not Included (optional)", type: "array", fullWidth: true },
    { name: "badge", label: "Badge (e.g. Most Popular)" },
    { name: "originalPrice", label: "Was Price ($)", type: "number" },
    { name: "offerPrice", label: "Now Price ($)", type: "number" },
    { name: "offerEndDate", label: "Offer Ends", type: "datetime", helpText: "Leave blank for no time-limited offer." },
    { name: "ctaLabel", label: "CTA Label" },
    { name: "ctaUrl", label: "CTA URL" },
    { name: "serviceIds", label: "Linked Services", type: "services", fullWidth: true },
    { name: "featured", label: "Featured (highlighted on the packages page)", type: "boolean" },
    { name: "recommended", label: "Recommended", type: "boolean" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const bundlesConfig = {
  key: "bundles",
  title: "Service Bundles",
  singular: "Bundle",
  searchPlaceholder: "Search bundles...",
  columns: [
    { key: "name", label: "Name" },
    { key: "badge", label: "Badge" },
    { key: "published", label: "Status", render: (i) => <StatusBadge on={i.published} /> },
  ],
  emptyDefaults: { name: "", badge: "", includes: [], ctaLabel: "Get This Bundle", ctaUrl: "/contact", displayOrder: 0, published: true },
  fields: [
    { name: "name", label: "Bundle Name", required: true },
    { name: "badge", label: "Badge (e.g. Best Value)" },
    { name: "includes", label: "What's Included", type: "array", fullWidth: true },
    { name: "originalPrice", label: "Was Price ($)", type: "number" },
    { name: "offerPrice", label: "Now Price ($)", type: "number" },
    { name: "offerEndDate", label: "Offer Ends", type: "datetime" },
    { name: "ctaLabel", label: "CTA Label" },
    { name: "ctaUrl", label: "CTA URL" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const reviewsConfig = {
  key: "reviews",
  title: "Reviews",
  singular: "Review",
  searchPlaceholder: "Search reviews...",
  columns: [
    { key: "customerName", label: "Customer" },
    { key: "rating", label: "Rating", render: (i) => "★".repeat(i.rating) },
    { key: "location", label: "Location" },
    { key: "featured", label: "Featured", render: (i) => <StatusBadge on={i.featured} onLabel="Featured" offLabel="—" /> },
    { key: "published", label: "Status", render: (i) => <StatusBadge on={i.published} /> },
  ],
  emptyDefaults: { customerName: "", reviewText: "", rating: 5, location: "", source: "Google", featured: false, published: true, displayOrder: 0 },
  fields: [
    { name: "customerName", label: "Customer Name", required: true },
    { name: "reviewText", label: "Review", type: "textarea", rows: 4, required: true, fullWidth: true },
    { name: "rating", label: "Rating (1-5)", type: "number" },
    { name: "avatarMediaId", label: "Customer Photo (optional)", type: "image", urlField: "avatarUrl", category: "reviews" },
    { name: "serviceUsed", label: "Service Used" },
    { name: "location", label: "Location" },
    { name: "source", label: "Source" },
    { name: "reviewDate", label: "Review Date", type: "date" },
    { name: "featured", label: "Featured on homepage", type: "boolean" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const faqsConfig = {
  key: "faqs",
  title: "FAQs",
  singular: "FAQ",
  searchPlaceholder: "Search FAQs...",
  columns: [
    { key: "question", label: "Question" },
    { key: "category", label: "Category" },
    { key: "published", label: "Status", render: (i) => <StatusBadge on={i.published} /> },
  ],
  emptyDefaults: { question: "", answer: "", category: "General", displayOrder: 0, published: true },
  fields: [
    { name: "question", label: "Question", required: true, fullWidth: true },
    { name: "answer", label: "Answer", type: "textarea", rows: 4, required: true, fullWidth: true },
    { name: "category", label: "Category" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const areasConfig = {
  key: "areas",
  title: "Service Areas",
  singular: "Area",
  searchPlaceholder: "Search areas...",
  columns: [
    { key: "city", label: "Area" },
    { key: "state", label: "State" },
    { key: "active", label: "Status", render: (i) => <StatusBadge on={i.active} onLabel="Active" offLabel="Inactive" /> },
  ],
  emptyDefaults: { city: "", region: "", state: "NSW", tagline: "", zipCodes: [], coverageDetails: [], description: "", active: true, displayOrder: 0 },
  fields: [
    { name: "city", label: "Area Name", required: true },
    { name: "slug", label: "URL Slug", helpText: "Leave blank to auto-generate from the area name." },
    { name: "region", label: "Region" },
    { name: "state", label: "State" },
    { name: "tagline", label: "Tagline", fullWidth: true },
    { name: "zipCodes", label: "Postcodes", type: "array", placeholder: "e.g. 2026" },
    { name: "description", label: "Description", type: "textarea", rows: 3, fullWidth: true },
    { name: "coverageDetails", label: "Suburb Breakdown", type: "pairArray", fullWidth: true },
    { name: "lat", label: "Latitude (optional)", type: "number" },
    { name: "lng", label: "Longitude (optional)", type: "number" },
    { name: "imageMediaId", label: "Image (optional)", type: "image", urlField: "imageUrl", category: "areas" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "active", label: "Active", type: "boolean" },
  ],
};

export const beforeAfterConfig = {
  key: "before-after",
  title: "Before & After Results",
  singular: "Result",
  searchPlaceholder: "Search results...",
  columns: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "published", label: "Status", render: (i) => <StatusBadge on={i.published} /> },
  ],
  emptyDefaults: { title: "", category: "solar", description: "", location: "", ctaLabel: "", ctaUrl: "", displayOrder: 0, published: true },
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "category", label: "Category", type: "select", options: [{ value: "solar", label: "Solar" }, { value: "roof", label: "Roof" }, { value: "concrete", label: "Concrete" }] },
    { name: "beforeMediaId", label: "Before Image (Desktop)", type: "image", urlField: "beforeUrl", category: "before-after" },
    { name: "afterMediaId", label: "After Image (Desktop)", type: "image", urlField: "afterUrl", category: "before-after" },
    { name: "mobileBeforeMediaId", label: "Before Image (Mobile, optional)", type: "image", urlField: "mobileBeforeUrl", category: "before-after", helpText: "Portrait crop (4:5 or 9:16). Falls back to the desktop image if left blank." },
    { name: "mobileAfterMediaId", label: "After Image (Mobile, optional)", type: "image", urlField: "mobileAfterUrl", category: "before-after", helpText: "Portrait crop (4:5 or 9:16). Falls back to the desktop image if left blank." },
    { name: "description", label: "Description", type: "textarea", rows: 2, fullWidth: true },
    { name: "location", label: "Location" },
    { name: "resultMetric", label: "Result Metric (optional)", placeholder: "e.g. +28% output" },
    { name: "ctaLabel", label: "CTA Label" },
    { name: "ctaUrl", label: "CTA URL" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const heroConfig = {
  key: "hero",
  title: "Hero Slides",
  singular: "Slide",
  searchPlaceholder: "Search slides...",
  columns: [
    { key: "heading", label: "Heading" },
    { key: "slideType", label: "Type" },
    { key: "displayOrder", label: "Order" },
    { key: "enabled", label: "Status", render: (i) => <StatusBadge on={i.enabled} onLabel="Enabled" offLabel="Disabled" /> },
  ],
  emptyDefaults: { slideType: "standard", enabled: true, displayOrder: 0, eyebrow: "", heading: "", subheading: "", description: "", ctaLabel: "", ctaUrl: "" },
  fields: [
    { name: "slideType", label: "Slide Type", type: "select", options: [{ value: "standard", label: "Standard (image + headline)" }, { value: "before_after", label: "Before / After" }, { value: "thermal", label: "Thermal" }] },
    { name: "eyebrow", label: "Eyebrow / Badge Text", fullWidth: true },
    { name: "heading", label: "Headline", required: true },
    { name: "subheading", label: "Headline (accent part)" },
    { name: "description", label: "Supporting Copy", type: "textarea", rows: 3, fullWidth: true },
    { name: "imageMediaId", label: "Background Image (Desktop)", type: "image", urlField: "imageUrl", category: "hero", helpText: "Standard/Thermal slides. Landscape, at least 1920x1080." },
    { name: "mobileImageMediaId", label: "Background Image (Mobile, optional)", type: "image", urlField: "mobileImageUrl", category: "hero", helpText: "A separate portrait shot (4:5 or 9:16), not a crop of the desktop image. Falls back to the desktop image if left blank." },
    { name: "beforeImageMediaId", label: "Before Image - Desktop (before/after slide only)", type: "image", urlField: "beforeImageUrl", category: "hero" },
    { name: "afterImageMediaId", label: "After Image - Desktop (before/after slide only)", type: "image", urlField: "afterImageUrl", category: "hero" },
    { name: "mobileBeforeImageMediaId", label: "Before Image - Mobile, optional (before/after slide only)", type: "image", urlField: "mobileBeforeImageUrl", category: "hero", helpText: "Portrait crop (4:5 or 9:16). Falls back to the desktop image if left blank." },
    { name: "mobileAfterImageMediaId", label: "After Image - Mobile, optional (before/after slide only)", type: "image", urlField: "mobileAfterImageUrl", category: "hero", helpText: "Portrait crop (4:5 or 9:16). Falls back to the desktop image if left blank." },
    { name: "ctaLabel", label: "CTA Label" },
    { name: "ctaUrl", label: "CTA URL" },
    { name: "secondaryCtaLabel", label: "Secondary CTA Label" },
    { name: "secondaryCtaUrl", label: "Secondary CTA URL" },
    { name: "displayOrder", label: "Display Order", type: "number" },
    { name: "enabled", label: "Enabled", type: "boolean" },
  ],
};

export const blogConfig = {
  key: "blog",
  title: "Blog",
  singular: "Post",
  searchPlaceholder: "Search posts...",
  columns: [
    { key: "title", label: "Title" },
    { key: "status", label: "Status", render: (i) => <StatusBadge on={i.status === "published"} onLabel="Published" offLabel={i.status === "scheduled" ? "Scheduled" : "Draft"} /> },
    { key: "featured", label: "Featured", render: (i) => (i.featured ? "★" : "—") },
  ],
  emptyDefaults: { title: "", slug: "", excerpt: "", content: "", author: "Horizon Solar & Exterior Care", tags: [], status: "draft", featured: false },
  fields: [
    { name: "title", label: "Title", required: true, fullWidth: true },
    { name: "slug", label: "URL Slug", helpText: "Leave blank to auto-generate." },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, fullWidth: true },
    { name: "content", label: "Content", type: "richtext", required: true, fullWidth: true },
    { name: "featuredImageMediaId", label: "Featured Image", type: "image", urlField: "featuredImageUrl", category: "blog" },
    { name: "author", label: "Author" },
    { name: "tags", label: "Tags", type: "array" },
    { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "scheduled", label: "Scheduled" }, { value: "published", label: "Published" }] },
    { name: "scheduledAt", label: "Scheduled For", type: "datetime" },
    { name: "seoTitle", label: "SEO Title", fullWidth: true },
    { name: "metaDescription", label: "Meta Description", type: "textarea", rows: 2, fullWidth: true },
    { name: "featured", label: "Featured Post", type: "boolean" },
  ],
};
