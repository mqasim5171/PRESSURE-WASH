const express = require("express");
const slugify = require("slugify");
const { Op } = require("sequelize");
const { Service, Package } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("../utils/mediaUrls");

const IMAGE_FIELDS = [
  { idField: "thumbnailMediaId", urlField: "thumbnailUrl" },
  { idField: "bannerMediaId", urlField: "bannerUrl" },
];

const router = express.Router();

async function uniqueSlug(base, ignoreId = null) {
  let slug = slugify(base, { lower: true, strict: true });
  let n = 1;
  while (true) {
    const where = { slug };
    if (ignoreId) where.id = { [Op.ne]: ignoreId };
    const exists = await Service.findOne({ where });
    if (!exists) return slug;
    n += 1;
    slug = `${slugify(base, { lower: true, strict: true })}-${n}`;
  }
}

// ---------------------------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------------------------
router.get("/", asyncHandler(async (req, res) => {
  const services = await Service.findAll({
    where: { published: true },
    order: [["displayOrder", "ASC"], ["id", "ASC"]],
  });
  res.json(await attachMediaUrls(services, IMAGE_FIELDS));
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const service = await Service.findOne({
    where: { slug: req.params.slug, published: true },
    include: [{ model: Package, as: "packages", through: { attributes: [] } }],
  });
  if (!service) return res.status(404).json({ error: "Service not found." });
  res.json(await attachMediaUrl(service, IMAGE_FIELDS));
}));

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------
const admin = express.Router();
admin.use(requireAdmin);

admin.get("/", asyncHandler(async (req, res) => {
  const services = await Service.findAll({ order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(services, IMAGE_FIELDS));
}));

admin.get("/:id", asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id, {
    include: [{ model: Package, as: "packages", through: { attributes: [] } }],
  });
  if (!service) return res.status(404).json({ error: "Not found." });
  res.json(await attachMediaUrl(service, IMAGE_FIELDS));
}));

admin.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = data.slug ? await uniqueSlug(data.slug) : await uniqueSlug(data.name || "service");
  const service = await Service.create(data);
  res.status(201).json(service);
}));

admin.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ error: "Not found." });
  const data = { ...req.body };
  if (data.slug && data.slug !== service.slug) {
    data.slug = await uniqueSlug(data.slug, service.id);
  }
  await service.update(data);
  res.json(service);
}));

admin.post("/:id/duplicate", requireCustomHeader, asyncHandler(async (req, res) => {
  const original = await Service.findByPk(req.params.id, { raw: true });
  if (!original) return res.status(404).json({ error: "Not found." });
  delete original.id;
  original.name = `${original.name} (Copy)`;
  original.slug = await uniqueSlug(original.name);
  original.published = false;
  const copy = await Service.create(original);
  res.status(201).json(copy);
}));

admin.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ error: "Not found." });
  await service.destroy();
  res.json({ success: true });
}));

module.exports = { publicRouter: router, adminRouter: admin };
