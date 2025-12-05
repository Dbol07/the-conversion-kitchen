// src/lib/dividers.ts

// Auto-import ALL divider images inside /src/assets/dividers
const dividerModules = import.meta.glob("/src/assets/dividers/*", {
  eager: true,
  import: "default",
});

// Convert imported modules into a usable array of URLs
const ALL_DIVIDERS: string[] = Object.values(dividerModules) as string[];

// Safety: ensure we have at least 1 divider to avoid crashes
if (ALL_DIVIDERS.length === 0) {
  console.warn("[Divider System] No divider images found in /src/assets/dividers/");
}

/* -------------------------------------------------
   PAGE-SPECIFIC MAPPINGS (OPTIONAL)
-------------------------------------------------- */

const PAGE_MAPPINGS: Record<string, string[]> = {
  dashboard: ALL_DIVIDERS,
  calculator: ALL_DIVIDERS,
  recipes: ALL_DIVIDERS,
  recipeDetails: ALL_DIVIDERS,
  printables: ALL_DIVIDERS,
  guide: ALL_DIVIDERS,
  faq: ALL_DIVIDERS,
  about: ALL_DIVIDERS,
};

/* -------------------------------------------------
   RANDOM PICKER
-------------------------------------------------- */

export function randomDivider(): string {
  if (ALL_DIVIDERS.length === 0) return "";
  const idx = Math.floor(Math.random() * ALL_DIVIDERS.length);
  return ALL_DIVIDERS[idx];
}

/* -------------------------------------------------
   MAIN EXPORT: getDividerForPage
-------------------------------------------------- */

export function getDividerForPage(page: string): string {
  const key = page.toLowerCase().trim();

  // Use mapped list if exists, otherwise random
  const list = PAGE_MAPPINGS[key];
  if (list && list.length > 0) {
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }

  return randomDivider();
}
