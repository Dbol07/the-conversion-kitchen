// src/lib/templateLoader.ts

import templateIndex from "@/templates/index.json";

// Let Vite know exactly which files exist
const templateModules = import.meta.glob("../templates/*.json");

export function getAllTemplates() {
  return templateIndex.templates;
}

export function getTemplateById(id: string) {
  return templateIndex.templates.find((t) => t.id === id);
}

export async function loadTemplateFile(id: string) {
  const template = getTemplateById(id);
  if (!template) return null;

  const importPath = `../templates/${template.file}`;

  // Only try to load if Vite saw the file at build time
  const loader = templateModules[importPath];
  if (!loader) {
    console.error("Template file not found:", importPath);
    return null;
  }

  const mod: any = await loader();
  return mod.default || mod;
}
