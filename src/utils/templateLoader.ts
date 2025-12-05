export interface RecipeTemplate {
  name: string;
  servings: number;
  ingredients: {
    item: string;
    us: string;
    metric: string;
  }[];
  instructions?: string[];
  thumb: string;
  full: string;
}

export async function loadTemplates() {
  // Auto-import all JSON recipe files
  const jsonFiles = import.meta.glob("/src/assets/templates/*-template.json");
  const imageFiles = import.meta.glob("/src/assets/templates/*.{png,jpg,jpeg,webp}");

  const templates: RecipeTemplate[] = [];

  for (const path in jsonFiles) {
    const jsonModule = await jsonFiles[path]() as any;
    const data = jsonModule.default;

    const base = path
      .split("/")
      .pop()!
      .replace("-template.json", "");

    const thumbPath = Object.keys(imageFiles).find((f) =>
      f.includes(`${base}-template-thumb`)
    );

    const fullPath = Object.keys(imageFiles).find((f) =>
      f.includes(`${base}-template-full`)
    );

    templates.push({
      ...data,
      thumb: thumbPath ? thumbPath.replace("/src", "") : "",
      full: fullPath ? fullPath.replace("/src", "") : ""
    });
  }

  return templates;
}
