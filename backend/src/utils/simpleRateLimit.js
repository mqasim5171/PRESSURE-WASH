// Minimal in-memory rate limiter, deliberately not a Redis-backed one - a
// single Node process on managed hosting doesn't need distributed rate
// limiting for a small business admin login form. Resets if the process
// restarts, which is an acceptable tradeoff for this scale.
function rateLimit({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  const hits = new Map(); // ip -> [timestamps]

  // Periodically forget old IPs so this map doesn't grow forever.
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, timestamps] of hits) {
      const recent = timestamps.filter((t) => t > cutoff);
      if (recent.length === 0) hits.delete(ip);
      else hits.set(ip, recent);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const cutoff = now - windowMs;
    const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff);
    timestamps.push(now);
    hits.set(ip, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({ error: "Too many attempts. Please try again later." });
    }
    return next();
  };
}

module.exports = rateLimit;
