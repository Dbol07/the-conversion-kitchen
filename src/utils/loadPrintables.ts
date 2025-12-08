export function loadPrintables() {
  const jpgs = import.meta.glob("@/assets/printables/*.jpg", { eager: true });
  const pdfs = import.meta.glob("@/assets/printables/*.pdf", { eager: true });

  const items = Object.keys(jpgs).map((key) => {
    const baseName = key.split("/").pop()!.replace(".jpg", "");

    return {
      id: baseName,
      preview: jpgs[key].default,
      pdf: pdfs[`/src/assets/printables/${baseName}.pdf`]?.default || null
    };
  });

  return items;
}
