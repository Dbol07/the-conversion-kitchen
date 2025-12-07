import fallbackIcon from "@/assets/fallback/farm-fallback.png";

/**
 * Build a map of all real assets inside src/assets
 * using Vite's import.meta.glob (safe for build & runtime).
 */
const assetMap: Record<string, string> = {};

const modules = import.meta.glob("/src/assets/**/*", {
  eager: true,
});

// Example key transformation:
// "/src/assets/icons/farm/wheat.png" → "icons/farm/wheat.png"
for (const path in modules) {
  const mod = modules[path] as any;
  const cleaned = path.replace("/src/assets/", "");
  assetMap[cleaned] = mod.default;
}

/**
 * Retrieves an asset by relative path inside src/assets/.
 * 
 * Example:
 *   getIcon("icons/farm/wheat.png")
 */
export function getIcon(relativePath: string): string {
  // Remove any leading "./" or "/" or "../"
  const cleaned = relativePath
    .replace(/^\.?\//, "")    // remove leading "./" or "/"
    .replace(/^assets\//, "") // allow passing "assets/icons/..."
    .replace(/^src\//, "");   // allow passing "src/assets/icons/..."

  return assetMap[cleaned] ?? fallbackIcon;
}
