// Ingredient density table for mass <-> volume conversion
// Values represent grams per 1 cup unless otherwise noted.

export const ingredientDensities: Record<string, number> = {
  // Baking basics
  flour: 120,              // g per cup (AP flour)
  "all-purpose flour": 120,
  sugar: 200,              // granulated
  "brown sugar": 180,
  "powdered sugar": 120,

  butter: 227,             // 1 cup butter = 227 g

  // General cooking
  oil: 218,                // 1 cup vegetable/olive oil
  water: 236,              // water/milk/broth ≈ 1 cup = 236 g
  milk: 245,
  broth: 240,

  rice: 195,
  oats: 90,

  honey: 340,
  syrup: 322,

  tomatoes: 180,           // diced
  onions: 160,             // chopped

  // Proteins (approx values)
  chicken: 140,            // cooked chopped
  beef: 150,               // cooked ground
  pork: 150,
};

// Ingredient name → canonical key mapping
export const ingredientSynonyms: Record<string, string> = {
  "ap flour": "flour",
  "all purpose flour": "all-purpose flour",
  "olive oil": "oil",
  "vegetable oil": "oil",
  "granulated sugar": "sugar",
  "white sugar": "sugar",
  "brown sugar": "brown sugar",
  "powdered sugar": "powdered sugar",
};
