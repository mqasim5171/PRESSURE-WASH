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
];

async function migrateAdditive() {
  const qi = sequelize.getQueryInterface();
  for (const { table, column, type } of ADDITIONS) {
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
    await qi.addColumn(table, column, { type, allowNull: true });
    console.log(`[migrate] Added ${table}.${column}`);
  }
}

if (require.main === module) {
  migrateAdditive()
    .then(() => { console.log("[migrate] Additive migration complete."); process.exit(0); })
    .catch((err) => { console.error("[migrate] Failed:", err); process.exit(1); });
}

module.exports = { migrateAdditive };
