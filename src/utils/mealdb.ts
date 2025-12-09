// src/utils/mealdb.ts
// TheMealDB Premium integration for The Conversion Kitchen PWA

// ===========================================
// 🔑 PREMIUM API KEY // ===========================================
const MEALDB_KEY = "65232507";

// Premium API base
const BASE = `https://www.themealdb.com/api/json/v2/${MEALDB_KEY}`;

// ---------------------------------------------------------
// TYPE DEFINITIONS (raw from API)
// ---------------------------------------------------------

export interface MealDBRaw {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  [key: string]: any; // allow ingredient fields dynamically
}

export interface MealDBResponse {
  meals: MealDBRaw[] | null;
}

// ---------------------------------------------------------
// NORMALIZED TYPES (your PWA format)
// ---------------------------------------------------------

export interface UnifiedRecipePreview {
  id: string;
  title: string;
  image: string;
  source: "mealdb" | "spoonacular";
}

export interface UnifiedRecipeDetails {
  id: string;
  title: string;
  image: string;
  instructions: string[];
  ingredients: { original: string }[];
  servings?: number;
  source: "mealdb" | "spoonacular";
  category?: string;
  area?: string;
}

// ---------------------------------------------------------
// INTERNAL HELPERS
// ---------------------------------------------------------

// Extract ingredients from messy MealDB raw fields
function extractIngredients(meal: MealDBRaw): { original: string }[] {
  const list: { original: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];

    if (ing && ing.trim()) {
      const line = meas && meas.trim()
        ? `${meas.trim()} ${ing.trim()}`
        : ing.trim();

      list.push({ original: line });
    }
  }

  return list;
}

// MealDB instructions come as one block — split into clean steps
function extractInstructions(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|\./)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

// ---------------------------------------------------------
// 🔍 SEARCH (MealDB Premium)
// ---------------------------------------------------------

export async function mealdbSearch(query: string): Promise<UnifiedRecipePreview[]> {
  if (!query || query.trim().length === 0) return [];

  const url = `${BASE}/search.php?s=${encodeURIComponent(query)}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.warn("[MealDB] Search request failed", res.status);
    return [];
  }

  const data: MealDBResponse = await res.json();
  if (!data.meals) return [];

  return data.meals.map((meal) => ({
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb || "",
    source: "mealdb" as const,
  }));
}

// ---------------------------------------------------------
// 📘 LOOKUP FULL DETAILS (MealDB Premium)
// ---------------------------------------------------------

export async function mealdbLookup(id: string): Promise<UnifiedRecipeDetails | null> {
  const url = `${BASE}/lookup.php?i=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.warn("[MealDB] Lookup request failed", res.status);
    return null;
  }

  const data: MealDBResponse = await res.json();
  if (!data.meals || data.meals.length === 0) return null;

  const meal = data.meals[0];

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb || "",
    instructions: extractInstructions(meal.strInstructions),
    ingredients: extractIngredients(meal),
    servings: 1, // MealDB does not provide servings — default to 1
    category: meal.strCategory || undefined,
    area: meal.strArea || undefined,
    source: "mealdb",
  };
}
