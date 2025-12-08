export interface Printable {
  id: string;
  title: string;
  thumb: string;
  full: string;
  pdf: string;
}

// Utility to turn "printable-liquid" → "Liquid Conversions"
function formatTitle(id: string): string {
  const formatted = id
    .replace("printable-", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return formatted;
}

// -----------------------------
// MAIN LOADER
// -----------------------------
export function loadPrintables(): Printable[] {
  // Import JPG previews
  const images = import.meta.glob("/src/assets/printables/*.jpg", {
    eager: true,
  }) as Record<string, { default: string }>;

  // Import PDFs
  const pdfs = import.meta.glob("/src/assets/printables/*.pdf", {
    eager: true,
  }) as Record<string, { default: string }>;

  const items: Printable[] = [];

  for (const path in images) {
    const file = path.split("/").pop()!.replace(".jpg", "");

    // Example: "printable-liquid"
    const id = file;

    const pdfPath = `/src/assets/printables/${id}.pdf`;
    const pdf = pdfs[pdfPath]?.default || "";

    items.push({
      id,
      title: formatTitle(id),
      thumb: images[path].default,
      full: images[path].default, // Same image for full view
      pdf,
    });
  }

  return items;
}
