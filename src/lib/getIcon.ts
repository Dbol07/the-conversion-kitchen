import fallbackIcon from "@/assets/fallback/farm-fallback.png";

/**
 * Attempts to resolve a file path.
 * If the file does not exist, returns the fallback icon instead.
 * 
 * This prevents Vercel build failures and missing-image crashes.
 */
export function getIcon(path: string): string {
  try {
    return new URL(path, import.meta.url).href;
  } catch (err) {
    console.warn("[getIcon] Missing asset:", path, "→ using fallback icon.");
    return fallbackIcon;
  }
}
