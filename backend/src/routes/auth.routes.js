const express = require("express");
const rateLimit = require("../utils/simpleRateLimit");
const { AdminUser } = require("../models");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signAdminToken } = require("../utils/jwt");
const { requireAdmin, requireCustomHeader, COOKIE_NAME } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd, // requires HTTPS in production (Hostinger provides SSL)
  sameSite: "lax",
  maxAge: 8 * 60 * 60 * 1000, // 8h, matches jwt.js EXPIRES_IN
  path: "/",
};

// Basic in-memory rate limit on login attempts, per IP. Good enough for a
// small business admin panel without pulling in Redis/a queue just to
// throttle a login form.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/login", loginLimiter, asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const admin = await AdminUser.findOne({ where: { username } });
  // Same error either way - don't reveal whether the username exists.
  const invalid = () => res.status(401).json({ error: "Invalid username or password." });
  if (!admin) return invalid();

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return invalid();

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken(admin);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.json({ id: admin.id, username: admin.username });
}));

router.post("/logout", requireCustomHeader, (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.json({ success: true });
});

router.get("/me", requireAdmin, asyncHandler(async (req, res) => {
  const admin = await AdminUser.findByPk(req.admin.sub, { attributes: ["id", "username", "lastLoginAt"] });
  if (!admin) return res.status(401).json({ error: "Not authenticated." });
  res.json(admin);
}));

router.post("/change-password", requireAdmin, requireCustomHeader, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters, and current password is required." });
  }
  const admin = await AdminUser.findByPk(req.admin.sub);
  const ok = await verifyPassword(currentPassword, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Current password is incorrect." });

  admin.passwordHash = await hashPassword(newPassword);
  await admin.save();
  res.json({ success: true });
}));

module.exports = router;
