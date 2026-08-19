const express = require("express");
const { SiteSetting } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrl } = require("../utils/mediaUrls");

const IMAGE_FIELDS = [
  { idField: "logoMediaId", urlField: "logoUrl" },
  { idField: "logoLightMediaId", urlField: "logoLightUrl" },
  { idField: "faviconMediaId", urlField: "faviconUrl" },
  { idField: "footerLogoMediaId", urlField: "footerLogoUrl" },
];

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const settings = await SiteSetting.findByPk(1);
  res.json(await attachMediaUrl(settings, IMAGE_FIELDS));
}));

const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get("/", asyncHandler(async (req, res) => {
  const settings = await SiteSetting.findByPk(1);
  res.json(await attachMediaUrl(settings, IMAGE_FIELDS));
}));

adminRouter.put("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const [settings] = await SiteSetting.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
  await settings.update(req.body);
  res.json(await attachMediaUrl(settings, IMAGE_FIELDS));
}));

module.exports = { publicRouter, adminRouter };
