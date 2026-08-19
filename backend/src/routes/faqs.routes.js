const express = require("express");
const { Faq, Service } = require("../models");
const { buildAdminCrudRouter } = require("../utils/crudFactory");
const { asyncHandler } = require("../middleware/errorHandler");

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  const { category } = req.query;
  const where = { published: true };
  if (category) where.category = category;
  const faqs = await Faq.findAll({ where, order: [["displayOrder", "ASC"], ["id", "ASC"]] });
  res.json(faqs);
}));

const adminRouter = buildAdminCrudRouter(Faq, {
  searchFields: ["question", "answer", "category"],
  include: [{ model: Service, as: "relatedService", attributes: ["id", "slug", "name"] }],
});

module.exports = { publicRouter, adminRouter };
