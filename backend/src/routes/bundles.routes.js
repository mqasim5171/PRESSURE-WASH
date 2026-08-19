const express = require("express");
const { Op } = require("sequelize");
const { Bundle, Package } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("../utils/mediaUrls");
const { uniqueSlugAcross } = require("../utils/packageSlug");

// Bundles ("Combine services, get more for your money") get their own
// hand-written router now, same shape as packages.routes.js, instead of the
// generic buildAdminCrudRouter - slug generation/uniqueness needs the same
// per-record logic Packages already has, so a bundle created or renamed in
// Admin gets a real, working /packages/:slug page immediately.
const IMAGE_FIELDS = [
  { idField: "imageMediaId", urlField: "imageUrl" },
  { idField: "mobileImageMediaId", urlField: "mobileImageUrl" },
];

// Shares one slug namespace with Packages - see utils/packageSlug.js.
async function uniqueSlug(base, ignoreId = null) {
  return uniqueSlugAcross(base, [
    { model: Bundle, ignoreId },
    { model: Package },
  ]);
}

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const bundles = await Bundle.findAll({ where: { published: true }, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(bundles, IMAGE_FIELDS));
}));

publicRouter.get("/:slug", asyncHandler(async (req, res) => {
  const bundle = await Bundle.findOne({ where: { slug: req.params.slug, published: true } });
  if (!bundle) return res.status(404).json({ error: "Bundle not found." });
  res.json(await attachMediaUrl(bundle, IMAGE_FIELDS));
}));

const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get("/", asyncHandler(async (req, res) => {
  const { search, page = 1, pageSize = 100 } = req.query;
  const where = search ? { name: { [Op.like]: `%${search}%` } } : {};
  const limit = Math.min(200, Number(pageSize) || 100);
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const { rows, count } = await Bundle.findAndCountAll({
    where, order: [["displayOrder", "ASC"], ["id", "ASC"]], limit, offset,
  });
  res.json({ items: await attachMediaUrls(rows, IMAGE_FIELDS), total: count, page: Number(page) || 1, pageSize: limit });
}));

adminRouter.get("/:id", asyncHandler(async (req, res) => {
  const bundle = await Bundle.findByPk(req.params.id);
  if (!bundle) return res.status(404).json({ error: "Not found." });
  res.json(await attachMediaUrl(bundle, IMAGE_FIELDS));
}));

adminRouter.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = data.slug ? await uniqueSlug(data.slug) : await uniqueSlug(data.name || "bundle");
  const bundle = await Bundle.create(data);
  res.status(201).json(bundle);
}));

adminRouter.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const bundle = await Bundle.findByPk(req.params.id);
  if (!bundle) return res.status(404).json({ error: "Not found." });
  const data = { ...req.body };
  // Slug changes are allowed (per-field, explicit) but never silent: a
  // changed slug means the old /packages/:old-slug URL stops resolving, so
  // this is opt-in only when the admin actually edits the slug field
  // themselves, same as Packages/Services.
  if (data.slug && data.slug !== bundle.slug) data.slug = await uniqueSlug(data.slug, bundle.id);
  await bundle.update(data);
  res.json(bundle);
}));

adminRouter.post("/:id/duplicate", requireCustomHeader, asyncHandler(async (req, res) => {
  const original = await Bundle.findByPk(req.params.id, { raw: true });
  if (!original) return res.status(404).json({ error: "Not found." });
  delete original.id;
  original.name = `${original.name} (Copy)`;
  original.slug = await uniqueSlug(original.name);
  original.published = false;
  const copy = await Bundle.create(original);
  res.status(201).json(copy);
}));

adminRouter.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const bundle = await Bundle.findByPk(req.params.id);
  if (!bundle) return res.status(404).json({ error: "Not found." });
  await bundle.destroy();
  res.json({ success: true });
}));

module.exports = { publicRouter, adminRouter };
