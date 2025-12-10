export interface CookingTermInfo {
  id: string;
  name: string;
  category:
    | "Technique"
    | "Texture"
    | "Doneness"
    | "Baking"
    | "Whisking"
    | "General";
  summary: string;
  howToSpot?: string;
  steps?: string[];
  tips?: string[];
}

export const COOKING_TERMS: Record<string, CookingTermInfo> = {
  blanch: {
    id: "blanch",
    name: "Blanch",
    category: "Technique",
    summary:
      "To briefly boil food, then cool it quickly in ice water. This sets color and softens without fully cooking.",
    howToSpot:
      "Vegetables look bright and tender-crisp, not mushy, after blanching.",
    steps: [
      "Bring a pot of salted water to a boil.",
      "Add vegetables and cook just until color brightens and slightly tender.",
      "Immediately transfer to ice water to stop cooking.",
      "Drain well before using or freezing.",
    ],
    tips: [
      "Great for green beans, broccoli, and leafy greens.",
      "Always cool quickly so they don’t overcook.",
    ],
  },

  simmer: {
    id: "simmer",
    name: "Simmer",
    category: "Technique",
    summary:
      "To cook gently in liquid just below a boil—small, lazy bubbles rather than a rolling boil.",
    howToSpot:
      "You’ll see tiny bubbles around the edges, but the surface is mostly calm.",
    tips: [
      "Use simmering for soups, stews, and braises to keep meat tender.",
      "If the liquid is splashing or vigorously bubbling, it’s boiling, not simmering.",
    ],
  },

  poach: {
    id: "poach",
    name: "Poach",
    category: "Technique",
    summary:
      "To cook delicate foods gently in hot liquid kept below boiling, often 160–180°F / 70–82°C.",
    steps: [
      "Heat a flavorful liquid (water, broth, milk) until steam rises but only a few small bubbles appear.",
      "Add the food (eggs, fish, chicken, etc.) in a single layer.",
      "Cook gently until just done, without boiling.",
    ],
    tips: [
      "Perfect for eggs, fish, chicken breasts, and fruit.",
      "Keep the liquid calm to avoid breaking delicate foods.",
    ],
  },

  "soft-peaks": {
    id: "soft-peaks",
    name: "Soft Peaks",
    category: "Whisking",
    summary:
      "Whipped cream or egg whites that hold a peak but the tip softly folds over.",
    howToSpot:
      "Lift the whisk: the peak stands up, but the top gently slumps over.",
    tips: [
      "Used for lighter textures in mousses and folded mixtures.",
      "Stop whisking here if the recipe calls for soft peaks.",
    ],
  },

  "stiff-peaks": {
    id: "stiff-peaks",
    name: "Stiff Peaks",
    category: "Whisking",
    summary:
      "Whipped cream or egg whites that hold a firm peak with a tip that stands straight up.",
    howToSpot:
      "Lift the whisk: the peak stands tall without drooping or sliding.",
    tips: [
      "Used for meringues and some frostings.",
      "Don’t over-whisk—egg whites can become grainy and dry.",
    ],
  },

  fold: {
    id: "fold",
    name: "Fold",
    category: "Technique",
    summary:
      "A gentle mixing method that combines ingredients without knocking out too much air.",
    steps: [
      "Add the lighter mixture (like whipped cream or egg whites) on top of the heavier one.",
      "Use a spatula to cut down through the center, scrape along the bottom, and lift up and over.",
      "Rotate the bowl slightly and repeat until just combined.",
    ],
    tips: [
      "Move slowly and stop as soon as there are no big streaks.",
      "Avoid vigorous stirring which deflates air.",
    ],
  },

  cream: {
    id: "cream",
    name: "Cream (butter & sugar)",
    category: "Baking",
    summary:
      "To beat butter and sugar together until light, fluffy, and pale in color.",
    howToSpot:
      "The mixture looks lighter in color, increased in volume, and feels fluffy.",
    tips: [
      "Start with room-temperature butter.",
      "Creaming adds air, giving cakes and cookies better lift.",
    ],
  },
};
