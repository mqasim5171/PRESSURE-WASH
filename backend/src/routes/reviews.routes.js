const express = require("express");
const { Review } = require("../models");
const { buildAdminCrudRouter } = require("../utils/crudFactory");
const { asyncHandler } = require("../middleware/errorHandler");
const { attachMediaUrls } = require("../utils/mediaUrls");

const MEDIA_FIELDS = [{ idField: "avatarMediaId", urlField: "avatarUrl" }];

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const where = { published: true };
  if (featured === "1") where.featured = true;
  const reviews = await Review.findAll({ where, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(await attachMediaUrls(reviews, MEDIA_FIELDS));
}));

const adminRouter = buildAdminCrudRouter(Review, { searchFields: ["customerName", "reviewText", "location"], mediaFields: MEDIA_FIELDS });

module.exports = { publicRouter, adminRouter };
