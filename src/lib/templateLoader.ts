// COOKIE
import cookieThumb from "@/assets/templates/cookie-template-thumb.png";
import cookieFull from "@/assets/templates/cookie-template-full.png";

// CAKE
import cakeThumb from "@/assets/templates/cake-template-thumb.png";
import cakeFull from "@/assets/templates/cake-template-full.png";

// BREAD
import breadThumb from "@/assets/templates/bread-template-thumb.png";
import breadFull from "@/assets/templates/bread-template-full.png";

/**
 * Template definitions — clean, explicit, import-safe.
 * Vite + Vercel can now bundle these assets correctly.
 */
export const templates = [
  {
    id: "cookie",
    name: "Soft Chocolate Chip Cookies",
    thumb: cookieThumb,
    image: cookieFull,
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 cup butter, softened",
      "1 cup brown sugar",
      "1 cup granulated sugar",
      "2 eggs",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "Cream butter and sugars until fluffy.",
      "Add eggs and mix well.",
      "Add dry ingredients and fold in chocolate chips.",
      "Bake 10–12 minutes."
    ]
  },

  {
    id: "cake",
    name: "Vanilla Sheet Cake",
    thumb: cakeThumb,
    image: cakeFull,
    ingredients: [
      "2 cups flour",
      "1 cup sugar",
      "1 cup milk",
      "2 eggs",
      "1/2 cup butter"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "Mix dry ingredients together.",
      "Whisk in wet ingredients.",
      "Pour into a greased pan and bake 25–30 minutes."
    ]
  },

  {
    id: "bread",
    name: "Homemade Rustic Bread",
    thumb: breadThumb,
    image: breadFull,
    ingredients: [
      "3 cups flour",
      "1 1/4 cups warm water",
      "1 packet yeast",
      "1 tsp salt"
    ],
    instructions: [
      "Mix ingredients and knead until smooth.",
      "Let rise 1 hour.",
      "Shape loaf and bake at 400°F for 25 minutes."
    ]
  }
];

export function getAllTemplates() {
  return templates;
}

export function getTemplateById(id: string) {
  return templates.find((t) => t.id === id) || null;
}
