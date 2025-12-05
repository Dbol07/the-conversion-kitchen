// src/lib/unitConversion.ts
// Full intelligent conversion system with:
// • Fraction parsing
// • Mixed fractions
// • Volume + Weight handling
// • Ingredient density support
// • Temperature conversion
// • convert-units fallback
// • Clean, safe error handling

import convert from "convert-units";

/* ----------------------------------------------------
   1) FRACTION + MIXED NUMBER PARSING
---------------------------------------------------- */

export function parseAmount(input: string): number | null {
  if (!input) return null;

  const trimmed = input.trim();

  // Direct float: "2", "1.75"
  const direct = Number(trimmed);
  if (!Number.isNaN(direct)) return direct;

  // Mixed fraction: "1 1/2"
  if (trimmed.includes(" ")) {
    const [wholeStr, fracStr] = trimmed.split(" ");
    const whole = Number(wholeStr);
    const frac = fractionToNumber(fracStr);
    if (!Number.isNaN(whole) && frac !== null) return whole + frac;
  }

  // Fraction only: "3/4"
  if (trimmed.includes("/")) {
    return fractionToNumber(trimmed);
  }

  return null;
}

function fractionToNumber(input: string): number | null {
  const [n, d] = input.split("/");
  const num = Number(n);
  const den = Number(d);
  if (Number.isNaN(num) || Number.isNaN(den) || den === 0) return null;
  return num / den;
}

/* ----------------------------------------------------
   2) INGREDIENT DENSITY TABLE (cups → grams)
---------------------------------------------------- */

const INGREDIENT_DENSITY: Record<string, number> = {
  flour: 120, // grams per cup
  sugar: 200,
  brown_sugar: 220,
  powdered_sugar: 120,
  butter: 227,
  honey: 340,
  oil: 218,
  oats: 90,
  rice: 195,
  water: 236,
};

function findDensity(ingredient: string | null): number | null {
  if (!ingredient) return null;
  const key = ingredient.trim().toLowerCase().replace(/\s+/g, "_");

  return INGREDIENT_DENSITY[key] ?? null;
}

/* ----------------------------------------------------
   3) TEMPERATURE NORMALIZATION
---------------------------------------------------- */

const TEMPS: Record<string, "C" | "F"> = {
  // Celsius
  c: "C",
  "°c": "C",
  C: "C",
  "°C": "C",
  celcius: "C", // common misspelling
  celsius: "C",
  "deg c": "C",
  "degree c": "C",
  "degrees c": "C",

  // Fahrenheit
  f: "F",
  "°f": "F",
  F: "F",
  "°F": "F",
  fahrenheit: "F",
  "deg f": "F",
  "degree f": "F",
  "degrees f": "F",
};

/* ----------------------------------------------------
   4) GENERAL UNIT NORMALIZATION
---------------------------------------------------- */

const UNIT_MAP: Record<string, string> = {
  // Volume
  cup: "cup",
  cups: "cup",

  tbsp: "Tbs",
  tablespoon: "Tbs",
  tablespoons: "Tbs",
  tbs: "Tbs",

  tsp: "tsp",
  teaspoons: "tsp",
  teaspoon: "tsp",

  ml: "ml",
  milliliter: "ml",
  milliliters: "ml",

  l: "l",
  liter: "l",
  liters: "l",

  "fl oz": "fl-oz",
  floz: "fl-oz",
  "fluid ounce": "fl-oz",
  "fluid ounces": "fl-oz",

  // Weight
  g: "g",
  gram: "g",
  grams: "g",

  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",

  oz: "oz",
  ounce: "oz",
  ounces: "oz",

  lb: "lb",
  lbs: "lb",
  pound: "lb",
  pounds: "lb",

  // Temperature handled separately
  ...TEMPS,
};

/* ----------------------------------------------------
   5) RETURN TYPE
---------------------------------------------------- */

export type LocalConversionResult =
  | {
      ok: true;
      value: number;
      fromUnit: string;
      toUnit: string;
    }
  | {
      ok: false;
      reason:
        | "unsupported-unit"
        | "invalid-number"
        | "unsupported-conversion";
    };

/* ----------------------------------------------------
   6) MAIN SMART CONVERSION ENGINE
---------------------------------------------------- */

export function convertLocally(
  amountRaw: string,
  fromUnitRaw: string,
  toUnitRaw: string,
  ingredientRaw?: string
): LocalConversionResult {
  const amount = parseAmount(amountRaw);
  if (amount === null) {
    return { ok: false, reason: "invalid-number" };
  }

  const fromKey = fromUnitRaw.trim().toLowerCase();
  const toKey = toUnitRaw.trim().toLowerCase();

  /* Temperature Conversion */
  if (TEMPS[fromKey] && TEMPS[toKey]) {
    return convertTemperature(amount, TEMPS[fromKey], TEMPS[toKey]);
  }

  const from = UNIT_MAP[fromKey];
  const to = UNIT_MAP[toKey];

  if (!from || !to) {
    return { ok: false, reason: "unsupported-unit" };
  }

  // Ingredient required for cups → grams or grams → cups
  const density = ingredientRaw ? findDensity(ingredientRaw) : null;

  // cups → grams using density
  if (from === "cup" && (to === "g" || to === "grams") && density) {
    return {
      ok: true,
      value: amount * density,
      fromUnit: "cup",
      toUnit: "g",
    };
  }

  // grams → cups using density
  if ((from === "g" || from === "grams") && to === "cup" && density) {
    return {
      ok: true,
      value: amount / density,
      fromUnit: "g",
      toUnit: "cup",
    };
  }

  // Default convert-units fallback
  try {
    const converted = convert(amount).from(from).to(to);
    if (!Number.isFinite(converted)) {
      return { ok: false, reason: "unsupported-conversion" };
    }
    return { ok: true, value: converted, fromUnit: from, toUnit: to };
  } catch {
    return { ok: false, reason: "unsupported-conversion" };
  }
}

/* ----------------------------------------------------
   7) TEMPERATURE INTERNAL ENGINE
---------------------------------------------------- */

function convertTemperature(
  amount: number,
  from: "C" | "F",
  to: "C" | "F"
): LocalConversionResult {
  if (from === to) {
    return { ok: true, value: amount, fromUnit: from, toUnit: to };
  }

  let result: number;

  if (from === "C" && to === "F") {
    result = amount * (9 / 5) + 32;
  } else if (from === "F" && to === "C") {
    result = (amount - 32) * (5 / 9);
  } else {
    return { ok: false, reason: "unsupported-conversion" };
  }

  return { ok: true, value: result, fromUnit: from, toUnit: to };
}
