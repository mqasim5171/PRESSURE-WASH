const express = require("express");
const { Op } = require("sequelize");
const { Media } = require("../models");
const { requireAdmin, requireCustomHeader } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { upload } = require("../middleware/upload");
const { processAndStoreImage, deleteStoredImage } = require("../utils/imageProcessor");

const router = express.Router();
router.use(requireAdmin);

// List / search the media library
router.get("/", asyncHandler(async (req, res) => {
  const { search, page = 1, pageSize = 60 } = req.query;
  const where = search ? { [Op.or]: [{ filename: { [Op.like]: `%${search}%` } }, { altText: { [Op.like]: `%${search}%` } }] } : {};
  const limit = Math.min(200, Number(pageSize) || 60);
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;
  const { rows, count } = await Media.findAndCountAll({ where, order: [["uploadedAt", "DESC"]], limit, offset });
  res.json({ items: rows, total: count, page: Number(page) || 1, pageSize: limit });
}));

// Upload a new image. `category` groups files under /uploads/<category>/
// (hero, services, packages, blog, reviews, before-after, general).
router.post("/upload", requireCustomHeader, upload.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const category = (req.body.category || "general").toLowerCase();

  const stored = await processAndStoreImage({
    buffer: req.file.buffer,
    mimetype: req.file.mimetype,
    category,
  });

  const media = await Media.create({
    url: stored.url,
    storagePath: stored.storagePath,
    filename: req.file.originalname?.slice(0, 200) || stored.filename,
    altText: req.body.altText || "",
    width: stored.width,
    height: stored.height,
    sizeBytes: stored.sizeBytes,
  });

  res.status(201).json(media);
}));

router.put("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const media = await Media.findByPk(req.params.id);
  if (!media) return res.status(404).json({ error: "Not found." });
  if (req.body.altText !== undefined) media.altText = req.body.altText;
  await media.save();
  res.json(media);
}));

router.delete("/:id", requireCustomHeader, asyncHandler(async (req, res) => {
  const media = await Media.findByPk(req.params.id);
  if (!media) return res.status(404).json({ error: "Not found." });

  // Refuse to delete an image that's still referenced somewhere, so admins
  // can't accidentally break a live page - list every model with a
  // media FK and check usage before removing the file + row.
  const { Service, Package, Bundle, Review, BlogPost, ServiceArea, HeroSlide, BeforeAfterResult, PageContent, SiteSetting } = require("../models");
  const id = media.id;
  const usageChecks = await Promise.all([
    Service.count({ where: { [Op.or]: [{ thumbnailMediaId: id }, { bannerMediaId: id }] } }),
    Package.count({ where: { [Op.or]: [{ packageImageMediaId: id }, { packageMobileImageMediaId: id }] } }),
    Bundle.count({ where: { [Op.or]: [{ imageMediaId: id }, { mobileImageMediaId: id }] } }),
    Review.count({ where: { avatarMediaId: id } }),
    BlogPost.count({ where: { [Op.or]: [{ featuredImageMediaId: id }, { ogImageMediaId: id }] } }),
    ServiceArea.count({ where: { imageMediaId: id } }),
    HeroSlide.count({ where: { [Op.or]: [
      { imageMediaId: id }, { mobileImageMediaId: id },
      { beforeImageMediaId: id }, { afterImageMediaId: id },
      { mobileBeforeImageMediaId: id }, { mobileAfterImageMediaId: id },
    ] } }),
    BeforeAfterResult.count({ where: { [Op.or]: [
      { beforeMediaId: id }, { afterMediaId: id },
      { mobileBeforeMediaId: id }, { mobileAfterMediaId: id },
    ] } }),
    PageContent.count({ where: { heroMediaId: id } }),
    SiteSetting.count({ where: { [Op.or]: [{ logoMediaId: id }, { logoLightMediaId: id }, { faviconMediaId: id }, { footerLogoMediaId: id }] } }),
  ]);
  if (usageChecks.some((n) => n > 0)) {
    return res.status(409).json({ error: "This image is still used elsewhere on the site. Replace it there first." });
  }

  await deleteStoredImage(media.storagePath);
  await media.destroy();
  res.json({ success: true });
}));

module.exports = router;
