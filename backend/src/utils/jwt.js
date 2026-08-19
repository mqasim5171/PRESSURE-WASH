const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
if (!SECRET && process.env.NODE_ENV === "production") {
  // Fail loudly at boot rather than silently signing tokens with `undefined`.
  throw new Error("JWT_SECRET is not set. Refusing to start in production without it.");
}

const EXPIRES_IN = "8h";

function signAdminToken(adminUser) {
  return jwt.sign(
    { sub: adminUser.id, username: adminUser.username, role: "admin" },
    SECRET || "dev-only-insecure-secret",
    { expiresIn: EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET || "dev-only-insecure-secret");
}

module.exports = { signAdminToken, verifyToken, EXPIRES_IN };
