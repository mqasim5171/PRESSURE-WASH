const slugify = require("slugify");

/**
 * uniqueSlugAcross
 * ------------------
 * Packages and Bundles are both looked up at the public /packages/:slug URL
 * (PackageDetail.jsx tries Package first, then Bundle) - so their slugs
 * need to be unique across BOTH tables combined, not just within their own
 * table. Checking only one table let a Package and a Bundle both legitimately
 * claim "solar-care" independently, silently making one of them unreachable
 * at its own URL (the other would always win the lookup) - this is the fix.
 *
 *   uniqueSlugAcross(rawBase, [{ model: Package, ignoreId }, { model: Bundle }])
 */
async function uniqueSlugAcross(rawBase, tables) {
  const base = slugify(String(rawBase || "package"), { lower: true, strict: true }) || "package";
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let taken = false;
    for (const { model, ignoreId } of tables) {
      const where = { slug: candidate };
      if (ignoreId) where.id = { [require("sequelize").Op.ne]: ignoreId };
      // eslint-disable-next-line no-await-in-loop
      if (await model.findOne({ where })) { taken = true; break; }
    }
    if (!taken) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

module.exports = { uniqueSlugAcross };
