// Minimal WCAG relative-luminance contrast check, used to stop the theme
// editor from saving combinations that would make the site unreadable
// (e.g. near-white body text on a near-white background).
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return null; // not a plain hex (e.g. an rgba() border color) - skip the check
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Returns an array of human-readable problems, empty if the theme passes.
 * WCAG AA for normal text is 4.5:1 - used here as the floor.
 */
function validateThemeContrast(theme) {
  const problems = [];
  const pairs = [
    ["headingColor", "backgroundColor", "Heading color"],
    ["bodyTextColor", "backgroundColor", "Body text color"],
    ["headingColor", "darkSectionColor", "Heading color (on dark sections)"],
    ["bodyTextColor", "darkSectionColor", "Body text color (on dark sections)"],
  ];
  for (const [fgKey, bgKey, label] of pairs) {
    const ratio = contrastRatio(theme[fgKey], theme[bgKey]);
    if (ratio !== null && ratio < 4.5) {
      problems.push(`${label} doesn't have enough contrast against the background (${ratio.toFixed(2)}:1, needs at least 4.5:1).`);
    }
  }
  return problems;
}

module.exports = { validateThemeContrast, contrastRatio };
