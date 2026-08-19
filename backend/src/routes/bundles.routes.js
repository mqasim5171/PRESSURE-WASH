const express = require("express");
const { Bundle } = require("../models");
const { buildAdminCrudRouter } = require("../utils/crudFactory");
const { asyncHandler } = require("../middleware/errorHandler");

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const bundles = await Bundle.findAll({ where: { published: true }, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(bundles);
}));

const adminRouter = buildAdminCrudRouter(Bundle, { searchFields: ["name"] });

module.exports = { publicRouter, adminRouter };
