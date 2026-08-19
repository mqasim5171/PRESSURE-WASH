const { Media } = require("../models");

/**
 * attachMediaUrls
 * -----------------
 * Batch-resolves `*MediaId` foreign keys into flat `*Url` fields on plain
 * response objects, in one query regardless of list size. Used instead of
 * Sequelize `include` associations because most models reference Media
 * through several differently-named FKs (thumbnail, banner, before, after,
 * ...), which would need a distinct association alias per FK - this is a
 * simpler, equally correct alternative for a read-heavy public API.
 *
 *   const items = await Service.findAll();
 *   const withUrls = await attachMediaUrls(items, [
 *     { idField: "thumbnailMediaId", urlField: "thumbnailUrl" },
 *     { idField: "bannerMediaId", urlField: "bannerUrl" },
 *   ]);
 */
async function attachMediaUrls(records, mappings) {
  const items = records.map((r) => (r?.get ? r.get({ plain: true }) : { ...r }));

  const ids = new Set();
  for (const item of items) {
    for (const { idField } of mappings) {
      if (item[idField]) ids.add(item[idField]);
    }
  }

  let urlById = new Map();
  if (ids.size > 0) {
    const mediaRows = await Media.findAll({ where: { id: [...ids] }, attributes: ["id", "url"] });
    urlById = new Map(mediaRows.map((m) => [m.id, m.url]));
  }

  for (const item of items) {
    for (const { idField, urlField } of mappings) {
      item[urlField] = item[idField] ? urlById.get(item[idField]) || null : null;
    }
  }
  return items;
}

async function attachMediaUrl(record, mappings) {
  if (!record) return record;
  const [result] = await attachMediaUrls([record], mappings);
  return result;
}

module.exports = { attachMediaUrls, attachMediaUrl };
