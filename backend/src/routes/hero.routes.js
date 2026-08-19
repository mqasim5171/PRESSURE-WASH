const express = require("express");
const { HeroSlide } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls, attachMediaUrl } = require("../utils/mediaUrls");

const IMAGE_FIELDS = [
  { idField: "imageMediaId", urlField: "imageUrl" },
  { idField: "mobileImageMediaId", urlField: "mobileImageUrl" },
  { idField: "beforeImageMediaId", urlField: "beforeImageUrl" },
  { idField: "afterImageMediaId", urlField: "afterImageUrl" },
  { idField: "mobileBeforeImageMediaId", urlField: "mobileBeforeImageUrl" },
  { idField: "mobileAfterImageMediaId", urlField: "mobileAfterImageUrl" },
];

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const slides = await HeroSlide.findAll({ where: { enabled: true }, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(slides, IMAGE_FIELDS));
}));

const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get("/", asyncHandler(async (req, res) => {
  const slides = await HeroSlide.findAll({ order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(slides, IMAGE_FIELDS));
}));

adminRouter.get("/:id", asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: "Not found." });
  res.json(await attachMediaUrl(slide, IMAGE_FIELDS));
}));

adminRouter.post("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const count = await HeroSlide.count();
  const slide = await HeroSlide.create({ displayOrder: count, ...req.body });
  res.status(201).json(slide);
}));

// Reorder must be registered before "/:id" would otherwise be fine since
// methods differ, but keeping it explicit and above avoids any ambiguity.
adminRouter.put("/reorder", requireCustomHeader, asyncHandler(async (req, res) => {
  const { order } = req.body; // [{ id, displayOrder }, ...]
  if (!Array.isArray(order)) return res.status(400).json({ error: "`order` must be an array." });
  await Promise.all(order.map(({ id, displayOrder }) => HeroSlide.update({ displayOrder }, { where: { id } })));
  res.json({ success: true });
}));

adminRouter.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: "Not found." });
  await slide.update(req.body);
  res.json(slide);
}));

adminRouter.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findByPk(req.params.id);
  if (!slide) return res.status(404).json({ error: "Not found." });
  await slide.destroy();
  res.json({ success: true });
}));

module.exports = { publicRouter, adminRouter };
