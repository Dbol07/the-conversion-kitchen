export interface SauceInfo {
  id: string;
  name: string;
  category: "Sauce" | "Emulsion" | "Mother Sauce";
  difficulty: "Easy" | "Medium" | "Advanced";
  summary: string;
  whenToUse: string;
  ingredientsHint?: string;
  steps: string[];
  tips?: string[];
}

export const SAUCES: Record<string, SauceInfo> = {
  hollandaise: {
    id: "hollandaise",
    name: "Hollandaise Sauce",
    category: "Mother Sauce",
    difficulty: "Advanced",
    summary:
      "A warm, silky emulsion of egg yolks, butter, and lemon. Used over eggs, vegetables, and fish.",
    whenToUse:
      "Perfect for Eggs Benedict, asparagus, poached salmon, and brunch dishes.",
    ingredientsHint:
      "Egg yolks, melted butter, lemon juice, a splash of water, and a pinch of salt.",
    steps: [
      "Set up a gentle double boiler (barely simmering water).",
      "Whisk egg yolks with a splash of water and lemon juice until slightly thickened.",
      "Place over the steam and whisk constantly until the mixture turns slightly foamy and thicker.",
      "Slowly drizzle in warm melted butter while whisking, forming a smooth emulsion.",
      "Season with salt (and a little more lemon if needed) and keep warm, not hot.",
    ],
    tips: [
      "If it thickens too much, whisk in a spoonful of warm water.",
      "If it breaks, try whisking a fresh egg yolk in a clean bowl, then slowly whisk the broken sauce into it.",
    ],
  },

  bechamel: {
    id: "bechamel",
    name: "Béchamel Sauce",
    category: "Mother Sauce",
    difficulty: "Easy",
    summary:
      "A classic white sauce made from butter, flour, and milk. Forms the base for many creamy dishes.",
    whenToUse:
      "Ideal for lasagna, macaroni and cheese, gratins, and creamy vegetable bakes.",
    ingredientsHint: "Butter, flour, milk, salt, and nutmeg.",
    steps: [
      "Melt butter in a saucepan over medium heat.",
      "Whisk in equal parts flour to form a smooth paste (roux). Cook 1–2 minutes to remove raw flour taste.",
      "Slowly whisk in warm milk, a little at a time, until smooth.",
      "Simmer gently, whisking, until thickened.",
      "Season with salt and a pinch of nutmeg.",
    ],
    tips: [
      "Whisk constantly when adding milk to avoid lumps.",
      "If it gets lumpy, you can strain it through a fine mesh sieve.",
    ],
  },

  roux: {
    id: "roux",
    name: "Roux",
    category: "Sauce",
    difficulty: "Easy",
    summary:
      "A cooked mixture of fat and flour used to thicken sauces, soups, and gravies.",
    whenToUse:
      "Use as a thickener for gravies, stews, cheese sauce, or gumbo depending on how dark you cook it.",
    ingredientsHint: "Equal parts butter (or oil) and flour.",
    steps: [
      "Melt fat in a pan over medium heat.",
      "Whisk in an equal amount of flour to form a smooth paste.",
      "Cook, stirring, to the desired color: pale (white), blond, or medium brown.",
      "Add liquid (broth, milk, etc.) gradually while whisking until smooth.",
    ],
    tips: [
      "The darker the roux, the more flavor but the less thickening power.",
      "Don’t walk away—roux can burn quickly once it darkens.",
    ],
  },
};
