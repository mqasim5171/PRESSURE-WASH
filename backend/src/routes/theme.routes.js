const express = require("express");
const { ThemeSetting } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validateThemeContrast } = require("../utils/contrast");

const publicRouter = express.Router();
publicRouter.get("/", asyncHandler(async (req, res) => {
  res.json(await ThemeSetting.findByPk(1));
}));

const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get("/", asyncHandler(async (req, res) => {
  res.json(await ThemeSetting.findByPk(1));
}));

adminRouter.put("/", requireCustomHeader, asyncHandler(async (req, res) => {
  const [theme] = await ThemeSetting.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
  const merged = { ...theme.get({ plain: true }), ...req.body };

  const problems = validateThemeContrast(merged);
  if (problems.length && !req.body.force) {
    return res.status(422).json({ error: "This color combination may be hard to read.", problems });
  }

  await theme.update(req.body);
  res.json(theme);
}));

module.exports = { publicRouter, adminRouter };
