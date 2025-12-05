// src/lib/unitConversion.ts
// Local unit conversion helper using convert-units.
// Handles fractions, mixed fractions, synonyms, and safe fallbacks.

import convert from 'convert-units';

/* ----------------------------------------
   FRACTION + MIXED NUMBER PARSING
---------------------------------------- */

/**
 * Converts inputs like:
 * - "1"
 * - "1.5"
 * - "1/2"
 * - "1 1/2"
 * - "  2 3/4 "
 */
export function parseAmount(input: string): number | null {
  if (!input) return null;

  const trimmed = input.trim();

  // Direct number first: "2", "1.75", etc.
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber)) return asNumber;

  // Mixed number: "1 1/2"
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(' ');
    if (parts.length === 2) {
      const whole = Number(parts[0]);
      const frac = fractionToNumber(parts[1]);
      if (!Number.isNaN(whole) && frac !== null) {
        return whole + frac;
      }
    }
  }

  // Fraction only: "3/4"
  if (trimmed.includes('/')) {
    const frac = fractionToNumber(trimmed);
    if (frac !== null) return frac;
  }

  return null; // parsing failed
}

function fractionToNumber(f: string): number | null {
  const [num, den] = f.split('/');
  const n = Number(num);
  const d = Number(den);
  if (Number.isNaN(n) || Number.isNaN(d) || d === 0) return null;
  return n / d;
}

/* ----------------------------------------
   UNIT NORMALIZATION MAP
---------------------------------------- */

/**
 * This maps user-input unit labels → convert-units library keys.
 * Add more as needed.
 */
const UNIT_MAP: Record<string, string> = {
  // Volume
  cup: 'cup',
  cups: 'cup',
  c: 'cup',

  tbsp: 'Tbs',
  tablespoon: 'Tbs',
  tablespoons: 'Tbs',
  tbs: 'Tbs',
  tb: 'Tbs',

  tsp: 'tsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',

  ml: 'ml',
  milliliter: 'ml',
  milliliters: 'ml',
  millilitre: 'ml',
  millilitres: 'ml',

  l: 'l',
  liter: 'l',
  liters: 'l',
  litre: 'l',
  litres: 'l',

  'fl oz': 'fl-oz',
  floz: 'fl-oz',
  'fluid ounce': 'fl-oz',
  'fluid ounces': 'fl-oz',

  // Weight
  g: 'g',
  gram: 'g',
  grams: 'g',

  kg: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',

  oz: 'oz',
  ounce: 'oz',
  ounces: 'oz',

  lb: 'lb',
  lbs: 'lb',
  pound: 'lb',
  pounds: 'lb',

  // Temperature
  c: 'C',
  '°c': 'C',
  celcius: 'C',
  celsius: 'C',

  f: 'F',
  '°f': 'F',
  fahrenheit: 'F',
};

/* ----------------------------------------
   RETURN TYPE
---------------------------------------- */

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
        | 'unsupported-unit'
        | 'invalid-number'
        | 'unsupported-conversion';
    };

/* ----------------------------------------
   MAIN CONVERSION FUNCTION
---------------------------------------- */

export function convertLocally(
  amountRaw: string,
  fromUnitRaw: string,
  toUnitRaw: string
): LocalConversionResult {
  // Parse number (handles fractions)
  const amount = parseAmount(amountRaw);
  if (amount === null) {
    return { ok: false, reason: 'invalid-number' };
  }

  // Normalize unit labels
  const fromKey = fromUnitRaw.trim().toLowerCase();
  const toKey = toUnitRaw.trim().toLowerCase();

  const from = UNIT_MAP[fromKey];
  const to = UNIT_MAP[toKey];

  if (!from || !to) {
    return { ok: false, reason: 'unsupported-unit' };
  }

  // Try conversion using convert-units
  try {
    const converted = convert(amount).from(from).to(to);

    if (!Number.isFinite(converted)) {
      return { ok: false, reason: 'unsupported-conversion' };
    }

    return {
      ok: true,
      value: converted,
      fromUnit: from,
      toUnit: to,
    };
  } catch {
    return { ok: false, reason: 'unsupported-conversion' };
  }
}
