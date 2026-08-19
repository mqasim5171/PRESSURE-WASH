// Central error handler - every route wrapped in asyncHandler() funnels
// errors here. Production responses never leak stack traces, SQL, or
// filesystem paths; full detail still goes to the server log for
// debugging.
function errorHandler(err, req, res, _next) {
  // Multer's own errors (oversized file, too many files, ...) don't set
  // `.status` - they're always a client input problem, so map them to 400
  // rather than falling through to a generic 500.
  if (err.name === "MulterError") err.status = 400;

  const status = err.status || 500;
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  const isProd = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: isProd && status === 500 ? "Something went wrong. Please try again." : err.message,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found." });
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, notFoundHandler, asyncHandler };
