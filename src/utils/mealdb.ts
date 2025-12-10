// src/utils/mealdb.ts

export interface MealDbRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strArea?: string;
  strCategory?: string;
  ingredients: { ingredient: string; measure: string }[];
}
// SEARCH MealDB recipes by keyword
export async function mealdbSearch(query: string) {
  const key = import.meta.env.VITE_MEALDB_KEY || "1";
  const url = `https://www.themealdb.com/api/json/v1/${key}/search.php?s=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("MealDB search failed");

  const data = await res.json();
  if (!data.meals) return [];

  // Convert to unified preview format expected by Recipes.tsx
  return data.meals.map((m: any) => ({
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
    source: "mealdb" as const,
  }));
}
                                                              

/* ----------------------------------------------------
   Fetch a FULL RECIPE by ID (MealDB Premium API)
---------------------------------------------------- */

export async function fetchMealDbRecipe(id: string): Promise<MealDbRecipe> {
  const key = import.meta.env.VITE_MEALDB_KEY || "1";

  const url = `https://www.themealdb.com/api/json/v1/${key}/lookup.php?i=${id}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`MealDB HTTP ${res.status}`);
  }

  const data = await res.json();

  if (!data.meals?.length) {
    throw new Error("Recipe not found");
  }

  const meal = data.meals[0];

  // Build ingredients array
  const ingredients: { ingredient: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];

    if (ing && ing.trim()) {
      ingredients.push({
        ingredient: ing.trim(),
        measure: meas?.trim() || "",
      });
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strInstructions: meal.strInstructions,
    strArea: meal.strArea,
    strCategory: meal.strCategory,
    ingredients,
  };
}
