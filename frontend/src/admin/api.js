// src/admin/api.js
//
// Thin fetch wrapper for every admin API call. Always sends the httpOnly
// session cookie (credentials: 'include'), and attaches the CSRF-mitigating
// custom header the backend requires on every mutating request (see
// backend/src/middleware/auth.js).
const API_BASE = process.env.REACT_APP_API_BASE || "";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data; // full parsed error body, e.g. { error, problems }
  }
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  if (method !== "GET") headers["X-Horizon-Admin"] = "1";
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, formData) => request(path, { method: "POST", body: formData, isForm: true }),
};

export { ApiError };
