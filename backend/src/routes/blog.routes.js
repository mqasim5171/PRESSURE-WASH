const express = require("express");
const slugify = require("slugify");
const { Op } = require("sequelize");
const { BlogPost, BlogCategory } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("../utils/mediaUrls");

const IMAGE_FIELDS = [
  { idField: "featuredImageMediaId", urlField: "featuredImageUrl" },
  { idField: "ogImageMediaId", urlField: "ogImageUrl" },
];

const publicRouter = express.Router();
const adminRouter = express.Router();
adminRouter.use(requireAdmin);

async function uniqueSlug(base, ignoreId = null) {
  let slug = slugify(base, { lower: true, strict: true });
  let n = 1;
  while (true) {
    const where = { slug };
    if (ignoreId) where.id = { [Op.ne]: ignoreId };
    const exists = await BlogPost.findOne({ where });
    if (!exists) return slug;
    n += 1;
    slug = `${slugify(base, { lower: true, strict: true })}-${n}`;
  }
}

const includeCategory = [{ model: BlogCategory, as: "category" }];

// ---------------------------------------------------------------------------
// PUBLIC - only truly-published posts (status published AND publishedAt has
// passed, so a "scheduled" post doesn't leak early).
// ---------------------------------------------------------------------------
publicRouter.get("/", asyncHandler(async (req, res) => {
  const { category, tag, page = 1, pageSize = 12 } = req.query;
  const where = {
    status: "published",
    publishedAt: { [Op.lte]: new Date() },
  };
  if (category) {
    const cat = await BlogCategory.findOne({ where: { slug: category } });
    where.categoryId = cat ? cat.id : -1;
  }
  const limit = Math.min(50, Number(pageSize) || 12);
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const { rows, count } = await BlogPost.findAndCountAll({
    where, include: includeCategory, order: [["publishedAt", "DESC"]], limit, offset,
  });
  const filtered = tag ? rows.filter((p) => (p.tags || []).includes(tag)) : rows;
  const items = await attachMediaUrls(filtered, IMAGE_FIELDS);
  res.json({ items, total: count, page: Number(page) || 1, pageSize: limit });
}));

publicRouter.get("/:slug", asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, status: "published", publishedAt: { [Op.lte]: new Date() } },
    include: includeCategory,
  });
  if (!post) return res.status(404).json({ error: "Post not found." });
  res.json(await attachMediaUrl(post, IMAGE_FIELDS));
}));

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------
adminRouter.get("/", asyncHandler(async (req, res) => {
  const { status, search, page = 1, pageSize = 50 } = req.query;
  const where = {};
  if (status) where.status = status;
  if (search) where.title = { [Op.like]: `%${search}%` };
  const limit = Math.min(200, Number(pageSize) || 50);
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const { rows, count } = await BlogPost.findAndCountAll({
    where, include: includeCategory, order: [["createdAt", "DESC"]], limit, offset,
  });
  res.json({ items: await attachMediaUrls(rows, IMAGE_FIELDS), total: count, page: Number(page) || 1, pageSize: limit });
}));

adminRouter.get("/categories", asyncHandler(async (req, res) => {
  res.json(await BlogCategory.findAll({ order: [["name", "ASC"]] }));
}));

adminRouter.post("/categories", requireCustomHeader, asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required." });
  const category = await BlogCategory.create({ name, slug: slugify(name, { lower: true, strict: true }) });
  res.status(201).json(category);
}));

adminRouter.get("/:id", asyncHandler(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id, { include: includeCategory });
  if (!post) return res.status(404).json({ error: "Not found." });
  res.json(await attachMediaUrl(post, IMAGE_FIELDS));
}));

adminRouter.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.content = data.content || ""; // `content` has no DB-level default - see models/index.js
  data.slug = data.slug ? await uniqueSlug(data.slug) : await uniqueSlug(data.title || "post");
  if (data.status === "published" && !data.publishedAt) data.publishedAt = new Date();
  const post = await BlogPost.create(data);
  res.status(201).json(post);
}));

adminRouter.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found." });
  const data = { ...req.body };
  if (data.slug && data.slug !== post.slug) data.slug = await uniqueSlug(data.slug, post.id);
  if (data.status === "published" && !post.publishedAt && !data.publishedAt) data.publishedAt = new Date();
  await post.update(data);
  res.json(post);
}));

adminRouter.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found." });
  await post.destroy();
  res.json({ success: true });
}));

module.exports = { publicRouter, adminRouter };
