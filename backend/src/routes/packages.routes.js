const express = require("express");
const slugify = require("slugify");
const { Op } = require("sequelize");
const { Package, Service } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("../utils/mediaUrls");

const IMAGE_FIELDS = [{ idField: "packageImageMediaId", urlField: "packageImageUrl" }];

const router = express.Router();

async function uniqueSlug(base, ignoreId = null) {
  let slug = slugify(base, { lower: true, strict: true });
  let n = 1;
  while (true) {
    const where = { slug };
    if (ignoreId) where.id = { [Op.ne]: ignoreId };
    const exists = await Package.findOne({ where });
    if (!exists) return slug;
    n += 1;
    slug = `${slugify(base, { lower: true, strict: true })}-${n}`;
  }
}

const includeServices = [{ model: Service, as: "services", through: { attributes: [] }, attributes: ["id", "slug", "name"] }];

// ---------------------------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------------------------
router.get("/", asyncHandler(async (req, res) => {
  const packages = await Package.findAll({
    where: { published: true },
    order: [["displayOrder", "ASC"], ["id", "ASC"]],
    include: includeServices,
  });
  res.json(await attachMediaUrls(packages, IMAGE_FIELDS));
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const pkg = await Package.findOne({ where: { slug: req.params.slug, published: true }, include: includeServices });
  if (!pkg) return res.status(404).json({ error: "Package not found." });
  res.json(await attachMediaUrl(pkg, IMAGE_FIELDS));
}));

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------
const admin = express.Router();
admin.use(requireAdmin);

admin.get("/", asyncHandler(async (req, res) => {
  const packages = await Package.findAll({ order: [["displayOrder", "ASC"], ["id", "ASC"]], include: includeServices });
  res.json(await attachMediaUrls(packages, IMAGE_FIELDS));
}));

admin.get("/:id", asyncHandler(async (req, res) => {
  const pkg = await Package.findByPk(req.params.id, { include: includeServices });
  if (!pkg) return res.status(404).json({ error: "Not found." });
  res.json(await attachMediaUrl(pkg, IMAGE_FIELDS));
}));

admin.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const { serviceIds, ...data } = req.body;
  data.slug = data.slug ? await uniqueSlug(data.slug) : await uniqueSlug(data.name || "package");
  const pkg = await Package.create(data);
  if (Array.isArray(serviceIds)) await pkg.setServices(serviceIds);
  res.status(201).json(await Package.findByPk(pkg.id, { include: includeServices }));
}));

admin.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const pkg = await Package.findByPk(req.params.id);
  if (!pkg) return res.status(404).json({ error: "Not found." });
  const { serviceIds, ...data } = req.body;
  if (data.slug && data.slug !== pkg.slug) data.slug = await uniqueSlug(data.slug, pkg.id);
  await pkg.update(data);
  if (Array.isArray(serviceIds)) await pkg.setServices(serviceIds);
  res.json(await Package.findByPk(pkg.id, { include: includeServices }));
}));

admin.post("/:id/duplicate", requireCustomHeader, asyncHandler(async (req, res) => {
  const original = await Package.findByPk(req.params.id);
  if (!original) return res.status(404).json({ error: "Not found." });
  const plain = original.get({ plain: true });
  delete plain.id;
  plain.name = `${plain.name} (Copy)`;
  plain.slug = await uniqueSlug(plain.name);
  plain.published = false;
  const copy = await Package.create(plain);
  const services = await original.getServices();
  await copy.setServices(services.map((s) => s.id));
  res.status(201).json(await Package.findByPk(copy.id, { include: includeServices }));
}));

admin.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const pkg = await Package.findByPk(req.params.id);
  if (!pkg) return res.status(404).json({ error: "Not found." });
  await pkg.destroy();
  res.json({ success: true });
}));

module.exports = { publicRouter: router, adminRouter: admin };
