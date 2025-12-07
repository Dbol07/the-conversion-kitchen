import { useState } from "react";
import FloralDivider from "@/components/FlloralDivider";
import calculatorBanner from "@/assets/banners/calculator-banner.png";

type TabId = "ingredient" | "scale" | "full";

interface ParsedLine {
  original: string;
  quantity: number | null;
  unit: string | null;
  ingredient: string;
}

type System = "us" | "metric";

/* -----------------------------
   UNIT + DENSITY TABLES
------------------------------*/

const VOLUME_UNITS = [
  "tsp",
  "tbsp",
  "cup",
  "floz",
  "ml",
  "l",
  "pint",
  "quart",
  "gallon",
  "pinch",
  "dash",
];

const MASS_UNITS = ["g", "kg", "mg", "oz", "lb", "stone", "stick"];

const VOLUME_FACTORS_ML: Record<string, number> = {
  tsp: 5,
  tbsp: 15,
  cup: 240,
  floz: 30,
  ml: 1,
  l: 1000,
  pint: 473,
  quart: 946,
  gallon: 3785,
  pinch: 0.3125, // ~ 1/16 tsp
  dash: 0.625, // ~ 1/8 tsp
};

const MASS_FACTORS_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  mg: 0.001,
  oz: 28.3495,
  lb: 453.592,
  stone: 6350.29,
  stick: 113, // 1 stick butter ≈ 113g
};

/**
 * Approximate densities in g/ml
 * (cozy home-baking level accuracy)
 */
const DENSITY_G_PER_ML: Record<string, number> = {
  coconut_flour: 0.47,
  almond_flour: 0.40,
  flour: 0.52, // all-purpose
  sugar: 0.83, // granulated
  brown_sugar: 0.88,
  powdered_sugar: 0.50,
  cocoa: 0.42,
  oats: 0.38,
  rice_flour: 0.58,
  oil: 0.92,
  yogurt: 1.03,
  shortening: 0.90,
};

const INGREDIENT_SYNONYMS: Record<string, string[]> = {
  coconut_flour: ["coconut flour"],
  almond_flour: ["almond flour"],
  flour: ["all-purpose flour", "ap flour", "flour"],
  sugar: ["granulated sugar", "white sugar", "sugar"],
  brown_sugar: ["brown sugar", "light brown sugar", "dark brown sugar"],
  powdered_sugar: [
    "powdered sugar",
    "icing sugar",
    "confectioners sugar",
    "confectioners' sugar",
  ],
  cocoa: ["cocoa powder", "cocoa"],
  oats: ["rolled oats", "oats", "quick oats", "old-fashioned oats"],
  rice_flour: ["rice flour"],
  oil: ["oil", "olive oil", "vegetable oil", "canola oil"],
  yogurt: ["yogurt", "greek yogurt"],
  shortening: ["shortening"],
};

const TABS: { id: TabId; label: string; subtitle: string }[] = [
  {
    id: "ingredient",
    label: "Ingredient Converter",
    subtitle: "Convert one ingredient between units",
  },
  {
    id: "scale",
    label: "Scale a Recipe",
    subtitle: "Scale ingredient amounts by servings",
  },
  {
    id: "full",
    label: "Full Recipe Converter",
    subtitle: "US ↔ Metric with smart units",
  },
];

/* -----------------------------
   HELPER FUNCTIONS
------------------------------*/

function parseAmount(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // e.g. "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]) || 1;
    return whole + num / den;
  }

  // e.g. "3/4"
  const fracMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const num = parseFloat(fracMatch[1]);
    const den = parseFloat(fracMatch[2]) || 1;
    return num / den;
  }

  const val = Number(trimmed.replace(",", "."));
  if (Number.isNaN(val)) return null;
  return val;
}

function normalizeUnitToken(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const u = raw.toLowerCase().replace(/\./g, "");

  // cups
  if (["c", "cup", "cups"].includes(u)) return "cup";

  // tsp
  if (["t", "tsp", "teaspoon", "teaspoons"].includes(u)) return "tsp";

  // tbsp
  if (["tb", "tbsp", "tbs", "tbl", "tablespoon", "tablespoons"].includes(u))
    return "tbsp";

  // fl oz
  if (["floz", "fl", "floz", "fluidounce", "fluidounces"].includes(u))
    return "floz";

  // ml
  if (["ml", "milliliter", "milliliters"].includes(u)) return "ml";

  // liter
  if (["l", "liter", "liters", "litre", "litres"].includes(u)) return "l";

  // pint
  if (["pt", "pint", "pints"].includes(u)) return "pint";

  // quart
  if (["qt", "quart", "quarts"].includes(u)) return "quart";

  // gallon
  if (["gal", "gallon", "gallons"].includes(u)) return "gallon";

  // grams
  if (["g", "gram", "grams"].includes(u)) return "g";

  // kg
  if (["kg", "kilogram", "kilograms"].includes(u)) return "kg";

  // mg
  if (["mg", "milligram", "milligrams"].includes(u)) return "mg";

  // oz
  if (["oz", "ounce", "ounces"].includes(u)) return "oz";

  // lb
  if (["lb", "lbs", "pound", "pounds"].includes(u)) return "lb";

  // stone
  if (["stone", "st"].includes(u)) return "stone";

  // stick
  if (["stick", "sticks"].includes(u)) return "stick";

  // pinch / dash
  if (["pinch", "pinches"].includes(u)) return "pinch";
  if (["dash", "dashes"].includes(u)) return "dash";

  return u;
}

function isVolumeUnit(u: string | null): boolean {
  return !!u && VOLUME_UNITS.includes(u);
}

function isMassUnit(u: string | null): boolean {
  return !!u && MASS_UNITS.includes(u);
}

function volumeToMl(amount: number, unit: string): number {
  const factor = VOLUME_FACTORS_ML[unit];
  return !factor ? amount : amount * factor;
}

function massToGrams(amount: number, unit: string): number {
  const factor = MASS_FACTORS_G[unit];
  return !factor ? amount : amount * factor;
}

function mlToMetric(amountMl: number) {
  return { value: amountMl, unit: "ml" as const };
}

function gramsToMetric(grams: number) {
  return { value: grams, unit: "g" as const };
}

/**
 * Smart ml → US units (tsp/tbsp/cup) based on size.
 */
function mlToUsSmart(amountMl: number) {
  if (amountMl < 1) {
    return { value: amountMl, unit: "ml" as const };
  }
  if (amountMl < 15) {
    return { value: amountMl / 5, unit: "tsp" as const };
  }
  if (amountMl < 60) {
    return { value: amountMl / 15, unit: "tbsp" as const };
  }
  return { value: amountMl / 240, unit: "cup" as const };
}

function gramsToUs(grams: number) {
  return { value: grams / 28.3495, unit: "oz" as const };
}

/**
 * Try to find a known ingredient id from arbitrary text.
 */
function deduceIngredientId(text: string): string | null {
  const lower = text.toLowerCase();
  // order: more specific first
  const entries = Object.entries(INGREDIENT_SYNONYMS);
  for (const [id, synonyms] of entries) {
    for (const syn of synonyms) {
      if (lower.includes(syn)) {
        return id;
      }
    }
  }
  return null;
}

/**
 * Format amount using hybrid decimals/fractions.
 */
function formatAmountForDisplay(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const integerPart = Math.floor(rounded + 1e-8);
  let frac = rounded - integerPart;

  const fractionDefs = [
    { dec: 0.25, sym: "¼" },
    { dec: 0.33, sym: "⅓" },
    { dec: 0.5, sym: "½" },
    { dec: 0.67, sym: "⅔" },
    { dec: 0.75, sym: "¾" },
  ];

  let bestMatch: string | null = null;
  let bestDiff = 0.02;

  for (const f of fractionDefs) {
    const diff = Math.abs(frac - f.dec);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestMatch = f.sym;
      frac = f.dec;
    }
  }

  if (bestMatch) {
    if (integerPart === 0) {
      return bestMatch;
    }
    return `${integerPart} ${bestMatch}`;
  }

  if (Math.abs(rounded - Math.round(rounded)) < 0.01) {
    return String(Math.round(rounded));
  }

  return rounded.toFixed(2).replace(/\.00$/, "");
}

function pluralizeUnit(unit: string, value: number): string {
  const approxOne = Math.abs(value - 1) < 0.01;
  if (approxOne) return unit;
  if (unit === "cup") return "cups";
  // things like g, ml, oz usually stay the same
  return unit;
}

/**
 * Normalize "2c sugar" → "2 c sugar" etc.
 */
function normalizeInlineUnit(line: string): string {
  return line.replace(/(\d(?:\s+\d+\/\d+)?)\s*([a-zA-Z]+)/, "$1 $2");
}

/**
 * Parse a recipe line into {quantity, unit, ingredient}
 */
function parseRecipeLine(line: string): ParsedLine {
  const original = line;
  let text = line.trim();
  if (!text) return { original, quantity: null, unit: null, ingredient: "" };

  text = normalizeInlineUnit(text);
  const parts = text.split(/\s+/);
  if (!parts.length) {
    return { original, quantity: null, unit: null, ingredient: "" };
  }

  const qty = parseAmount(parts[0]);
  if (qty == null) {
    return {
      original,
      quantity: null,
      unit: null,
      ingredient: text,
    };
  }

  let unit: string | null = null;
  let ingredientStartIndex = 1;

  if (parts.length > 1) {
    const maybeUnitRaw = parts[1];
    const normalized = normalizeUnitToken(maybeUnitRaw);
    if (normalized && (isVolumeUnit(normalized) || isMassUnit(normalized))) {
      unit = normalized;
      ingredientStartIndex = 2;
    }
  }

  const ingredient = parts.slice(ingredientStartIndex).join(" ") || "";
  return { original, quantity: qty, unit, ingredient };
}

/**
 * Convert a single parsed line to target system with smart units.
 */
function convertParsedLine(
  parsed: ParsedLine,
  system: System
): string | null {
  if (parsed.quantity == null) return null;
  const qty = parsed.quantity;
  const rawUnit = normalizeUnitToken(parsed.unit || "");
  const ingredientText = parsed.ingredient;

  const ingredientId = deduceIngredientId(ingredientText || "");
  const density = ingredientId ? DENSITY_G_PER_ML[ingredientId] : undefined;

  const isVolume = rawUnit && isVolumeUnit(rawUnit);
  const isMass = rawUnit && isMassUnit(rawUnit);

  // If we can't tell the unit, just leave the line alone.
  if (!isVolume && !isMass) {
    return parsed.original;
  }

  let finalValue: number;
  let finalUnit: string;

  // VOLUME FLOW
  if (isVolume) {
    const ml = volumeToMl(qty, rawUnit!);

    if (system === "metric") {
      // metric volume
      const metric = mlToMetric(ml);
      finalValue = metric.value;
      finalUnit = metric.unit;
    } else {
      // US volume, but if we know density and system is metric weight, we could go to grams.
      const us = mlToUsSmart(ml);
      finalValue = us.value;
      finalUnit = us.unit;
    }
  }
  // MASS FLOW
  else if (isMass) {
    const grams = massToGrams(qty, rawUnit!);

    if (system === "metric") {
      const m = gramsToMetric(grams);
      finalValue = m.value;
      finalUnit = m.unit;
    } else {
      const us = gramsToUs(grams);
      finalValue = us.value;
      finalUnit = us.unit;
    }
  } else {
    return parsed.original;
  }

  const valueStr = formatAmountForDisplay(finalValue);
  const unitStr = pluralizeUnit(finalUnit, finalValue);

  const ingredientOut = ingredientText || "";
  if (!ingredientOut) {
    return `${valueStr} ${unitStr}`.trim();
  }

  return `${valueStr} ${unitStr} ${ingredientOut}`.trim();
}

/* -----------------------------
   COMPONENT
------------------------------*/

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<TabId>("ingredient");

  /* INGREDIENT CONVERTER STATE */
  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [ingredientText, setIngredientText] = useState("");
  const [ingredientNote, setIngredientNote] = useState<string | null>(null);
  const [convResult, setConvResult] = useState<string | null>(null);
  const [convError, setConvError] = useState<string | null>(null);
  const [convCopied, setConvCopied] = useState(false);

  /* SCALE RECIPE STATE */
  const [scaleOriginalServings, setScaleOriginalServings] = useState("4");
  const [scaleNewServings, setScaleNewServings] = useState("8");
  const [scaleInput, setScaleInput] = useState("");
  const [scaleOutput, setScaleOutput] = useState("");
  const [scaleError, setScaleError] = useState<string | null>(null);
  const [scaleCopied, setScaleCopied] = useState(false);

  /* FULL RECIPE CONVERTER STATE */
  const [fullInput, setFullInput] = useState("");
  const [fullOutput, setFullOutput] = useState("");
  const [fullSystem, setFullSystem] = useState<System>("us");
  const [fullError, setFullError] = useState<string | null>(null);
  const [fullCopied, setFullCopied] = useState(false);

  /* -----------------------------
     INGREDIENT CONVERTER LOGIC
  ------------------------------*/

  function handleIngredientConvert() {
    setConvError(null);
    setConvResult(null);
    setIngredientNote(null);

    const qty = parseAmount(amount);
    if (qty == null || qty <= 0) {
      setConvError("Please enter a valid amount (like 1, 2.5, or 3/4).");
      return;
    }

    const from = normalizeUnitToken(fromUnit);
    const to = normalizeUnitToken(toUnit);

    if (!from || !to) {
      setConvError("Please select both From and To units.");
      return;
    }

    const fromIsVol = isVolumeUnit(from);
    const fromIsMass = isMassUnit(from);
    const toIsVol = isVolumeUnit(to);
    const toIsMass = isMassUnit(to);

    if (!fromIsVol && !fromIsMass) {
      setConvError("Unknown starting unit. Try tsp, tbsp, cup, g, oz, etc.");
      return;
    }
    if (!toIsVol && !toIsMass) {
      setConvError("Unknown target unit. Try tsp, tbsp, cup, g, oz, etc.");
      return;
    }

    let ingredientId: string | null = null;
    if (ingredientText.trim()) {
      ingredientId = deduceIngredientId(ingredientText);
      if (ingredientId) {
        const primaryName = INGREDIENT_SYNONYMS[ingredientId][0] || ingredientId;
        setIngredientNote(`Detected ingredient: ${primaryName}`);
      } else {
        setIngredientNote("Ingredient not recognized, using basic unit conversion.");
      }
    }

    const density =
      ingredientId && DENSITY_G_PER_ML[ingredientId]
        ? DENSITY_G_PER_ML[ingredientId]
        : undefined;

    // Same dimension → direct
    if (fromIsVol && toIsVol) {
      const ml = volumeToMl(qty, from);
      const resultAmount = ml / VOLUME_FACTORS_ML[to];
      setConvResult(
        `${formatAmountForDisplay(resultAmount)} ${pluralizeUnit(to, resultAmount)}`
      );
      return;
    }

    if (fromIsMass && toIsMass) {
      const grams = massToGrams(qty, from);
      const resultAmount = grams / MASS_FACTORS_G[to];
      setConvResult(
        `${formatAmountForDisplay(resultAmount)} ${pluralizeUnit(to, resultAmount)}`
      );
      return;
    }

    // Cross dimension: need density
    if (!density) {
      setConvError(
        "To convert between volume and weight, please type a known ingredient (flour, sugar, oats, etc.)."
      );
      return;
    }

    if (fromIsVol && toIsMass) {
      const ml = volumeToMl(qty, from);
      const grams = ml * density;
      const resultAmount = grams / MASS_FACTORS_G[to];
      setConvResult(
        `${formatAmountForDisplay(resultAmount)} ${pluralizeUnit(to, resultAmount)}`
      );
      return;
    }

    if (fromIsMass && toIsVol) {
      const grams = massToGrams(qty, from);
      const ml = grams / density;
      const resultAmount = ml / VOLUME_FACTORS_ML[to];
      setConvResult(
        `${formatAmountForDisplay(resultAmount)} ${pluralizeUnit(to, resultAmount)}`
      );
      return;
    }

    setConvError("Unable to convert with the given combination.");
  }

  function handleIngredientClear() {
    setAmount("");
    setFromUnit("");
    setToUnit("");
    setIngredientText("");
    setConvResult(null);
    setConvError(null);
    setIngredientNote(null);
    setConvCopied(false);
  }

  async function handleIngredientCopy() {
    if (!convResult) return;
    try {
      await navigator.clipboard.writeText(convResult);
      setConvCopied(true);
      setTimeout(() => setConvCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  /* -----------------------------
     SCALE RECIPE LOGIC
  ------------------------------*/

  function handleScaleRecipe() {
    setScaleError(null);
    setScaleOutput("");

    const origServings = Number(scaleOriginalServings);
    const newServings = Number(scaleNewServings);

    if (!origServings || !newServings || origServings <= 0 || newServings <= 0) {
      setScaleError("Please enter valid original and new servings.");
      return;
    }

    if (!scaleInput.trim()) {
      setScaleError("Paste your ingredient list to scale.");
      return;
    }

    const lines = scaleInput.split(/\r?\n/);
    const factor = newServings / origServings;
    const outLines: string[] = [];

    for (const line of lines) {
      if (!line.trim()) {
        outLines.push("");
        continue;
      }

      const parsed = parseRecipeLine(line);
      if (parsed.quantity == null) {
        outLines.push(parsed.original);
        continue;
      }

      const newQty = parsed.quantity * factor;
      const qtyStr = formatAmountForDisplay(newQty);
      const unitStr = parsed.unit ? ` ${parsed.unit}` : "";
      const ingredient = parsed.ingredient ? ` ${parsed.ingredient}` : "";

      outLines.push(`${qtyStr}${unitStr}${ingredient}`.trim());
    }

    const header = `Original servings: ${origServings}\nNew servings: ${newServings}\n\n`;
    const body = outLines.join("\n");
    setScaleOutput(header + body);
  }

  function handleScaleClear() {
    setScaleOutput("");
    setScaleInput("");
    setScaleError(null);
    setScaleCopied(false);
  }

  async function handleScaleCopy() {
    if (!scaleOutput) return;
    try {
      await navigator.clipboard.writeText(scaleOutput);
      setScaleCopied(true);
      setTimeout(() => setScaleCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  /* -----------------------------
     FULL RECIPE CONVERTER LOGIC
  ------------------------------*/

  function handleFullConvert() {
    setFullError(null);
    setFullOutput("");
    setFullCopied(false);

    if (!fullInput.trim()) {
      setFullError("Paste a recipe ingredient list to convert.");
      return;
    }

    const lines = fullInput.split(/\r?\n/);
    const outLines: string[] = [];

    for (const line of lines) {
      if (!line.trim()) {
        outLines.push("");
        continue;
      }

      const parsed = parseRecipeLine(line);
      const converted = convertParsedLine(parsed, fullSystem);
      outLines.push(converted ?? parsed.original);
    }

    setFullOutput(outLines.join("\n"));
  }

  function handleFullClear() {
    setFullInput("");
    setFullOutput("");
    setFullError(null);
    setFullCopied(false);
  }

  async function handleFullCopy() {
    if (!fullOutput) return;
    try {
      await navigator.clipboard.writeText(fullOutput);
      setFullCopied(true);
      setTimeout(() => setFullCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  /* -----------------------------
     RENDER
  ------------------------------*/

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      {/* Banner */}
      <div className="relative w-full mb-6">
        <img
          src={calculatorBanner}
          alt="Calculator banner"
          className="w-full rounded-2xl shadow-lg object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Recipe Conversion Calculator
          </h1>
          <p className="text-sm sm:text-base text-white/90 mt-2 max-w-xl">
            Convert ingredients, scale recipes, and switch between US & Metric —
            all in one cozy tool.
          </p>
        </div>
      </div>

      <FloralDivider variant="vine" size="sm" />

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-2xl border text-sm sm:text-base transition ${
                active
                  ? "bg-emerald-700 text-white border-emerald-800 shadow"
                  : "bg-[#fffaf4] text-[#4b3b2f] border-[#e4d5b8] hover:bg-[#f5ebdc]"
              }`}
            >
              <div className="font-semibold">{tab.label}</div>
              <div className="text-xs opacity-80">{tab.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="mt-6 bg-white/90 border border-[#e4d5b8] rounded-2xl shadow-lg p-5">
        {activeTab === "ingredient" && (
          <>
            <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
              Ingredient Converter
            </h2>
            <p className="text-sm text-[#5f3c43] mb-4">
              Convert between cups, grams, ounces, and more. For volume↔weight
              conversions, type the ingredient so we can guess the density.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                  placeholder="e.g. 1 1/2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                >
                  <option value="">Select unit</option>
                  <option value="tsp">tsp</option>
                  <option value="tbsp">tbsp</option>
                  <option value="cup">cup</option>
                  <option value="floz">fl oz</option>
                  <option value="ml">ml</option>
                  <option value="l">liter</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="lb">lb</option>
                  <option value="stick">stick (butter)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                >
                  <option value="">Select unit</option>
                  <option value="tsp">tsp</option>
                  <option value="tbsp">tbsp</option>
                  <option value="cup">cup</option>
                  <option value="floz">fl oz</option>
                  <option value="ml">ml</option>
                  <option value="l">liter</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="lb">lb</option>
                  <option value="stick">stick (butter)</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Ingredient (optional, helps with volume↔weight)
              </label>
              <input
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                placeholder="e.g. all-purpose flour, brown sugar, oats…"
              />
              {ingredientNote && (
                <p className="text-xs text-[#3c6150] mt-1">{ingredientNote}</p>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleIngredientConvert}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800"
              >
                Convert
              </button>
              <button
                onClick={handleIngredientClear}
                className="flex-1 py-2 rounded-xl bg-[#f2ebd7] text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-[#e4d5b8]"
              >
                Clear
              </button>
              <button
                onClick={handleIngredientCopy}
                disabled={!convResult}
                className="flex-1 py-2 rounded-xl bg-amber-200 text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-amber-300 disabled:opacity-50"
              >
                {convCopied ? "Copied!" : "Copy result"}
              </button>
            </div>

            {convResult && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold">
                {convResult}
              </div>
            )}

            {convError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-center text-red-700">
                {convError}
              </div>
            )}
          </>
        )}

        {activeTab === "scale" && (
          <>
            <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
              Scale a Recipe
            </h2>
            <p className="text-sm text-[#5f3c43] mb-4">
              Paste your ingredient list, then adjust original and new servings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Original servings
                </label>
                <input
                  value={scaleOriginalServings}
                  onChange={(e) => setScaleOriginalServings(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New servings
                </label>
                <input
                  value={scaleNewServings}
                  onChange={(e) => setScaleNewServings(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                />
              </div>
            </div>

            <label className="block text-sm font-medium mb-1">
              Ingredients (one per line)
            </label>
            <textarea
              value={scaleInput}
              onChange={(e) => setScaleInput(e.target.value)}
              className="w-full min-h-[140px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
              placeholder="e.g.&#10;1 cup flour&#10;1/2 cup sugar&#10;2 tbsp butter"
            />

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleScaleRecipe}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800"
              >
                Scale recipe
              </button>
              <button
                onClick={handleScaleClear}
                className="flex-1 py-2 rounded-xl bg-[#f2ebd7] text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-[#e4d5b8]"
              >
                Clear
              </button>
              <button
                onClick={handleScaleCopy}
                disabled={!scaleOutput}
                className="flex-1 py-2 rounded-xl bg-amber-200 text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-amber-300 disabled:opacity-50"
              >
                {scaleCopied ? "Copied!" : "Copy scaled list"}
              </button>
            </div>

            {scaleOutput && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Scaled ingredients
                </label>
                <textarea
                  readOnly
                  value={scaleOutput}
                  className="w-full min-h-[140px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                />
              </div>
            )}

            {scaleError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-center text-red-700">
                {scaleError}
              </div>
            )}
          </>
        )}

        {activeTab === "full" && (
          <>
            <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
              Full Recipe Converter
            </h2>
            <p className="text-sm text-[#5f3c43] mb-4">
              Paste a full ingredient list (one per line). We&apos;ll use smart
              units and hybrid rounding for cozy, cookbook-style output.
            </p>

            <div className="mb-3 flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-[#4b3b2f]">
                Target style:
              </span>
              <label className="text-sm flex items-center gap-1">
                <input
                  type="radio"
                  name="system"
                  value="us"
                  checked={fullSystem === "us"}
                  onChange={() => setFullSystem("us")}
                />
                US-friendly (cups, tsp, oz)
              </label>
              <label className="text-sm flex items-center gap-1">
                <input
                  type="radio"
                  name="system"
                  value="metric"
                  checked={fullSystem === "metric"}
                  onChange={() => setFullSystem("metric")}
                />
                Metric-friendly (g, ml)
              </label>
            </div>

            <label className="block text-sm font-medium mb-1">
              Original recipe (one ingredient per line)
            </label>
            <textarea
              value={fullInput}
              onChange={(e) => setFullInput(e.target.value)}
              className="w-full min-h-[160px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
              placeholder="e.g.&#10;1 cup flour&#10;1/2 cup sugar&#10;2 tbsp butter"
            />

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleFullConvert}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800"
              >
                Convert recipe
              </button>
              <button
                onClick={handleFullClear}
                className="flex-1 py-2 rounded-xl bg-[#f2ebd7] text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-[#e4d5b8]"
              >
                Clear
              </button>
              <button
                onClick={handleFullCopy}
                disabled={!fullOutput}
                className="flex-1 py-2 rounded-xl bg-amber-200 text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-amber-300 disabled:opacity-50"
              >
                {fullCopied ? "Copied!" : "Copy converted recipe"}
              </button>
            </div>

            {fullOutput && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Converted recipe
                </label>
                <textarea
                  readOnly
                  value={fullOutput}
                  className="w-full min-h-[160px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                />
              </div>
            )}

            {fullError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-center text-red-700">
                {fullError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
