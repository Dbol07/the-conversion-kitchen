// src/utils/mealdb.ts
// TheMealDB Premium integration + smart search helper

const RAW_KEY = import.meta.env.VITE_MEALDB_KEY || "1";

// If you have a premium key, TheMealDB uses v2/{KEY}
// If not, it uses the old free v1/1 endpoint.
const MEALDB_BASE =
  RAW_KEY && RAW_KEY !== "1"
    ? `https://www.themealdb.com/api/json/v2/${RAW_KEY}`
    : "https://www.themealdb.com/api/json/v1/1";

type MealDbApiMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
  strArea: string | null;
  strCategory: string | null;
  strInstructions: string | null;
  strTags: string | null;
  // plus the ingredient/measure fields we’ll read dynamically:
  [key: string]: any;
};

export interface MealDbSearchResult {
  id: number;
  title: string;
  image: string;
  area?: string;
  category?: string;
}

export interface MealDbDetails extends MealDbSearchResult {
  instructions: string;
  tags: string[];
  ingredients: { ingredient: string; measure: string }[];
}

/**
 * Low-level fetch helper
 */
async function callMealDb(
  path: string,
  params: Record<string, string>
): Promise<MealDbApiMeal[]> {
  const url = new URL(MEALDB_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  console.log("[MealDB] Fetch →", url.toString());

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`MealDB error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { meals: MealDbApiMeal[] | null };
  return data.meals ?? [];
}

/**
 * Normalize a MealDB meal into a detail object
 */
function normalizeMealDetails(meal: MealDbApiMeal): MealDbDetails {
  const ingredients: { ingredient: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = (meal[`strIngredient${i}`] as string | null)?.trim();
    const measure = (meal[`strMeasure${i}`] as string | null)?.trim();
    if (ing && ing.length > 0) {
      ingredients.push({
        ingredient: ing,
        measure: measure || "",
      });
    }
  }

  const tags =
    meal.strTags?.split(",").map((t: string) => t.trim()).filter(Boolean) ?? [];

  return {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    image: meal.strMealThumb || "",
    area: meal.strArea || undefined,
    category: meal.strCategory || undefined,
    instructions: meal.strInstructions || "",
    tags,
    ingredients,
  };
}

/**
 * Normalize a MealDB meal into a lightweight search result
 */
function normalizeMealSearch(meal: MealDbApiMeal): MealDbSearchResult {
  return {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    image: meal.strMealThumb || "",
    area: meal.strArea || undefined,
    category: meal.strCategory || undefined,
  };
}

/**
 * Smart MealDB search:
 * - Single word → treat as ingredient first (filter.php?i=), then fallback to name search.
 * - Multi-word → treat as recipe name first (search.php?s=),
 *   then fallback to ingredient using the first “clean” word.
 */
export async function mealdbSearch(
  rawQuery: string
): Promise<MealDbSearchResult[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const lower = query.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);

  const isSingleWord = words.length === 1;

  async function searchByName(q: string) {
    const meals = await callMealDb("/search.php", { s: q });
    return meals.map(normalizeMealSearch);
  }

  async function searchByIngredient(word: string) {
    const meals = await callMealDb("/filter.php", { i: word });
    // filter.php doesn’t always include area/category, so we only map what we have
    return meals.map((meal) => ({
      id: Number(meal.idMeal),
      title: meal.strMeal,
      image: meal.strMealThumb || "",
      area: undefined,
      category: undefined,
    }));
  }

  let results: MealDbSearchResult[] = [];

  if (isSingleWord) {
    // Example: "chicken", "goat", "beef"
    console.log("[MealDB] Ingredient-first search:", lower);
    results = await searchByIngredient(lower);

    if (!results.length) {
      console.log("[MealDB] No ingredient matches, trying name search");
      results = await searchByName(lower);
    }
  } else {
    // Example: "chicken curry", "goat stew"
    console.log("[MealDB] Name-first search:", lower);
    results = await searchByName(lower);

    if (!results.length) {
      // fallback: grab first “ingredient-ish” word (letters only)
      const ingredientWord =
        words.find((w) => /^[a-zA-Z]+$/.test(w)) ?? words[0];
      console.log(
        "[MealDB] Name search empty, trying ingredient:",
        ingredientWord
      );
      results = await searchByIngredient(ingredientWord);
    }
  }

  console.log("[MealDB] Final smart results:", results.length);
  return results;
}

/**
 * Lookup full details by ID (used by details page, if needed)
 */
export async function mealdbLookup(id: string): Promise<MealDbDetails | null> {
  const meals = await callMealDb("/lookup.php", { i: id });
  if (!meals.length) return null;
  return normalizeMealDetails(meals[0]);
}
