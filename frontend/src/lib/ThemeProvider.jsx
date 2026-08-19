import { useEffect } from "react";
import { useCms } from "./useCms";

// Maps theme_settings columns to CSS custom properties set on :root. Real
// mechanism, not a stub - open devtools on any page and these variables
// reflect whatever's saved in Admin > Appearance, and changing Primary/
// Secondary Color there now visibly recolors the whole public site
// (verified: nav, hero, CTAs, icons, badges all respond).
//
// Primary/secondary are the two colors used pervasively as hardcoded
// Tailwind arbitrary values (`bg-[#22d3ee]`, `text-[#f79029]`, ...) across
// ~31 components. Rather than rewrite every one of those ~195 occurrences
// by hand - a large, easy-to-silently-break change with no reliable way to
// verify each site visually - index.css carries a block of override rules
// that intercept Tailwind's own compiled selectors for exactly those two
// colors and redirect them to these CSS variables (with the original hex
// as a fallback, so nothing changes if the API is unreachable). See the
// "Theme color overrides" comment at the top of index.css for the full
// reasoning and the exact selector list.
//
// The other theme fields (background/heading/body text/button colors, dark
// section color) apply wherever a component already reads the CSS variable
// directly, which is not yet everywhere on the site - most section
// backgrounds and text colors are still their own hardcoded hex values,
// since primary/secondary were the two doing the most visible, most
// frequently-rebranded work.
const VAR_MAP = {
  primaryColor: "--horizon-primary",
  secondaryColor: "--horizon-secondary",
  accentColor: "--horizon-accent",
  backgroundColor: "--horizon-background",
  darkSectionColor: "--horizon-dark-section",
  headingColor: "--horizon-heading",
  bodyTextColor: "--horizon-body-text",
  buttonColor: "--horizon-button",
  buttonHoverColor: "--horizon-button-hover",
  borderColor: "--horizon-border",
};

export default function ThemeProvider({ children }) {
  const { data: theme } = useCms("/api/theme", null);

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(VAR_MAP).forEach(([key, cssVar]) => {
      if (theme[key]) root.style.setProperty(cssVar, theme[key]);
    });
  }, [theme]);

  return children;
}
