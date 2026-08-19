const express = require("express");
const slugify = require("slugify");
const { Op } = require("sequelize");
const { ServiceArea } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("../utils/mediaUrls");

const IMAGE_FIELDS = [{ idField: "imageMediaId", urlField: "imageUrl" }];

async function uniqueSlug(base, ignoreId = null) {
  let slug = slugify(base, { lower: true, strict: true });
  let n = 1;
  while (true) {
    const where = { slug };
    if (ignoreId) where.id = { [Op.ne]: ignoreId };
    const exists = await ServiceArea.findOne({ where });
    if (!exists) return slug;
    n += 1;
    slug = `${slugify(base, { lower: true, strict: true })}-${n}`;
  }
}

// ---------------------------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------------------------
const publicRouter = express.Router();

publicRouter.get("/", asyncHandler(async (req, res) => {
  const areas = await ServiceArea.findAll({ where: { active: true }, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(areas, IMAGE_FIELDS));
}));

publicRouter.get("/:slug", asyncHandler(async (req, res) => {
  const area = await ServiceArea.findOne({ where: { slug: req.params.slug, active: true } });
  if (!area) return res.status(404).json({ error: "Area not found." });
  res.json(await attachMediaUrl(area, IMAGE_FIELDS));
}));

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------
const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get("/", asyncHandler(async (req, res) => {
  const { search, page = 1, pageSize = 100 } = req.query;
  const where = {};
  if (search) where[Op.or] = [{ city: { [Op.like]: `%${search}%` } }, { region: { [Op.like]: `%${search}%` } }];
  const limit = Math.min(200, Number(pageSize) || 100);
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const { rows, count } = await ServiceArea.findAndCountAll({ where, order: [["displayOrder", "ASC"], ["id", "ASC"]], limit, offset });
  res.json({ items: await attachMediaUrls(rows, IMAGE_FIELDS), total: count, page: Number(page) || 1, pageSize: limit });
}));

adminRouter.get("/:id", asyncHandler(async (req, res) => {
  const area = await ServiceArea.findByPk(req.params.id);
  if (!area) return res.status(404).json({ error: "Not found." });
  res.json(await attachMediaUrl(area, IMAGE_FIELDS));
}));

adminRouter.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = data.slug ? await uniqueSlug(data.slug) : await uniqueSlug(data.city || "area");
  const area = await ServiceArea.create(data);
  res.status(201).json(area);
}));

adminRouter.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const area = await ServiceArea.findByPk(req.params.id);
  if (!area) return res.status(404).json({ error: "Not found." });
  const data = { ...req.body };
  if (data.slug && data.slug !== area.slug) data.slug = await uniqueSlug(data.slug, area.id);
  await area.update(data);
  res.json(area);
}));

adminRouter.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const area = await ServiceArea.findByPk(req.params.id);
  if (!area) return res.status(404).json({ error: "Not found." });
  await area.destroy();
  res.json({ success: true });
}));

module.exports = { publicRouter, adminRouter };
