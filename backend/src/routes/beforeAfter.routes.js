const express = require("express");
const { BeforeAfterResult } = require("../models");
const { buildAdminCrudRouter } = require("../utils/crudFactory");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls } = require("../utils/mediaUrls");

const MEDIA_FIELDS = [
  { idField: "beforeMediaId", urlField: "beforeUrl" },
  { idField: "afterMediaId", urlField: "afterUrl" },
  { idField: "mobileBeforeMediaId", urlField: "mobileBeforeUrl" },
  { idField: "mobileAfterMediaId", urlField: "mobileAfterUrl" },
];

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const { category } = req.query;
  const where = { published: true };
  if (category) where.category = category;
  const results = await BeforeAfterResult.findAll({ where, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(results, MEDIA_FIELDS));
}));

const adminRouter = buildAdminCrudRouter(BeforeAfterResult, { searchFields: ["title", "category", "location"], mediaFields: MEDIA_FIELDS });

module.exports = { publicRouter, adminRouter };
