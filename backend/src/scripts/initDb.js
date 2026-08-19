// Creates any tables that don't exist yet. Deliberately NOT `sync({ force
// })` or `sync({ alter })` - either of those can drop or rewrite existing
// columns, which is the last thing you want running automatically against
// a live production database on every deploy. This only ever adds tables
// that are missing; changing an existing table's shape is a deliberate,
// reviewed migration, not something that happens implicitly on boot.
require("dotenv").config();
const { sequelize } = require("../models");

async function initDb() {
  await sequelize.authenticate();
  await sequelize.sync(); // safe: creates missing tables only
  console.log("[db] Schema is up to date (missing tables created if any).");
}

if (require.main === module) {
  initDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[db] Failed to initialize schema:", err);
      process.exit(1);
    });
}

module.exports = { initDb };
