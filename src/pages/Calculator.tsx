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
};

const MASS_FACTORS_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.6,
};

const INGREDIENT_DENSITY_G_PER_CUP: Record<string, number> = {
  flour: 120,
  sugar: 200,
  "brown sugar": 210,
  butter: 227,
  honey: 340,
  water: 240,
  milk: 245,
};

const INGREDIENT_OPTIONS = [
  { id: "flour", label: "Flour" },
  { id: "sugar", label: "Sugar" },
  { id: "brown sugar", label: "Brown sugar" },
  { id: "butter", label: "Butter" },
  { id: "honey", label: "Honey" },
  { id: "water", label: "Water" },
  { id: "milk", label: "Milk" },
];

const VOLUME_UNIT_OPTIONS = [
  { value: "tsp", label: "teaspoons (tsp)" },
  { value: "tbsp", label: "tablespoons (tbsp)" },
  { value: "cup", label: "cups" },
  { value: "floz", label: "fluid ounces (fl oz)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "liter", label: "liters (L)" },
];

const MASS_UNIT_OPTIONS = [
  { value: "g", label: "grams (g)" },
  { value: "kg", label: "kilograms (kg)" },
  { value: "oz", label: "ounces (oz)" },
  { value: "lb", label: "pounds (lb)" },
];

const ALL_UNIT_OPTIONS = [
  ...VOLUME_UNIT_OPTIONS,
  ...MASS_UNIT_OPTIONS,
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
    "lb",
    "pound",
    "pounds",
  ];

  return lines.map((line) => {
    // Rough pattern: [qty] [unit?] [rest]
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

  /* FULL RECIPE CONVERTER STATE */
  const [fullInput, setFullInput] = useState("");
  const [fullTargetSystem, setFullTargetSystem] = useState<"metric" | "us">(
    "metric"
  );
  const [fullOutput, setFullOutput] = useState<string[] | null>(null);
  const [fullError, setFullError] = useState<string | null>(null);

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
    setIngResult(`${rounded} ${ingToUnit}`);
    if (result.note) setIngNote(result.note);
  }

  function handleScaleRecipe() {
    setScaleError(null);
    setScaleOutput(null);

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

  function handleFullConvert() {
    setFullError(null);
    setFullOutput(null);

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

      // Map loose unit words to internal codes
      const normalizedUnit = normalizeUnit(line.unit);
      if (!normalizedUnit) {
        lines.push(line.original);
        continue;
      }

      let targetUnit: string;
      if (fullTargetSystem === "metric") {
        targetUnit = isVolumeUnit(normalizedUnit) ? "ml" : "g";
      } else {
        // US
        targetUnit = isVolumeUnit(normalizedUnit) ? "cup" : "oz";
      }

      // Try to guess ingredient id from text
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

  function normalizeUnit(rawUnit: string): string | null {
    const u = rawUnit.toLowerCase();
    if (["tsp", "teaspoon", "teaspoons"].includes(u)) return "tsp";
    if (["tbsp", "tablespoon", "tablespoons"].includes(u)) return "tbsp";
    if (["cup", "cups"].includes(u)) return "cup";
    if (["fl", "floz", "fl-oz", "fl_oz", "fl oz"].includes(u)) return "floz";
    if (["ml", "milliliter", "milliliters"].includes(u)) return "ml";
    if (["l", "liter", "liters"].includes(u)) return "liter";
    if (["g", "gram", "grams"].includes(u)) return "g";
    if (["kg", "kilogram", "kilograms"].includes(u)) return "kg";
    if (["oz", "ounce", "ounces"].includes(u)) return "oz";
    if (["lb", "pound", "pounds"].includes(u)) return "lb";
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
      case "g":
        return "g";
      case "kg":
        return "kg";
      case "oz":
        return "oz";
      case "lb":
        return "lb";
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
                  {ALL_UNIT_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
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
                  {ALL_UNIT_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
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
                <option value="">Optional — choose when using cups ↔ grams</option>
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
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-[#1b302c] font-semibold">
                {ingResult}
                {ingNote && (
                  <p className="mt-1 text-xs text-[#5f3c43] font-normal">
                    {ingNote}
                  </p>
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
              Change a recipe’s serving size. Paste your ingredient list and
              we’ll scale the quantities.
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
                <p className="font-semibold text-center text-[#1b302c] mb-2">
                  Scaled ingredients
                </p>
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

            <div className="flex gap-3 items-center">
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

            <button
              onClick={handleFullConvert}
              className="mt-2 w-full py-3 bg-[#2f6e4f] text-white rounded-2xl shadow-md hover:bg-[#26593f] transition font-semibold"
            >
              Convert full recipe
            </button>

            {fullOutput && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">
                <p className="font-semibold text-center text-[#1b302c] mb-2">
                  Converted recipe
                </p>
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
