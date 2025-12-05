// Divider registry — every page pulls from here automatically

export type DividerVariant =
  | "default"
  | "vine"
  | "vine-light"
  | "mushroom"
  | "mushroom-wide"
  | "floral"
  | "floral-thin"
  | "flower";

export const dividerMap: Record<DividerVariant, string> = {
  default: new URL("@/assets/dividers/divider-vine.png", import.meta.url).href,
  vine: new URL("@/assets/dividers/divider-vine.png", import.meta.url).href,
  "vine-light": new URL("@/assets/dividers/divider-vine-light.png", import.meta.url).href,

  mushroom: new URL("@/assets/dividers/divider-mushroom.png", import.meta.url).href,
  "mushroom-wide": new URL("@/assets/dividers/divider-mushroom-wide.png", import.meta.url).href,

  floral: new URL("@/assets/dividers/divider-floral.png", import.meta.url).href,
  "floral-thin": new URL("@/assets/dividers/divider-floral-thin.png", import.meta.url).href,

  flower: new URL("@/assets/dividers/divider-flower.png", import.meta.url).href,
};
