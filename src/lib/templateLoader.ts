import templateIndex from "@/templates/index.json";

export function getAllTemplates() {
  return templateIndex.templates;
}

export function getTemplateById(id: string) {
  return templateIndex.templates.find(t => t.id === id);
}

export async function loadTemplateFile(id: string) {
  const template = getTemplateById(id);
  if (!template) return null;

  try {
    const file = await import(`../templates/${template.file}`);
    return file;
  } catch (err) {
    console.error("Template load error:", err);
    return null;
  }
}
