const express = require("express");
const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");
const { Lead, Package } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const rateLimit = require("../utils/simpleRateLimit");

const router = express.Router();

const submitLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

// ---------------------------------------------------------------------------
// PUBLIC: submit a lead from any form on the site. This is the single entry
// point every public form (hero, contact page, quote modal, area pages...)
// posts to. Saved to MySQL first and unconditionally - nothing downstream
// (e.g. a future email notification) can prevent the lead from persisting.
// ---------------------------------------------------------------------------
router.post(
  "/",
  submitLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("Must be a valid email."),
    body("phone").optional({ checkFalsy: true }).trim(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone, address, suburb, zipCode, service, packageId, message, sourcePage } = req.body;
    const lead = await Lead.create({
      name, email, phone, address, suburb, zipCode, service,
      packageId: packageId || null,
      message: message || "",
      sourcePage: sourcePage || "",
    });

    res.status(201).json({ success: true, id: lead.id });
  })
);

// ---------------------------------------------------------------------------
// ADMIN: everything below requires a valid session.
// ---------------------------------------------------------------------------
router.use("/admin", requireAdmin);

router.get("/admin", asyncHandler(async (req, res) => {
  const { status, service, search, sort = "newest", page = 1, pageSize = 50 } = req.query;
  const where = {};
  if (status) where.status = status;
  if (service) where.service = service;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { suburb: { [Op.like]: `%${search}%` } },
    ];
  }
  const limit = Math.min(200, Number(pageSize) || 50);
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;

  const { rows, count } = await Lead.findAndCountAll({
    where,
    order: [["createdAt", sort === "oldest" ? "ASC" : "DESC"]],
    limit,
    offset,
    include: [{ model: Package, as: "package", attributes: ["id", "name", "slug"] }],
  });

  res.json({ items: rows, total: count, page: Number(page) || 1, pageSize: limit });
}));

router.get("/admin/stats", asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, newCount, thisWeek, thisMonth] = await Promise.all([
    Lead.count(),
    Lead.count({ where: { status: "new" } }),
    Lead.count({ where: { createdAt: { [Op.gte]: startOfWeek } } }),
    Lead.count({ where: { createdAt: { [Op.gte]: startOfMonth } } }),
  ]);
  res.json({ total, new: newCount, thisWeek, thisMonth });
}));

router.get("/admin/export.csv", asyncHandler(async (req, res) => {
  const leads = await Lead.findAll({ order: [["createdAt", "DESC"]] });
  const header = ["id", "name", "email", "phone", "suburb", "zipCode", "service", "status", "sourcePage", "message", "notes", "createdAt"];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = leads.map((l) => header.map((h) => escape(l[h])).join(","));
  const csv = [header.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.send(csv);
}));

router.get("/admin/:id", asyncHandler(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id, { include: [{ model: Package, as: "package" }] });
  if (!lead) return res.status(404).json({ error: "Not found." });
  res.json(lead);
}));

router.put("/admin/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) return res.status(404).json({ error: "Not found." });
  const { status, notes } = req.body;
  if (status !== undefined) lead.status = status;
  if (notes !== undefined) lead.notes = notes;
  await lead.save();
  res.json(lead);
}));

router.delete("/admin/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) return res.status(404).json({ error: "Not found." });
  await lead.destroy();
  res.json({ success: true });
}));

module.exports = router;
