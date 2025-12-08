// -----------------------------
// Template Types
// -----------------------------
export interface RecipeTemplate {
  id: string;               // "cookie", "bread", etc.
  name: string;             // Recipe title
  ingredients: string[];    // Ingredients list
  instructions?: string[];  // Optional instructions
  image: string;            // Full image file
  thumb: string;            // Thumbnail image file
}

// -----------------------------
// Internal Cache
// -----------------------------
let cachedTemplates: RecipeTemplate[] | null = null;

// -----------------------------
// Load ALL Templates (JSON + Images)
// -----------------------------
export async function loadTemplates(): Promise<RecipeTemplate[]> {
  if (cachedTemplates) return cachedTemplates;

  // Load all recipe JSON files (eager = synchronous-like behavior)
  const jsonFiles = import.meta.glob("/src/assets/templates/*-template.json", { eager: true }) as Record<
    string,
    { default: any }
  >;

  // Load all template images
  const imageFiles = import.meta.glob("/src/assets/templates/*.{png,jpg,jpeg,webp}", {
    eager: true,
  }) as Record<string, { default: string }>;

  const templates: RecipeTemplate[] = [];

  // Process JSON files
  for (const path in jsonFiles) {
    const data = jsonFiles[path].default;

    // Extract base filename, e.g. "cookie" from "cookie-template.json"
    const base = path.split("/").pop()!.replace("-template.json", "");

    // Find images matching base name
    const thumb = Object.keys(imageFiles).find((f) =>
      f.includes(`${base}-template-thumb`)
    );
    const full = Object.keys(imageFiles).find((f) =>
      f.includes(`${base}-template-full`)
    );

    templates.push({
      id: base,
      name: data.name,
      ingredients: data.ingredients,
      instructions: data.instructions || [],
      image: full ? imageFiles[full].default : "",
      thumb: thumb ? imageFiles[thumb].default : "",
    });
  }

  cachedTemplates = templates;
  return templates;
}

// -----------------------------
// Get ALL Templates (Sync-friendly)
// -----------------------------
export function getAllTemplates(): RecipeTemplate[] {
  // Because we used eager imports above, this is safe
  if (!cachedTemplates) {
    // Fire loader without awaiting, because eager imports resolve instantly
    loadTemplates();
  }
  return cachedTemplates || [];
}

// -----------------------------
// Get Template by ID (name in URL)
// -----------------------------
export function getTemplateById(id: string): RecipeTemplate | undefined {
  const all = getAllTemplates();
  return all.find((t) => t.id.toLowerCase() === id.toLowerCase());
}
