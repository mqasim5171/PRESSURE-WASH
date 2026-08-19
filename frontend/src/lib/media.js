// src/lib/media.js
//
// Uploaded media (Admin > Media) is served by the Node backend at
// /uploads/... - a relative path, which is correct in production where the
// backend serves the built frontend from the same origin (see
// backend/server.js). In local dev, the frontend (CRA, :3000) and backend
// (:3001) are different origins, so a bare "/uploads/..." <img src> asks
// the frontend dev server for it and 404s - it never reaches the backend
// at all. This resolves that specific prefix against REACT_APP_API_BASE;
// everything else (the site's own /images/... and /media/... static
// assets, which live in the frontend's own public/ folder) is left alone,
// since prefixing those with the backend's origin would be wrong.
const API_BASE = process.env.REACT_APP_API_BASE || "";

export function resolveMediaUrl(path) {
  if (!path) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE}${path}`;
  return path;
}
