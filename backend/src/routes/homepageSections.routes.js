const express = require("express");
const { HomepageSection, PageContent } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

// Homepage sections (Combined Services / Three Faults / Why Us Stats / Same
// Roof Story) and page-level content (About, Services landing, Homepage
// top-level fields) share the same simple "content is a JSON blob keyed by
// a stable name" shape, so one router handles both.
const publicRouter = express.Router();

publicRouter.get("/sections", asyncHandler(async (req, res) => {
  const sections = await HomepageSection.findAll({ where: { enabled: true }, order: [["displayOrder", "ASC"]] });
  res.json(sections);
}));

publicRouter.get("/pages/:pageKey", asyncHandler(async (req, res) => {
  const page = await PageContent.findOne({ where: { pageKey: req.params.pageKey } });
  if (!page) return res.status(404).json({ error: "Not found." });
  res.json(page);
}));

const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get("/sections", asyncHandler(async (req, res) => {
  res.json(await HomepageSection.findAll({ order: [["displayOrder", "ASC"]] }));
}));

adminRouter.put("/sections/:sectionKey", requireCustomHeader, asyncHandler(async (req, res) => {
  const [section] = await HomepageSection.findOrCreate({
    where: { sectionKey: req.params.sectionKey },
    defaults: { sectionKey: req.params.sectionKey, ...req.body },
  });
  await section.update(req.body);
  res.json(section);
}));

adminRouter.get("/pages", asyncHandler(async (req, res) => {
  res.json(await PageContent.findAll());
}));

adminRouter.get("/pages/:pageKey", asyncHandler(async (req, res) => {
  const page = await PageContent.findOne({ where: { pageKey: req.params.pageKey } });
  if (!page) return res.status(404).json({ error: "Not found." });
  res.json(page);
}));

adminRouter.put("/pages/:pageKey", requireCustomHeader, asyncHandler(async (req, res) => {
  const [page] = await PageContent.findOrCreate({
    where: { pageKey: req.params.pageKey },
    defaults: { pageKey: req.params.pageKey, ...req.body },
  });
  await page.update(req.body);
  res.json(page);
}));

module.exports = { publicRouter, adminRouter };
