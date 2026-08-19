// Creates the initial admin user if the admin_users table is empty.
// Username/password are configurable via env vars (ADMIN_USERNAME /
// ADMIN_INITIAL_PASSWORD) but default to the requested admin / admin123 -
// the password is bcrypt-hashed before it's ever written to the database,
// never stored or logged in plaintext.
require("dotenv").config();
const { sequelize, AdminUser } = require("../models");
const { hashPassword } = require("../utils/password");

async function seedAdmin() {
  await sequelize.authenticate();

  const existing = await AdminUser.count();
  if (existing > 0) {
    console.log("[seed] Admin user(s) already exist - skipping.");
    return;
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_INITIAL_PASSWORD || "admin123";
  const passwordHash = await hashPassword(password);

  await AdminUser.create({ username, passwordHash });
  console.log(`[seed] Created initial admin user "${username}".`);
  if (!process.env.ADMIN_INITIAL_PASSWORD) {
    console.log('[seed] Using the default password "admin123" - change it from Admin > Account after logging in.');
  }
}

if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[seed] Failed to seed admin user:", err);
      process.exit(1);
    });
}

module.exports = { seedAdmin };
