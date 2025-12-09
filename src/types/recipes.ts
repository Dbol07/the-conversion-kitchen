// src/types/recipes.ts
// Unified recipe typing for TheMealDB + Spoonacular hybrid system

// ---------------------------------------------
// Preview shown in the Recipes grid
// ---------------------------------------------
export interface UnifiedRecipePreview {
  id: string;                         // stringified id from both APIs
  title: string;
  image: string;
  source: "mealdb" | "spoonacular";   // tells details page which API to load
}

// ---------------------------------------------
// Details shown in RecipeDetails page
// ---------------------------------------------
export interface UnifiedRecipeDetails {
  id: string;
  title: string;
  image: string;

  // Clean normalized instructions
  instructions: string[];

  // Ingredients normalized as simple objects:
  //  { original: "2 cups sugar" }
  ingredients: { original: string }[];

  // Optional metadata
  servings?: number;
  category?: string;                   // MealDB category or Spoonacular dishType
  area?: string;                       // MealDB region / Spoonacular cuisine

  source: "mealdb" | "spoonacular";    // again identifies the API used
}

// ---------------------------------------------
// Raw MealDB format (internal use only)
// ---------------------------------------------
export interface MealDBRaw {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;

  // MealDB stores ingredients like:
  // strIngredient1, strIngredient2, ...
  // strMeasure1, strMeasure2, ...
  [key: string]: any;
}

export interface MealDBResponse {
  meals: MealDBRaw[] | null;
}

// ---------------------------------------------
// Raw Spoonacular format (internal use only)
// ---------------------------------------------
export interface SpoonacularPreviewRaw {
  id: number;
  title: string;
  image: string;
}

export interface SpoonacularDetailRaw {
  id: number;
  title: string;
  image: string;
  summary?: string;
  servings?: number;

  extendedIngredients?: {
    original: string;
  }[];

  analyzedInstructions?: {
    steps: { number: number; step: string }[];
  }[];

  cuisines?: string[];
  dishTypes?: string[];
}
