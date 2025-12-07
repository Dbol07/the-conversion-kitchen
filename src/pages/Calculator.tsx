import { useState } from "react";
import PageDivider from "@/components/PageDivider";
import { getDividerForPage } from "@/lib/dividers";
import calculatorBanner from "@/assets/banners/calculator-banner.png";

type TabId = "ingredient" | "scale" | "full";

/* -----------------------------
   UNIT + DENSITY TABLES
------------------------------*/

const VOLUME_FACTORS_ML: Record<string, number> = {
  tsp: 5,
  tbsp: 15,
  cup: 240,
  floz: 30,
  ml: 1,
  liter: 1000,
  pint: 473,
  quart: 946,
  gallon: 3785,
  pinch: 0.3,
  dash: 0.6,
};

const MASS_FACTORS_G: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.6,
  stone: 6350.29,
  stick: 113, // 1 US stick of butter ≈ 113 g
};

const INGREDIENT_DENSITY_G_PER_CUP: Record<string, number> = {
  flour: 120,
  sugar: 200,
  "brown sugar": 210,
  butter: 227,
  honey: 340,
  water: 240,
  milk: 245,
  "almond flour": 96,
  "coconut flour": 112,
  "powdered sugar": 120,
  "cocoa powder": 85,
  oats: 90,
  "rice flour": 142,
  oil: 218,
  yogurt: 245,
  shortening: 191,
};

const INGREDIENT_OPTIONS = [
  { id: "flour", label: "Flour" },
  { id: "sugar", label: "Granulated sugar" },
  { id: "brown sugar", label: "Brown sugar" },
  { id: "powdered sugar", label: "Powdered sugar" },
  { id: "cocoa powder", label: "Cocoa powder" },
  { id: "oats", label: "Oats" },
  { id: "rice flour", label: "Rice flour" },
  { id: "almond flour", label: "Almond flour" },
  { id: "coconut flour", label: "Coconut flour" },
  { id: "butter", label: "Butter" },
  { id: "shortening", label: "Shortening" },
  { id: "oil", label: "Oil" },
  { id: "honey", label: "Honey" },
  { id: "water", label: "Water" },
  { id: "milk", label: "Milk" },
  { id: "yogurt", label: "Yogurt" },
];

const VOLUME_UNIT_OPTIONS = [
  { value: "tsp", label: "teaspoons (tsp)" },
  { value: "tbsp", label: "tablespoons (tbsp)" },
  { value: "cup", label: "cups" },
  { value: "floz", label: "fluid ounces (fl oz)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "liter", label: "liters (L)" },
  { value: "pint", label: "pints (pt)" },
  { value: "quart", label: "quarts (qt)" },
  { value: "gallon", label: "gallons (gal)" },
  { value: "pinch", label: "pinch" },
  { value: "dash", label: "dash" },
];

const MASS_UNIT_OPTIONS = [
  { value: "mg", label: "milligrams (mg)" },
  { value: "g", label: "grams (g)" },
  { value: "kg", label: "kilograms (kg)" },
  { value: "oz", label: "ounces (oz)" },
  { value: "lb", label: "pounds (lb)" },
  { value: "stone", label: "stone (UK)" },
  { value: "stick", label: "sticks of butter" },
];

/* -----------------------------
   HELPERS
------------------------------*/

function isVolumeUnit(unit: string) {
  return unit in VOLUME_FACTORS_ML;
}

function isMassUnit(unit: string) {
  return unit in MASS_FACTORS_G;
}

function parseFractionalNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]);
    return whole + num / den;
  }

  // "1/2"
  const fracMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const num = parseFloat(fracMatch[1]);
    const den = parseFloat(fracMatch[2]);
    return num / den;
  }

  const asFloat = Number(trimmed);
  return isNaN(asFloat) ? null : asFloat;
}

interface ParsedLine {
  original: string;
  quantity: number | null;
  unit: string | null;
  ingredient: string;
}

function parseRecipeLines(text: string): ParsedLine[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const knownUnits = [
    "tsp",
    "teaspoon",
    "teaspoons",
    "tbsp",
    "tablespoon",
    "tablespoons",
    "cup",
    "cups",
    "fl oz",
    "floz",
    "ounce",
    "ounces",
    "oz",
    "g",
    "gram",
    "grams",
    "kg",
    "ml",
    "milliliter",
    "milliliters",
    "liter",
    "liters",
    "l",
    "lb",
    "pound",
    "pounds",
    "mg",
    "milligram",
    "milligrams",
    "pint",
    "pints",
    "pt",
    "quart",
    "quarts",
    "qt",
    "gallon",
    "gallons",
    "gal",
    "pinch",
    "dash",
    "stick",
    "sticks",
    "stone",
    "stones",
  ];

  return lines.map((line) => {
    const parts = line.split(/\s+/);
    if (parts.length === 0) {
      return { original: line, quantity: null, unit: null, ingredient: line };
    }

    const qty = parseFractionalNumber(parts[0]);
    if (qty === null) {
      return { original: line, quantity: null, unit: null, ingredient: line };
    }

    let unit: string | null = null;
    let ingredientStartIndex = 1;

    if (parts.length > 1) {
      const maybeUnit = parts[1].toLowerCase();
      if (knownUnits.includes(maybeUnit)) {
        unit = maybeUnit;
        ingredientStartIndex = 2;
      }
    }

    const ingredient = parts.slice(ingredientStartIndex).join(" ") || "";
    return { original: line, quantity: qty, unit, ingredient };
  });
}

/* -----------------------------
   CONVERSION LOGIC
------------------------------*/

function convertAmount(
  amount: number,
  fromUnit: string,
  toUnit: string,
  ingredientId?: string
): { value: number; note?: string } | { error: string } {
  // Volume → Volume
  if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
    const ml = amount * VOLUME_FACTORS_ML[fromUnit];
    const result = ml / VOLUME_FACTORS_ML[toUnit];
    return { value: result };
  }

  // Mass → Mass
  if (isMassUnit(fromUnit) && isMassUnit(toUnit)) {
    const g = amount * MASS_FACTORS_G[fromUnit];
    const result = g / MASS_FACTORS_G[toUnit];
    return { value: result };
  }

  // Volume ↔ Mass requires ingredient
  if (!ingredientId) {
    return {
      error: "Please choose an ingredient to convert between volume and weight.",
    };
  }

  const density = INGREDIENT_DENSITY_G_PER_CUP[ingredientId];
  if (!density) {
    return {
      error:
        "This ingredient doesn’t have a density set yet. Try another ingredient or use same-type units.",
    };
  }

  const gPerMl = density / VOLUME_FACTORS_ML["cup"];

  // Volume → Mass
  if (isVolumeUnit(fromUnit) && isMassUnit(toUnit)) {
    const ml = amount * VOLUME_FACTORS_ML[fromUnit];
    const grams = ml * gPerMl;
    const result = grams / MASS_FACTORS_G[toUnit];
    return {
      value: result,
      note: "Approximate conversion based on typical ingredient density.",
    };
  }

  // Mass → Volume
  if (isMassUnit(fromUnit) && isVolumeUnit(toUnit)) {
    const grams = amount * MASS_FACTORS_G[fromUnit];
    const ml = grams / gPerMl;
    const result = ml / VOLUME_FACTORS_ML[toUnit];
    return {
      value: result,
      note: "Approximate conversion based on typical ingredient density.",
    };
  }

  return { error: "These units aren’t supported yet." };
}

function normalizeUnit(rawUnit: string): string | null {
  const u = rawUnit.toLowerCase();

  if (["tsp", "teaspoon", "teaspoons"].includes(u)) return "tsp";
  if (["tbsp", "tablespoon", "tablespoons"].includes(u)) return "tbsp";
  if (["cup", "cups"].includes(u)) return "cup";
  if (["fl", "floz", "fl-oz", "fl_oz", "fl oz"].includes(u)) return "floz";
  if (["ml", "milliliter", "milliliters"].includes(u)) return "ml";
  if (["l", "liter", "liters"].includes(u)) return "liter";
  if (["pint", "pints", "pt"].includes(u)) return "pint";
  if (["quart", "quarts", "qt"].includes(u)) return "quart";
  if (["gallon", "gallons", "gal"].includes(u)) return "gallon";
  if (["pinch"].includes(u)) return "pinch";
  if (["dash"].includes(u)) return "dash";

  if (["mg", "milligram", "milligrams"].includes(u)) return "mg";
  if (["g", "gram", "grams"].includes(u)) return "g";
  if (["kg", "kilogram", "kilograms"].includes(u)) return "kg";
  if (["oz", "ounce", "ounces"].includes(u)) return "oz";
  if (["lb", "pound", "pounds"].includes(u)) return "lb";
  if (["stone", "stones"].includes(u)) return "stone";
  if (["stick", "sticks"].includes(u)) return "stick";

  return null;
}

function prettyUnitLabel(unit: string): string {
  switch (unit) {
    case "tsp":
      return "tsp";
    case "tbsp":
      return "tbsp";
    case "cup":
      return "cups";
    case "floz":
      return "fl oz";
    case "ml":
      return "ml";
    case "liter":
      return "L";
    case "pint":
      return "pt";
    case "quart":
      return "qt";
    case "gallon":
      return "gal";
    case "pinch":
      return "pinch";
    case "dash":
      return "dash";
    case "mg":
      return "mg";
    case "g":
      return "g";
    case "kg":
      return "kg";
    case "oz":
      return "oz";
    case "lb":
      return "lb";
    case "stone":
      return "stone";
    case "stick":
      return "sticks";
    default:
      return unit;
  }
}

function guessIngredientId(text: string): string | null {
  const lower = text.toLowerCase();
  for (const key of Object.keys(INGREDIENT_DENSITY_G_PER_CUP)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

/* =============================
   MAIN COMPONENT
============================= */

export default function Calculator() {
  const dividerImage = getDividerForPage("calculator");
  const [tab, setTab] = useState<TabId>("ingredient");

  /* INGREDIENT CONVERTER STATE */
  const [ingAmount, setIngAmount] = useState("");
  const [ingFromUnit, setIngFromUnit] = useState("");
  const [ingToUnit, setIngToUnit] = useState("");
  const [ingIngredient, setIngIngredient] = useState("");
  const [ingResult, setIngResult] = useState<string | null>(null);
  const [ingNote, setIngNote] = useState<string | null>(null);
  const [ingError, setIngError] = useState<string | null>(null);

  /* RECIPE SCALER STATE */
  const [origServings, setOrigServings] = useState("");
  const [newServings, setNewServings] = useState("");
  const [scaleInput, setScaleInput] = useState("");
  const [scaleOutput, setScaleOutput] = useState<string[] | null>(null);
  const [scaleError, setScaleError] = useState<string | null>(null);
  const [scaleCopied, setScaleCopied] = useState(false);

  /* FULL RECIPE CONVERTER STATE */
  const [fullInput, setFullInput] = useState("");
  const [fullTargetSystem, setFullTargetSystem] = useState<"metric" | "us">(
    "metric"
  );
  const [fullOutput, setFullOutput] = useState<string[] | null>(null);
  const [fullError, setFullError] = useState<string | null>(null);
  const [fullCopied, setFullCopied] = useState(false);

  /* -----------------------------
     HANDLERS
  ------------------------------*/

  function handleIngredientConvert() {
    setIngError(null);
    setIngResult(null);
    setIngNote(null);

    const amount = parseFractionalNumber(ingAmount);
    if (amount === null || amount <= 0) {
      setIngError("Please enter a valid amount.");
      return;
    }
    if (!ingFromUnit || !ingToUnit) {
      setIngError("Please select both units.");
      return;
    }

    const result = convertAmount(
      amount,
      ingFromUnit,
      ingToUnit,
      ingIngredient || undefined
    );

    if ("error" in result) {
      setIngError(result.error);
      return;
    }

    const rounded = Math.round(result.value * 100) / 100;
    setIngResult(`${rounded} ${prettyUnitLabel(ingToUnit)}`);
    if (result.note) setIngNote(result.note);
  }

  function handleScaleRecipe() {
    setScaleError(null);
    setScaleOutput(null);
    setScaleCopied(false);

    const orig = Number(origServings);
    const next = Number(newServings);
    if (!orig || !next || orig <= 0 || next <= 0) {
      setScaleError("Please enter both original and new servings.");
      return;
    }

    const factor = next / orig;
    const parsed = parseRecipeLines(scaleInput);
    if (!parsed.length) {
      setScaleError("Add at least one ingredient line to scale.");
      return;
    }

    const lines = parsed.map((line) => {
      if (line.quantity == null) return line.original;

      const newQty = Math.round(line.quantity * factor * 100) / 100;
      const qtyStr = newQty % 1 === 0 ? newQty.toString() : newQty.toString();
      const unitStr = line.unit ? ` ${line.unit}` : "";
      const ingredientStr = line.ingredient ? ` ${line.ingredient}` : "";
      return `${qtyStr}${unitStr}${ingredientStr}`;
    });

    setScaleOutput(lines);
  }

  async function handleCopyScaled() {
    if (!scaleOutput?.length) return;
    try {
      await navigator.clipboard.writeText(scaleOutput.join("\n"));
      setScaleCopied(true);
      setTimeout(() => setScaleCopied(false), 2000);
    } catch {
      // silently fail; no-op
    }
  }

  function handleFullConvert() {
    setFullError(null);
    setFullOutput(null);
    setFullCopied(false);

    const parsed = parseRecipeLines(fullInput);
    if (!parsed.length) {
      setFullError("Paste a recipe first.");
      return;
    }

    const lines: string[] = [];

    for (const line of parsed) {
      if (line.quantity == null || !line.unit) {
        lines.push(line.original);
        continue;
      }

      const normalizedUnit = normalizeUnit(line.unit);
      if (!normalizedUnit) {
        lines.push(line.original);
        continue;
      }

      let targetUnit: string;
      if (fullTargetSystem === "metric") {
        targetUnit = isVolumeUnit(normalizedUnit) ? "ml" : "g";
      } else {
        targetUnit = isVolumeUnit(normalizedUnit) ? "cup" : "oz";
      }

      const ingredientId = guessIngredientId(line.ingredient);
      const result = convertAmount(
        line.quantity,
        normalizedUnit,
        targetUnit,
        ingredientId || undefined
      );

      if ("error" in result) {
        lines.push(line.original);
        continue;
      }

      const rounded = Math.round(result.value * 100) / 100;
      const qtyStr = rounded % 1 === 0 ? rounded.toString() : rounded.toString();
      const unitLabel = prettyUnitLabel(targetUnit);
      const ingredientStr = line.ingredient ? ` ${line.ingredient}` : "";
      lines.push(`${qtyStr} ${unitLabel}${ingredientStr}`);
    }

    setFullOutput(lines);
  }

  function handleFullClear() {
    setFullInput("");
    setFullOutput(null);
    setFullError(null);
    setFullCopied(false);
  }

  async function handleCopyFull() {
    if (!fullOutput?.length) return;
    try {
      await navigator.clipboard.writeText(fullOutput.join("\n"));
      setFullCopied(true);
      setTimeout(() => setFullCopied(false), 2000);
    } catch {
      // silently fail
    }
  }

  /* -----------------------------
     RENDER
  ------------------------------*/

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-32">
      {/* Banner */}
      <div className="relative w-full max-w-4xl mx-auto mt-6">
        <img
          src={calculatorBanner}
          alt="Calculator Banner"
          className="w-full rounded-xl shadow-xl"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-[#4b3b2f] drop-shadow-lg text-center px-4">
          Recipe Conversion Calculator
        </h1>
      </div>

      {/* Divider */}
      <div className="flex justify-center mt-6">
        <PageDivider src={dividerImage} size="md" />
      </div>

      {/* Main Card */}
      <div className="max-w-3xl mx-auto bg-white/95 border border-[#e4d5b8] rounded-3xl shadow-xl p-4 sm:p-6 mt-8">
        {/* Tabs */}
        <div className="flex justify-between gap-2 mb-4 bg-[#faf3e2] rounded-2xl p-1">
          <button
            onClick={() => setTab("ingredient")}
            className={`flex-1 py-2 px-3 rounded-2xl text-sm sm:text-base font-semibold transition-all ${
              tab === "ingredient"
                ? "bg-white shadow-md text-[#1b302c]"
                : "text-[#5f3c43] hover:bg-white/60"
            }`}
          >
            🥄 Ingredient Converter
          </button>
          <button
            onClick={() => setTab("scale")}
            className={`flex-1 py-2 px-3 rounded-2xl text-sm sm:text-base font-semibold transition-all ${
              tab === "scale"
                ? "bg-white shadow-md text-[#1b302c]"
                : "text-[#5f3c43] hover:bg-white/60"
            }`}
          >
            🍲 Scale a Recipe
          </button>
          <button
            onClick={() => setTab("full")}
            className={`flex-1 py-2 px-3 rounded-2xl text-sm sm:text-base font-semibold transition-all ${
              tab === "full"
                ? "bg-white shadow-md text-[#1b302c]"
                : "text-[#5f3c43] hover:bg-white/60"
            }`}
          >
            📜 Full Recipe Converter
          </button>
        </div>

        {/* Tab Content */}
        {tab === "ingredient" && (
          <section className="mt-4 space-y-3">
            <p className="text-sm text-[#5f3c43] mb-2">
              Convert a single ingredient between volume and weight. Choose an
              ingredient when switching between cups and grams/ounces.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium mb-1 text-sm">
                  Amount
                </label>
                <input
                  type="text"
                  value={ingAmount}
                  onChange={(e) => setIngAmount(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                  placeholder="e.g. 1 1/2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm">
                  From unit
                </label>
                <select
                  value={ingFromUnit}
                  onChange={(e) => setIngFromUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                >
                  <option value="">Select…</option>
                  <optgroup label="Volume">
                    {VOLUME_UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Weight">
                    {MASS_UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm">
                  To unit
                </label>
                <select
                  value={ingToUnit}
                  onChange={(e) => setIngToUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                >
                  <option value="">Select…</option>
                  <optgroup label="Volume">
                    {VOLUME_UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Weight">
                    {MASS_UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm">
                Ingredient (for volume ↔ weight)
              </label>
              <select
                value={ingIngredient}
                onChange={(e) => setIngIngredient(e.target.value)}
                className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
              >
                <option value="">
                  Optional — choose when converting cups ↔ grams/oz
                </option>
                {INGREDIENT_OPTIONS.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleIngredientConvert}
              className="mt-2 w-full py-3 bg-[#2f6e4f] text-white rounded-2xl shadow-md hover:bg-[#26593f] transition font-semibold"
            >
              Convert
            </button>

            {ingResult && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-sm">
                <p className="font-semibold text-[#1b302c] mb-1">
                  Result: {ingResult}
                </p>
                {ingNote && (
                  <p className="text-xs text-[#5f3c43] mt-1">{ingNote}</p>
                )}
              </div>
            )}

            {ingError && (
              <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-200 text-center text-red-700 text-sm">
                {ingError}
              </div>
            )}
          </section>
        )}

        {tab === "scale" && (
          <section className="mt-4 space-y-3">
            <p className="text-sm text-[#5f3c43] mb-2">
              Paste your ingredient list and scale it up or down for a new
              serving size.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-sm">
                  Original servings
                </label>
                <input
                  type="number"
                  value={origServings}
                  onChange={(e) => setOrigServings(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                  min={1}
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">
                  New servings
                </label>
                <input
                  type="number"
                  value={newServings}
                  onChange={(e) => setNewServings(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm">
                Recipe ingredients
              </label>
              <textarea
                value={scaleInput}
                onChange={(e) => setScaleInput(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-2xl border border-[#e4d5b8] bg-[#fffaf4] text-sm"
                placeholder={`e.g.\n2 cups flour\n1/2 cup sugar\n1 tbsp vanilla`}
              />
            </div>

            <button
              onClick={handleScaleRecipe}
              className="mt-2 w-full py-3 bg-[#2f6e4f] text-white rounded-2xl shadow-md hover:bg-[#26593f] transition font-semibold"
            >
              Scale recipe
            </button>

            {scaleOutput && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#1b302c]">
                    Scaled ingredients
                  </p>
                  <button
                    onClick={handleCopyScaled}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {scaleCopied ? "Copied!" : "Copy list"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                  {scaleOutput.join("\n")}
                </pre>
              </div>
            )}

            {scaleError && (
              <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-200 text-center text-red-700 text-sm">
                {scaleError}
              </div>
            )}
          </section>
        )}

        {tab === "full" && (
          <section className="mt-4 space-y-3">
            <p className="text-sm text-[#5f3c43] mb-2">
              Paste a full recipe and convert ingredient amounts to metric or
              US-style units. We’ll do our best to detect quantities and units.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-[#1b302c]">
                Convert to:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFullTargetSystem("metric")}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    fullTargetSystem === "metric"
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-[#fffaf4] text-[#1b302c] border-[#e4d5b8]"
                  }`}
                >
                  Metric (g / ml)
                </button>
                <button
                  onClick={() => setFullTargetSystem("us")}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    fullTargetSystem === "us"
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-[#fffaf4] text-[#1b302c] border-[#e4d5b8]"
                  }`}
                >
                  US (cups / oz)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm">
                Original recipe
              </label>
              <textarea
                value={fullInput}
                onChange={(e) => setFullInput(e.target.value)}
                rows={8}
                className="w-full p-3 rounded-2xl border border-[#e4d5b8] bg-[#fffaf4] text-sm"
                placeholder={`e.g.\n2 cups flour\n1/2 cup sugar\n1/4 cup butter, melted\n1 tsp vanilla extract`}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleFullConvert}
                className="flex-1 min-w-[140px] py-3 bg-[#2f6e4f] text-white rounded-2xl shadow-md hover:bg-[#26593f] transition font-semibold"
              >
                Convert full recipe
              </button>
              <button
                type="button"
                onClick={handleFullClear}
                className="flex-1 min-w-[120px] py-3 bg-[#f2ebd7] text-[#5f3c43] rounded-2xl border border-[#e4d5b8] hover:bg-[#e4d5b8] transition text-sm font-medium"
              >
                Clear text
              </button>
            </div>

            {fullOutput && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#1b302c]">
                    Converted recipe
                  </p>
                  <button
                    onClick={handleCopyFull}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {fullCopied ? "Copied!" : "Copy recipe"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                  {fullOutput.join("\n")}
                </pre>
              </div>
            )}

            {fullError && (
              <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-200 text-center text-red-700 text-sm">
                {fullError}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
