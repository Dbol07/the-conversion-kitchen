// Centralized conversion utilities for kitchen measurements
// Step 1: upgraded but still backwards-compatible.
// - Keeps existing exports: volumeConversions, weightConversions, temperatureConvert, convert
// - Adds unit aliases + helpers we will use in Step 2 for the calculators.

export type UnitKind = "volume" | "weight" | "temperature";

// Canonical base units used internally:
//   - volume: teaspoon ("tsp") as base = 1
//   - weight: gram ("g") as base = 1
// Temperatures are handled separately.

export const volumeConversions: Record<string, number> = {
  // US customary (base = 1 tsp)
  tsp: 1,
  tbsp: 3,              // 1 tbsp = 3 tsp
  "fl oz": 6,           // 1 fl oz = 6 tsp
  cup: 48,              // 1 cup = 48 tsp
  pint: 96,             // 1 pint = 96 tsp
  quart: 192,           // 1 quart = 192 tsp
  gallon: 768,          // 1 gallon = 768 tsp

  // Metric mapped into tsp
  ml: 0.202884,         // 1 ml ≈ 0.203 tsp
  litre: 202.884,
  liter: 202.884,
  l: 202.884,
};

export const weightConversions: Record<string, number> = {
  // base unit = gram
  g: 1,
  gram: 1,
  grams: 1,

  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,

  oz: 28.3495,
  ounce: 28.3495,
  ounces: 28.3495,

  lb: 453.592,
  lbs: 453.592,
  pound: 453.592,
  pounds: 453.592,
};

// Aliases -> canonical keys used in conversion tables above.
// This is where we support UK spellings and abbreviations from APIs like TheMealDB.
export const unitAliases: Record<string, { unit: string; kind: UnitKind }> = {
  // teaspoons
  tsp: { unit: "tsp", kind: "volume" },
  "tsp.": { unit: "tsp", kind: "volume" },
  tsps: { unit: "tsp", kind: "volume" },
  teaspoon: { unit: "tsp", kind: "volume" },
  teaspoons: { unit: "tsp", kind: "volume" },

  // tablespoons
  tbsp: { unit: "tbsp", kind: "volume" },
  "tbsp.": { unit: "tbsp", kind: "volume" },
  tbs: { unit: "tbsp", kind: "volume" },
  tbsps: { unit: "tbsp", kind: "volume" },
  tblsp: { unit: "tbsp", kind: "volume" },
  tblspn: { unit: "tbsp", kind: "volume" },
  tbls: { unit: "tbsp", kind: "volume" },
  tablespoon: { unit: "tbsp", kind: "volume" },
  tablespoons: { unit: "tbsp", kind: "volume" },

  // cups
  cup: { unit: "cup", kind: "volume" },
  cups: { unit: "cup", kind: "volume" },

  // fluid ounces
  oz: { unit: "oz", kind: "weight" }, // weight ounce
  ounce: { unit: "oz", kind: "weight" },
  ounces: { unit: "oz", kind: "weight" },

  "fl oz": { unit: "fl oz", kind: "volume" },
  floz: { unit: "fl oz", kind: "volume" },

  // pints, quarts, gallons
  pint: { unit: "pint", kind: "volume" },
  pints: { unit: "pint", kind: "volume" },
  quart: { unit: "quart", kind: "volume" },
  quarts: { unit: "quart", kind: "volume" },
  gallon: { unit: "gallon", kind: "volume" },
  gallons: { unit: "gallon", kind: "volume" },

  // metric volume
  ml: { unit: "ml", kind: "volume" },
  "ml.": { unit: "ml", kind: "volume" },
  mls: { unit: "ml", kind: "volume" },
  milliliter: { unit: "ml", kind: "volume" },
  milliliters: { unit: "ml", kind: "volume" },
  millilitre: { unit: "ml", kind: "volume" },
  millilitres: { unit: "ml", kind: "volume" },

  litre: { unit: "litre", kind: "volume" },
  liter: { unit: "liter", kind: "volume" },
  litres: { unit: "litre", kind: "volume" },
  liters: { unit: "liter", kind: "volume" },
  l: { unit: "l", kind: "volume" },

  // metric weight
  g: { unit: "g", kind: "weight" },
  gram: { unit: "g", kind: "weight" },
  grams: { unit: "g", kind: "weight" },
  "g.": { unit: "g", kind: "weight" },

  kg: { unit: "kg", kind: "weight" },
  kilo: { unit: "kg", kind: "weight" },
  kilos: { unit: "kg", kind: "weight" },
  kilogram: { unit: "kg", kind: "weight" },
  kilograms: { unit: "kg", kind: "weight" },

  // imperial weight
  lb: { unit: "lb", kind: "weight" },
  lbs: { unit: "lb", kind: "weight" },
  pound: { unit: "lb", kind: "weight" },
  pounds: { unit: "lb", kind: "weight" },
};

// Basic temperature conversion used by the old calculator.
// This remains unchanged so we stay backwards-compatible.
export const temperatureConvert = (value: number, from: string, to: string): number => {
  if (from === to) return value;

  // Normalize symbols
  const f = from.toUpperCase();
  const t = to.toUpperCase();

  // Convert source to Celsius as a base
  let celsius: number;
  if (f === "C") {
    celsius = value;
  } else if (f === "F") {
    celsius = (value - 32) * (5 / 9);
  } else if (f === "K") {
    celsius = value - 273.15;
  } else {
    // Unknown, just return original
    return value;
  }

  if (t === "C") return celsius;
  if (t === "F") return celsius * (9 / 5) + 32;
  if (t === "K") return celsius + 273.15;

  return value;
};

// Helper: normalize a raw unit string into one of our canonical keys.
export function normalizeUnit(raw: string): { unit: string | null; kind: UnitKind | null } {
  const cleaned = raw.trim().toLowerCase();
  const hit = unitAliases[cleaned];
  if (!hit) {
    return { unit: null, kind: null };
  }
  return { unit: hit.unit, kind: hit.kind };
}

// Low-level conversion used by the old calculator.
// type should be "volume", "weight" or "temperature".
export const convert = (
  value: number,
  from: string,
  to: string,
  type: UnitKind
): number => {
  if (!from || !to) return value;

  if (type === "temperature") {
    return temperatureConvert(value, from, to);
  }

  const fromInfo = normalizeUnit(from);
  const toInfo = normalizeUnit(to);

  if (!fromInfo.unit || !toInfo.unit || fromInfo.kind !== toInfo.kind) {
    // Units don't match or are unknown – return original value.
    return value;
  }

  if (fromInfo.kind === "volume") {
    const fromFactor = volumeConversions[fromInfo.unit];
    const toFactor = volumeConversions[toInfo.unit];
    if (!fromFactor || !toFactor) return value;
    const base = value * fromFactor; // in base tsp
    return base / toFactor;
  }

  if (fromInfo.kind === "weight") {
    const fromFactor = weightConversions[fromInfo.unit];
    const toFactor = weightConversions[toInfo.unit];
    if (!fromFactor || !toFactor) return value;
    const base = value * fromFactor; // grams
    return base / toFactor;
  }

  return value;
};
