import { useCms } from "./useCms";

/**
 * useHomepageSection
 * ---------------------
 * Reads one row from Admin > Homepage's JSON-content sections (Combined
 * Services, Three Faults, Why Us Stats, Same Roof Story) by its stable
 * sectionKey. All four public components share this instead of each
 * re-implementing "fetch the list, find my key" - see JsonSectionEditor.jsx
 * for the admin-side editor these rows come from.
 *
 * `enabled` defaults to true when no row exists yet (a fresh install before
 * any admin save) so the static fallback content that ships in each
 * component still shows, rather than the section vanishing outright.
 */
export function useHomepageSection(sectionKey) {
  const { data: sections } = useCms("/api/homepage/sections", null);
  const section = sections?.find((s) => s.sectionKey === sectionKey);
  return {
    content: section?.content || null,
    enabled: section ? section.enabled : true,
  };
}
