const multer = require("multer");

// Buffer storage - the file never touches disk with its original name/path.
// The upload route decides the final, generated filename and writes it
// itself (after passing the buffer through sharp), so nothing here trusts
// user-supplied filenames or extensions for anything security-relevant.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error("Only JPG, PNG and WebP images are allowed.");
    err.status = 400;
    return cb(err);
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
});

module.exports = { upload, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES };
