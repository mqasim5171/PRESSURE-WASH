require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { sequelize, connectWithRetry } = require("./src/config/db");
const { initDb } = require("./src/scripts/initDb");
const { migrateAdditive } = require("./src/scripts/migrateAdditive");
const { seedAdmin } = require("./src/scripts/seedAdmin");
const { seedContentIfEmpty, seedBlogIfEmpty } = require("./src/scripts/seedContent");
const { errorHandler, notFoundHandler } = require("./src/middleware/errorHandler");
const { UPLOAD_ROOT } = require("./src/utils/imageProcessor");

const authRoutes = require("./src/routes/auth.routes");
const leadsRoutes = require("./src/routes/leads.routes");
const mediaRoutes = require("./src/routes/media.routes");
const servicesRoutes = require("./src/routes/services.routes");
const packagesRoutes = require("./src/routes/packages.routes");
const bundlesRoutes = require("./src/routes/bundles.routes");
const reviewsRoutes = require("./src/routes/reviews.routes");
const faqsRoutes = require("./src/routes/faqs.routes");
const areasRoutes = require("./src/routes/areas.routes");
const beforeAfterRoutes = require("./src/routes/beforeAfter.routes");
const blogRoutes = require("./src/routes/blog.routes");
const heroRoutes = require("./src/routes/hero.routes");
const homepageRoutes = require("./src/routes/homepageSections.routes");
const settingsRoutes = require("./src/routes/settings.routes");
const themeRoutes = require("./src/routes/theme.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const sitemapRoutes = require("./src/routes/sitemap.routes");

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

app.set("trust proxy", 1); // Hostinger sits behind a proxy/load balancer

app.use(helmet({
  contentSecurityPolicy: false, // the SPA sets its own; avoid double-restricting here
  crossOriginResourcePolicy: { policy: "cross-origin" }, // uploaded images need to load from the same origin's <img> tags fine, this just avoids over-restricting
}));
app.use(cors({ origin: APP_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// Uploaded media - served directly as static files. Filenames are always
// server-generated (see imageProcessor.js), so nothing here trusts
// user-controlled paths.
app.use("/uploads", express.static(UPLOAD_ROOT, { maxAge: "30d", immutable: true }));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes); // has its own /admin sub-path internally
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/services", servicesRoutes.publicRouter);
app.use("/api/admin/services", servicesRoutes.adminRouter);

app.use("/api/packages", packagesRoutes.publicRouter);
app.use("/api/admin/packages", packagesRoutes.adminRouter);

app.use("/api/bundles", bundlesRoutes.publicRouter);
app.use("/api/admin/bundles", bundlesRoutes.adminRouter);

app.use("/api/reviews", reviewsRoutes.publicRouter);
app.use("/api/admin/reviews", reviewsRoutes.adminRouter);

app.use("/api/faqs", faqsRoutes.publicRouter);
app.use("/api/admin/faqs", faqsRoutes.adminRouter);

app.use("/api/areas", areasRoutes.publicRouter);
app.use("/api/admin/areas", areasRoutes.adminRouter);

app.use("/api/before-after", beforeAfterRoutes.publicRouter);
app.use("/api/admin/before-after", beforeAfterRoutes.adminRouter);

app.use("/api/blog", blogRoutes.publicRouter);
app.use("/api/admin/blog", blogRoutes.adminRouter);

app.use("/api/hero", heroRoutes.publicRouter);
app.use("/api/admin/hero", heroRoutes.adminRouter);

app.use("/api/homepage", homepageRoutes.publicRouter);
app.use("/api/admin/homepage", homepageRoutes.adminRouter);

app.use("/api/settings", settingsRoutes.publicRouter);
app.use("/api/admin/settings", settingsRoutes.adminRouter);

app.use("/api/theme", themeRoutes.publicRouter);
app.use("/api/admin/theme", themeRoutes.adminRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok", env: NODE_ENV }));

// Dynamic sitemap, generated from live CMS content on request - mounted
// ahead of the static-file middleware below so it wins over the old
// hand-maintained public/sitemap.xml that ships inside frontend/build
// (same public URL, /sitemap.xml, now backed by real data instead).
app.use(sitemapRoutes);

// ---------------------------------------------------------------------------
// Serve the React production build (same-domain deployment: frontend,
// /admin and /api all live on one Hostinger Node.js Web App). Falls back
// to the SPA's index.html for any non-API route so React Router can handle
// client-side routes like /admin/leads on a hard refresh.
// ---------------------------------------------------------------------------
const FRONTEND_BUILD = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(FRONTEND_BUILD, { maxAge: NODE_ENV === "production" ? "1d" : 0 }));

app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
  res.sendFile(path.join(FRONTEND_BUILD, "index.html"), (err) => {
    if (err) next(err); // build not present (e.g. local API-only dev) - fall through to 404
  });
});

app.use("/api", notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectWithRetry();
  await initDb();
  await migrateAdditive();
  await seedAdmin();
  await seedContentIfEmpty();
  await seedBlogIfEmpty();
  app.listen(PORT, () => {
    console.log(`[server] Horizon CMS backend listening on port ${PORT} (${NODE_ENV})`);
  });
}

start().catch((err) => {
  console.error("[server] Fatal startup error:", err);
  process.exit(1);
});

module.exports = app;
