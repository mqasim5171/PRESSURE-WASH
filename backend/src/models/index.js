// src/models/index.js
//
// All Sequelize models + associations for the CMS, in one file. With ~18
// fairly small models this stays more readable as one file than as 18 tiny
// ones that all just re-import each other for associations; split it out
// if/when any single model grows real business logic of its own.
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// ---------------------------------------------------------------------------
// Admin users
// ---------------------------------------------------------------------------
const AdminUser = sequelize.define("AdminUser", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  lastLoginAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: "admin_users" });

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------
const Media = sequelize.define("Media", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING(500), allowNull: false },
  storagePath: { type: DataTypes.STRING(500), allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  altText: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "" },
  width: { type: DataTypes.INTEGER, allowNull: true },
  height: { type: DataTypes.INTEGER, allowNull: true },
  sizeBytes: { type: DataTypes.INTEGER, allowNull: true },
  uploadedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: "media", timestamps: false });

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
const Service = sequelize.define("Service", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  shortDescription: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  fullDescription: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  thumbnailMediaId: { type: DataTypes.INTEGER, allowNull: true },
  bannerMediaId: { type: DataTypes.INTEGER, allowNull: true },
  icon: { type: DataTypes.STRING(64), defaultValue: "" },
  startingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  features: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  benefits: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  included: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  ctaLabel: { type: DataTypes.STRING(80), defaultValue: "Get a Free Quote" },
  ctaUrl: { type: DataTypes.STRING(255), defaultValue: "/contact" },
  seoTitle: { type: DataTypes.STRING(255), defaultValue: "" },
  seoDescription: { type: DataTypes.STRING(500), defaultValue: "" },
  isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
  primaryOrder: { type: DataTypes.INTEGER, allowNull: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: "services" });

// ---------------------------------------------------------------------------
// Packages + bundles
// ---------------------------------------------------------------------------
const Package = sequelize.define("Package", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  tagline: { type: DataTypes.STRING(255), defaultValue: "" },
  shortDescription: { type: DataTypes.TEXT, defaultValue: "" },
  fullDescription: { type: DataTypes.TEXT, defaultValue: "" },
  packageImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  // Separate portrait asset for the package detail page's mobile hero -
  // same reasoning as HeroSlide's mobile image fields: not a crop of the
  // desktop image, a deliberately different composition. Nullable - falls
  // back to packageImageUrl until one is uploaded.
  packageMobileImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  startingFrom: { type: DataTypes.BOOLEAN, defaultValue: false },
  unitLabel: { type: DataTypes.STRING(64), defaultValue: "" },
  features: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  excludedFeatures: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  badge: { type: DataTypes.STRING(80), defaultValue: "" },
  originalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  offerPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  offerEndDate: { type: DataTypes.DATE, allowNull: true },
  // Custom text for the discount badge (e.g. "WINTER SPECIAL") - when left
  // blank, the public page computes a plain "SAVE X%"/"SAVE $Y" from
  // originalPrice/offerPrice instead of forcing an admin to type one.
  offerBadge: { type: DataTypes.STRING(80), defaultValue: "" },
  ctaLabel: { type: DataTypes.STRING(80), defaultValue: "Get This Package" },
  ctaUrl: { type: DataTypes.STRING(255), defaultValue: "/contact" },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  recommended: { type: DataTypes.BOOLEAN, defaultValue: false },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  seoTitle: { type: DataTypes.STRING(255), defaultValue: "" },
  seoDescription: { type: DataTypes.STRING(500), defaultValue: "" },
}, { tableName: "packages" });

const PackageService = sequelize.define("PackageService", {
  packageId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "package_services", timestamps: false });

const Bundle = sequelize.define("Bundle", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // Nullable (existing rows predate this column) - backfilled once from
  // `name` on boot by migrateAdditive.js, then required for every new
  // bundle going forward via the admin route's own uniqueSlug() call.
  // Bundles now get the same /packages/:slug detail page as Packages do -
  // see routes/bundles.routes.js - rather than a second, parallel routing
  // scheme just because they're a different table.
  slug: { type: DataTypes.STRING(160), allowNull: true, unique: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  tagline: { type: DataTypes.STRING(255), defaultValue: "" },
  shortDescription: { type: DataTypes.TEXT, defaultValue: "" },
  fullDescription: { type: DataTypes.TEXT, defaultValue: "" },
  imageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  mobileImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  badge: { type: DataTypes.STRING(80), defaultValue: "" },
  includes: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  originalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  offerPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  offerEndDate: { type: DataTypes.DATE, allowNull: true },
  offerBadge: { type: DataTypes.STRING(80), defaultValue: "" },
  ctaLabel: { type: DataTypes.STRING(80), defaultValue: "Get This Bundle" },
  ctaUrl: { type: DataTypes.STRING(255), defaultValue: "/contact" },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  seoTitle: { type: DataTypes.STRING(255), defaultValue: "" },
  seoDescription: { type: DataTypes.STRING(500), defaultValue: "" },
}, { tableName: "bundles" });

// ---------------------------------------------------------------------------
// Leads - every public form submission
// ---------------------------------------------------------------------------
const Lead = sequelize.define("Lead", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: true },
  phone: { type: DataTypes.STRING(64), allowNull: true },
  address: { type: DataTypes.STRING(255), allowNull: true },
  suburb: { type: DataTypes.STRING(120), allowNull: true },
  zipCode: { type: DataTypes.STRING(20), allowNull: true },
  service: { type: DataTypes.STRING(200), allowNull: true },
  packageId: { type: DataTypes.INTEGER, allowNull: true },
  message: { type: DataTypes.TEXT, defaultValue: "" },
  sourcePage: { type: DataTypes.STRING(120), defaultValue: "" },
  status: {
    type: DataTypes.ENUM("new", "contacted", "qualified", "scheduled", "completed", "lost"),
    defaultValue: "new",
  },
  notes: { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "leads", indexes: [{ fields: ["status"] }, { fields: ["created_at"] }] });

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerName: { type: DataTypes.STRING(160), allowNull: false },
  reviewText: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 5, validate: { min: 1, max: 5 } },
  avatarMediaId: { type: DataTypes.INTEGER, allowNull: true },
  serviceUsed: { type: DataTypes.STRING(160), defaultValue: "" },
  location: { type: DataTypes.STRING(120), defaultValue: "" },
  source: { type: DataTypes.STRING(80), defaultValue: "Google" },
  reviewDate: { type: DataTypes.DATEONLY, allowNull: true },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: "reviews" });

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
const Faq = sequelize.define("Faq", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question: { type: DataTypes.STRING(500), allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING(80), defaultValue: "General" },
  relatedServiceId: { type: DataTypes.INTEGER, allowNull: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: "faqs" });

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------
const BlogCategory = sequelize.define("BlogCategory", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
}, { tableName: "blog_categories", timestamps: false });

const BlogPost = sequelize.define("BlogPost", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  excerpt: { type: DataTypes.TEXT, defaultValue: "" },
  // No defaultValue here deliberately: Sequelize's MySQL query generator
  // only recognises the exact type string "TEXT" (not "LONGTEXT") as a
  // BLOB/TEXT-family type that MySQL forbids a DDL default on, so a
  // defaultValue on this LONGTEXT column would make `sync()` emit
  // `DEFAULT ''` and MySQL would reject the CREATE TABLE outright. Content
  // is always supplied explicitly by blog.routes.js instead.
  content: { type: DataTypes.TEXT("long"), allowNull: false },
  featuredImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  author: { type: DataTypes.STRING(120), defaultValue: "Horizon Solar & Exterior Care" },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  tags: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  seoTitle: { type: DataTypes.STRING(255), defaultValue: "" },
  metaDescription: { type: DataTypes.STRING(500), defaultValue: "" },
  ogImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  status: { type: DataTypes.ENUM("draft", "scheduled", "published"), defaultValue: "draft" },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
  scheduledAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: "blog_posts" });

// ---------------------------------------------------------------------------
// Service areas
// ---------------------------------------------------------------------------
const ServiceArea = sequelize.define("ServiceArea", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  city: { type: DataTypes.STRING(160), allowNull: false },
  region: { type: DataTypes.STRING(160), defaultValue: "" },
  state: { type: DataTypes.STRING(10), defaultValue: "NSW" },
  tagline: { type: DataTypes.STRING(255), defaultValue: "" },
  zipCodes: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  // Suburb-level breakdown shown on the area detail page - array of
  // { name, note }. Kept as flexible JSON rather than a child table since
  // it's small, always edited as a whole list, and never queried on its
  // own.
  coverageDetails: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  lat: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
  lng: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  imageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: "service_areas", timestamps: false });

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------
const HeroSlide = sequelize.define("HeroSlide", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slideType: { type: DataTypes.ENUM("standard", "before_after", "thermal"), defaultValue: "standard" },
  enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  mobileImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  beforeImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  afterImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  // Separate portrait/mobile assets for the before/after slide - deliberately
  // NOT derived by cropping the desktop before/after images client-side, per
  // the standing instruction that mobile compositions are shot/selected
  // separately. Nullable: falls back to the desktop image (object-cover)
  // until an admin uploads a dedicated mobile pair.
  mobileBeforeImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  mobileAfterImageMediaId: { type: DataTypes.INTEGER, allowNull: true },
  eyebrow: { type: DataTypes.STRING(160), defaultValue: "" },
  heading: { type: DataTypes.STRING(255), defaultValue: "" },
  subheading: { type: DataTypes.STRING(255), defaultValue: "" },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  ctaLabel: { type: DataTypes.STRING(80), defaultValue: "" },
  ctaUrl: { type: DataTypes.STRING(255), defaultValue: "" },
  secondaryCtaLabel: { type: DataTypes.STRING(80), defaultValue: "" },
  secondaryCtaUrl: { type: DataTypes.STRING(255), defaultValue: "" },
  badgeText: { type: DataTypes.STRING(120), defaultValue: "" },
  thermalInfo: { type: DataTypes.JSON, allowNull: true },
}, { tableName: "hero_slides", timestamps: false });

// ---------------------------------------------------------------------------
// Before & after results
// ---------------------------------------------------------------------------
const BeforeAfterResult = sequelize.define("BeforeAfterResult", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category: { type: DataTypes.STRING(40), defaultValue: "solar" },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  beforeMediaId: { type: DataTypes.INTEGER, allowNull: true },
  afterMediaId: { type: DataTypes.INTEGER, allowNull: true },
  // Dedicated portrait assets for mobile - nullable, falls back to the
  // desktop before/after pair (object-cover) when not supplied.
  mobileBeforeMediaId: { type: DataTypes.INTEGER, allowNull: true },
  mobileAfterMediaId: { type: DataTypes.INTEGER, allowNull: true },
  location: { type: DataTypes.STRING(120), defaultValue: "" },
  resultMetric: { type: DataTypes.STRING(120), defaultValue: "" },
  ctaLabel: { type: DataTypes.STRING(80), defaultValue: "" },
  ctaUrl: { type: DataTypes.STRING(255), defaultValue: "" },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: "before_after_results", timestamps: false });

// ---------------------------------------------------------------------------
// Homepage sections (flexible JSON content per named section) + page content
// ---------------------------------------------------------------------------
const HomepageSection = sequelize.define("HomepageSection", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sectionKey: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  content: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
}, { tableName: "homepage_sections", timestamps: false });

const PageContent = sequelize.define("PageContent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pageKey: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  heading: { type: DataTypes.STRING(255), defaultValue: "" },
  intro: { type: DataTypes.TEXT, defaultValue: "" },
  heroMediaId: { type: DataTypes.INTEGER, allowNull: true },
  ctaLabel: { type: DataTypes.STRING(80), defaultValue: "" },
  ctaUrl: { type: DataTypes.STRING(255), defaultValue: "" },
  seoTitle: { type: DataTypes.STRING(255), defaultValue: "" },
  seoDescription: { type: DataTypes.STRING(500), defaultValue: "" },
  body: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
}, { tableName: "page_content", timestamps: false });

// ---------------------------------------------------------------------------
// Site settings + theme settings (singleton rows, id = 1)
// ---------------------------------------------------------------------------
const SiteSetting = sequelize.define("SiteSetting", {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  businessName: { type: DataTypes.STRING(200), defaultValue: "Horizon Solar & Exterior Care" },
  tagline: { type: DataTypes.STRING(255), defaultValue: "" },
  logoMediaId: { type: DataTypes.INTEGER, allowNull: true },
  logoLightMediaId: { type: DataTypes.INTEGER, allowNull: true },
  faviconMediaId: { type: DataTypes.INTEGER, allowNull: true },
  footerLogoMediaId: { type: DataTypes.INTEGER, allowNull: true },
  phone: { type: DataTypes.STRING(64), defaultValue: "" },
  email: { type: DataTypes.STRING(255), defaultValue: "" },
  address: { type: DataTypes.STRING(255), defaultValue: "" },
  businessHours: { type: DataTypes.STRING(255), defaultValue: "" },
  socials: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  mainCtaLabel: { type: DataTypes.STRING(80), defaultValue: "Get a Free Quote" },
  mainCtaUrl: { type: DataTypes.STRING(255), defaultValue: "/contact" },
  footerText: { type: DataTypes.TEXT, defaultValue: "" },
  copyrightText: { type: DataTypes.STRING(255), defaultValue: "" },
  emergencyCtaText: { type: DataTypes.STRING(255), defaultValue: "" },
}, { tableName: "site_settings", timestamps: false });

const ThemeSetting = sequelize.define("ThemeSetting", {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  primaryColor: { type: DataTypes.STRING(20), defaultValue: "#22d3ee" },
  secondaryColor: { type: DataTypes.STRING(20), defaultValue: "#f79029" },
  accentColor: { type: DataTypes.STRING(20), defaultValue: "#22d3ee" },
  backgroundColor: { type: DataTypes.STRING(20), defaultValue: "#02060c" },
  darkSectionColor: { type: DataTypes.STRING(20), defaultValue: "#03070d" },
  headingColor: { type: DataTypes.STRING(20), defaultValue: "#ffffff" },
  bodyTextColor: { type: DataTypes.STRING(20), defaultValue: "#a8b3c4" },
  buttonColor: { type: DataTypes.STRING(20), defaultValue: "#22d3ee" },
  buttonHoverColor: { type: DataTypes.STRING(20), defaultValue: "#ffffff" },
  borderColor: { type: DataTypes.STRING(30), defaultValue: "rgba(255,255,255,0.1)" },
}, { tableName: "theme_settings", timestamps: false });

// ---------------------------------------------------------------------------
// Associations
// ---------------------------------------------------------------------------
Package.belongsToMany(Service, { through: PackageService, foreignKey: "packageId", otherKey: "serviceId", as: "services" });
Service.belongsToMany(Package, { through: PackageService, foreignKey: "serviceId", otherKey: "packageId", as: "packages" });

Lead.belongsTo(Package, { foreignKey: "packageId", as: "package" });
Faq.belongsTo(Service, { foreignKey: "relatedServiceId", as: "relatedService" });
BlogPost.belongsTo(BlogCategory, { foreignKey: "categoryId", as: "category" });
BlogCategory.hasMany(BlogPost, { foreignKey: "categoryId", as: "posts" });

// Media relations - `constraints: false` since a media row being deleted
// shouldn't be blocked by/cascade into every place it's referenced; the
// media delete route explicitly checks usage first (see media.routes.js).
const mediaRef = (model, field) => model.belongsTo(Media, { foreignKey: field, constraints: false });
mediaRef(Service, "thumbnailMediaId");
mediaRef(Service, "bannerMediaId");
mediaRef(Package, "packageImageMediaId");
mediaRef(Package, "packageMobileImageMediaId");
mediaRef(Bundle, "imageMediaId");
mediaRef(Bundle, "mobileImageMediaId");
mediaRef(Review, "avatarMediaId");
mediaRef(BlogPost, "featuredImageMediaId");
mediaRef(BlogPost, "ogImageMediaId");
mediaRef(ServiceArea, "imageMediaId");
mediaRef(HeroSlide, "imageMediaId");
mediaRef(HeroSlide, "mobileImageMediaId");
mediaRef(HeroSlide, "beforeImageMediaId");
mediaRef(HeroSlide, "afterImageMediaId");
mediaRef(HeroSlide, "mobileBeforeImageMediaId");
mediaRef(HeroSlide, "mobileAfterImageMediaId");
mediaRef(BeforeAfterResult, "beforeMediaId");
mediaRef(BeforeAfterResult, "afterMediaId");
mediaRef(BeforeAfterResult, "mobileBeforeMediaId");
mediaRef(BeforeAfterResult, "mobileAfterMediaId");
mediaRef(PageContent, "heroMediaId");
mediaRef(SiteSetting, "logoMediaId");
mediaRef(SiteSetting, "logoLightMediaId");
mediaRef(SiteSetting, "faviconMediaId");
mediaRef(SiteSetting, "footerLogoMediaId");

module.exports = {
  sequelize,
  AdminUser,
  Media,
  Service,
  Package,
  PackageService,
  Bundle,
  Lead,
  Review,
  Faq,
  BlogCategory,
  BlogPost,
  ServiceArea,
  HeroSlide,
  BeforeAfterResult,
  HomepageSection,
  PageContent,
  SiteSetting,
  ThemeSetting,
};
