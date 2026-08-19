// src/lib/submitLead.js
//
// Single place every public form on the site submits a lead through. Posts
// straight to MySQL via the Node/Express backend (Admin > Leads) - the old
// Google Sheets integration has been retired per the client's decision to
// use the database as the single source of truth for leads.
const API_BASE = process.env.REACT_APP_API_BASE || "";

export async function submitLead({
  name, email, phone, address, suburb, zipCode, service, packageId,
  propertyType, contactPreference, message, sourcePage,
}) {
  // propertyType/contactPreference aren't modelled as their own Lead
  // columns (see backend/src/models/index.js) - folded into the message so
  // the context isn't silently dropped rather than adding narrow one-off
  // columns for two optional extras.
  const extra = [
    propertyType ? `Property type: ${propertyType}` : null,
    contactPreference ? `Preferred contact: ${contactPreference}` : null,
  ].filter(Boolean).join(" · ");
  const fullMessage = [message, extra].filter(Boolean).join("\n\n");

  const res = await fetch(`${API_BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name, email, phone, address, suburb, zipCode: zipCode || undefined,
      service, packageId: packageId || undefined,
      message: fullMessage, sourcePage,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || "Failed to submit. Please try again.");
  }
  return res.json();
}
