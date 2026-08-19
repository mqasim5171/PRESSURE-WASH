// Additive-only schema migration: adds nullable columns that a model gained
// after its table already existed in a live database. Deliberately separate
// from initDb.js's plain `sync()` (which only creates missing *tables*, not
// missing *columns* on existing ones) - and deliberately NOT `sync({ alter
// })`, which can also drop/rewrite columns it thinks are unwanted. Every
// entry below is a single `ADD COLUMN ... NULL`, guarded by a check that the
// column doesn't already exist, so this is safe to run repeatedly and safe
// to run against a database that already has the column (e.g. after a
// second deploy) or doesn't yet (a fresh install, where initDb's sync()
// already created the table with every current column and this is a no-op).
require("dotenv").config();
const { sequelize } = require("../models");
const { DataTypes } = require("sequelize");
const { uniqueSlugAcross } = require("../utils/packageSlug");

// `column` is the actual MySQL column name to check/add. The model
// (backend/src/models/index.js) is configured with `underscored: true`, so
// Sequelize maps camelCase JS attributes to snake_case columns
// automatically (e.g. `mobileBeforeImageMediaId` -> `mobile_before_image_
// media_id`) - this list uses the real snake_case column name directly so
// `describeTable` / `addColumn` talk to the column that actually exists (or
// needs to exist), matching what the ORM will query at runtime.
const ADDITIONS = [
  { table: "hero_slides", column: "mobile_before_image_media_id", type: DataTypes.INTEGER },
  { table: "hero_slides", column: "mobile_after_image_media_id", type: DataTypes.INTEGER },
  { table: "before_after_results", column: "mobile_before_media_id", type: DataTypes.INTEGER },
  { table: "before_after_results", column: "mobile_after_media_id", type: DataTypes.INTEGER },
  // Package: mobile hero image, custom offer badge text, SEO fields -
  // dynamic package detail pages (/packages/:slug).
  { table: "packages", column: "package_mobile_image_media_id", type: DataTypes.INTEGER },
  { table: "packages", column: "offer_badge", type: DataTypes.STRING(80) },
  { table: "packages", column: "seo_title", type: DataTypes.STRING(255) },
  { table: "packages", column: "seo_description", type: DataTypes.STRING(500) },
  // Bundle: brought up to near-parity with Package so bundles ("Combine
  // services, get more for your money") can share the same /packages/:slug
  // detail page and lookup logic instead of a second parallel system.
  // `slug` is added nullable+unique (MySQL permits multiple NULLs in a
  // unique column) and then backfilled below - adding it unique+NOT NULL
  // in one step would fail outright on a table with existing rows.
  { table: "bundles", column: "slug", type: DataTypes.STRING(160), unique: true },
  { table: "bundles", column: "tagline", type: DataTypes.STRING(255) },
  { table: "bundles", column: "short_description", type: DataTypes.TEXT },
  { table: "bundles", column: "full_description", type: DataTypes.TEXT },
  { table: "bundles", column: "image_media_id", type: DataTypes.INTEGER },
  { table: "bundles", column: "mobile_image_media_id", type: DataTypes.INTEGER },
  { table: "bundles", column: "offer_badge", type: DataTypes.STRING(80) },
  { table: "bundles", column: "seo_title", type: DataTypes.STRING(255) },
  { table: "bundles", column: "seo_description", type: DataTypes.STRING(500) },
];

async function migrateAdditive() {
  const qi = sequelize.getQueryInterface();
  for (const { table, column, type, unique } of ADDITIONS) {
    let exists = true;
    try {
      const desc = await qi.describeTable(table);
      exists = Object.prototype.hasOwnProperty.call(desc, column);
    } catch {
      // Table itself doesn't exist yet - sync() will create it (with the
      // column already included in the model), nothing to do here.
      continue;
    }
    if (exists) continue;
    await qi.addColumn(table, column, { type, allowNull: true, unique: !!unique });
    console.log(`[migrate] Added ${table}.${column}`);
  }

  await backfillBundleSlugs();
}

// One-time, idempotent: any bundle saved before the slug column existed
// gets one generated from its name - unique across BOTH Bundles and
// Packages (they share the public /packages/:slug namespace, see
// utils/packageSlug.js) - so existing live bundles ("Solar Care", "Home
// Exterior", "Complete Property Care" etc.) get a working URL without an
// admin having to manually visit and re-save each one first.
async function backfillBundleSlugs() {
  const { Bundle, Package } = require("../models");
  const desc = await sequelize.getQueryInterface().describeTable("bundles");
  if (!desc.slug) return; // column doesn't exist yet in this environment for some reason - nothing to backfill
  const unslugged = await Bundle.findAll({ where: { slug: null } });
  for (const bundle of unslugged) {
    // eslint-disable-next-line no-await-in-loop
    const candidate = await uniqueSlugAcross(bundle.name || `bundle-${bundle.id}`, [
      { model: Bundle, ignoreId: bundle.id },
      { model: Package },
    ]);
    // eslint-disable-next-line no-await-in-loop
    await bundle.update({ slug: candidate });
    console.log(`[migrate] Backfilled bundle #${bundle.id} slug: ${candidate}`);
  }
}

if (require.main === module) {
  migrateAdditive()
    .then(() => { console.log("[migrate] Additive migration complete."); process.exit(0); })
    .catch((err) => { console.error("[migrate] Failed:", err); process.exit(1); });
}

module.exports = { migrateAdditive };
