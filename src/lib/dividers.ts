import vine from "@/assets/dividers/vine-divider.png";
import mushroom from "@/assets/dividers/mushroom-divider.png";
import floral from "@/assets/dividers/floral-divider.png";
import starry from "@/assets/dividers/starry-divider.png";

const PAGE_DIVIDERS: Record<string, string> = {
  dashboard: vine,
  recipes: floral,
  recipeDetails: mushroom,
  calculator: vine,
  guide: floral,
  printables: mushroom,
  about: starry,
  faq: vine,
  templatePreview: floral,
};

export default function getDividerForPage(page: string) {
  return PAGE_DIVIDERS[page] || vine;
}
