//-----------------------------------------------------
// Spoonacular Usage + API Wrapper (Final Version)
//-----------------------------------------------------

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

// Soft usage tracking (local only)
let spoonacularCallsToday = 0;

function trackCall() {
  spoonacularCallsToday++;
  return spoonacularCallsToday;
}

// Export so Recipes.tsx can display warnings
export function getSpoonUsage() {
  return spoonacularCallsToday;
}

//-----------------------------------------------------
// SIMPLE SEARCH (used in Recipes.tsx fallback)
//-----------------------------------------------------
export async function searchSpoonacular(query: string) {
  if (!API_KEY) {
    console.warn("[Spoonacular] Missing API key");
    return { ok: false, reason: "missing-key", data: [] };
  }

  if (spoonacularCallsToday >= 50) {
    return { ok: false, reason: "limit", data: [] };
  }

  trackCall();

  const url = `${BASE_URL}/complexSearch?query=${encodeURIComponent(
    query
  )}&number=20&addRecipeInformation=true&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { ok: false, reason: "http", data: [] };
    }

    const json = await res.json();
    const list = json.results || [];

    // Normalize Recipe Format
    const mapped = list.map((r: any) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      source: "spoonacular",
    }));

    return { ok: true, data: mapped };
  } catch (err) {
    console.error(err);
    return { ok: false, reason: "network", data: [] };
  }
}

//-----------------------------------------------------
// FULL RECIPE FETCH (used by RecipeDetails.tsx fallback)
//-----------------------------------------------------
export async function fetchSpoonacularRecipe(id: string) {
  if (!API_KEY) {
    console.warn("[Spoonacular] Missing API key");
    return null;
  }

  if (spoonacularCallsToday >= 50) {
    console.warn("[Spoonacular] Daily limit exceeded");
    return null;
  }

  trackCall();

  const url = `${BASE_URL}/${id}/information?includeNutrition=true&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.summary?.replace(/<[^>]+>/g, "") || "",
      servings: data.servings ?? null,
      ingredients:
        data.extendedIngredients?.map((i: any) => ({
          ingredient: i.name,
          measure: i.original,
        })) || [],
      instructions:
        data.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) || [],
      tempF: data.temperature?.us || null,
      tempC: data.temperature?.metric || null,
      tempFan: null,
      tempGas: null,
      source: "spoonacular",
    };
  } catch (err) {
    console.error("[Spoonacular Error]", err);
    return null;
  }
}

//-----------------------------------------------------
// LEGACY COMPATIBILITY WRAPPER
// Recipes.tsx calls this function
//-----------------------------------------------------
export async function trackedSpoonFetch(query: string) {
  console.log("[trackedSpoonFetch] Query:", query);

  const result = await searchSpoonacular(query);

  if (!result.ok) {
    return { ok: false, data: [] };
  }

  return { ok: true, data: result.data };
}
