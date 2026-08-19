// src/config/db.js
//
// Single shared Sequelize instance, backed by mysql2's built-in connection
// pool. Every model/route reuses this instead of opening new connections
// per request, which matters on managed hosting with limited DB
// connection quotas.
const { Sequelize } = require("sequelize");

const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_NAME = "horizon_cms",
  DB_USER = "root",
  DB_PASSWORD = "",
  NODE_ENV = "development",
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  logging: false,
  define: {
    underscored: true, // created_at / updated_at, snake_case columns in MySQL
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
});

async function connectWithRetry(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log(`[db] Connected to MySQL (${DB_HOST}:${DB_PORT}/${DB_NAME})`);
      return;
    } catch (err) {
      console.error(`[db] Connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

module.exports = { sequelize, connectWithRetry, NODE_ENV };
