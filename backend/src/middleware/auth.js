const { verifyToken } = require("../utils/jwt");

const COOKIE_NAME = "horizon_admin_session";

/**
 * requireAdmin
 * -------------
 * Protects every /api/admin/* route. Reads the JWT from an httpOnly cookie
 * (never from a header/localStorage the frontend JS could leak via XSS),
 * verifies it, and attaches the decoded admin identity to req.admin.
 *
 * Also enforced: a custom header must be present on every mutating request
 * (see requireCustomHeader below), which - combined with SameSite=Lax and a
 * locked-down CORS origin - is the CSRF defence for cookie-based auth here.
 */
function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  try {
    req.admin = verifyToken(token);
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
}

/**
 * requireCustomHeader
 * ---------------------
 * A simple, effective CSRF mitigation for cookie-based auth: browsers only
 * let JS set custom headers on same-origin (or CORS-approved) requests, so
 * a plain cross-site <form> POST forged against our API can't set this
 * header and gets rejected before it ever touches a mutating route.
 */
function requireCustomHeader(req, res, next) {
  if (req.get("X-Horizon-Admin") !== "1") {
    return res.status(403).json({ error: "Missing required request header." });
  }
  return next();
}

module.exports = { requireAdmin, requireCustomHeader, COOKIE_NAME };
