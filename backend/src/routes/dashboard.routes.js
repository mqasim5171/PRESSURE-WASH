const express = require("express");
const { Op } = require("sequelize");
const { Lead, Service, Package, BlogPost, Review, Faq, ServiceArea } = require("../models");
const { requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();
router.use(requireAdmin);

router.get("/", asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalLeads, newLeads, leadsThisWeek, leadsThisMonth, recentLeads,
    totalServices, totalPackages,
    totalPosts, publishedPosts,
    totalReviews, totalFaqs, totalAreas,
  ] = await Promise.all([
    Lead.count(),
    Lead.count({ where: { status: "new" } }),
    Lead.count({ where: { createdAt: { [Op.gte]: startOfWeek } } }),
    Lead.count({ where: { createdAt: { [Op.gte]: startOfMonth } } }),
    Lead.findAll({ order: [["createdAt", "DESC"]], limit: 5 }),
    Service.count(),
    Package.count(),
    BlogPost.count(),
    BlogPost.count({ where: { status: "published" } }),
    Review.count(),
    Faq.count(),
    ServiceArea.count(),
  ]);

  res.json({
    leads: { total: totalLeads, new: newLeads, thisWeek: leadsThisWeek, thisMonth: leadsThisMonth, recent: recentLeads },
    services: { total: totalServices },
    packages: { total: totalPackages },
    blog: { total: totalPosts, published: publishedPosts, unpublished: totalPosts - publishedPosts },
    reviews: { total: totalReviews },
    faqs: { total: totalFaqs },
    areas: { total: totalAreas },
  });
}));

module.exports = router;
