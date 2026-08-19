const express = require("express");
const { Op } = require("sequelize");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("./mediaUrls");

/**
 * buildAdminCrudRouter
 * ----------------------
 * Generic authenticated CRUD (list w/ search+pagination, get, create,
 * update, delete) for the simpler, uniformly-shaped content types (Reviews,
 * FAQs, Service Areas, Bundles, Before/After Results). Resources with real
 * per-record logic (slugs, associations, singleton rows) get their own
 * hand-written router instead of forcing this shape onto them.
 */
function buildAdminCrudRouter(Model, {
  orderBy = [["displayOrder", "ASC"], ["id", "ASC"]],
  searchFields = [],
  beforeCreate,
  beforeUpdate,
  include,
  mediaFields, // e.g. [{ idField: "avatarMediaId", urlField: "avatarUrl" }]
} = {}) {
  const router = express.Router();
  router.use(requireAdmin);

  router.get("/", asyncHandler(async (req, res) => {
    const { search, page = 1, pageSize = 100 } = req.query;
    const where = {};
    if (search && searchFields.length) {
      where[Op.or] = searchFields.map((f) => ({ [f]: { [Op.like]: `%${search}%` } }));
    }
    const limit = Math.min(200, Number(pageSize) || 100);
    const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
    const { rows, count } = await Model.findAndCountAll({ where, order: orderBy, limit, offset, include });
    const items = mediaFields ? await attachMediaUrls(rows, mediaFields) : rows;
    res.json({ items, total: count, page: Number(page) || 1, pageSize: limit });
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    const item = await Model.findByPk(req.params.id, { include });
    if (!item) return res.status(404).json({ error: "Not found." });
    res.json(mediaFields ? await attachMediaUrl(item, mediaFields) : item);
  }));

  router.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
    const data = beforeCreate ? await beforeCreate(req.body, req) : req.body;
    const item = await Model.create(data);
    res.status(201).json(item);
  }));

  router.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found." });
    const data = beforeUpdate ? await beforeUpdate(req.body, req, item) : req.body;
    await item.update(data);
    res.json(item);
  }));

  router.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found." });
    await item.destroy();
    res.json({ success: true });
  }));

  return router;
}

module.exports = { buildAdminCrudRouter };
