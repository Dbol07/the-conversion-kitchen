import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FloralDivider from "@/components/FloralDivider";
import calculatorBanner from "@/assets/banners/calculator-banner.png";
import { normalizeUnit } from "@/utils/conversions";
import {
  ingredientDensities,
  ingredientSynonyms,
} from "@/utils/ingredientDensities";

type TabId = "ingredient" | "scale" | "full";
type System = "us" | "metric";

interface ParsedLine {
  original: string;
  quantity: number | null;
  unit: string | null;
  ingredient: string;
}

/* ---------------------------------------
   UNIT TABLES
----------------------------------------*/

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
  pinch: 0.3125,
  dash: 0.625,
};

const MASS_FACTORS_G: Record<string, number> = {
  g: 1,
  kg: 1000,
  mg: 0.001,
  oz: 28.3495,
  lb: 453.592,
  stone: 6350.29,
  stick: 113,
};

/* ---------------------------------------
   HELPERS
----------------------------------------*/

function parseAmount(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const mixed = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    return +mixed[1] + +mixed[2] / +mixed[3];
  }

  const frac = trimmed.match(/^(\d+)\/(\d+)$/);
  if (frac) {
    return +frac[1] / +frac[2];
  }

  const val = Number(trimmed.replace(",", "."));
  return Number.isNaN(val) ? null : val;
}

function normalizeUnitToken(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const { unit } = normalizeUnit(raw);
  return unit;
}
function cleanLine(line: string): string {
  return line.replace(/^\s*[-•*·]\s*/, ""); // strip bullet symbols
}


const isVolumeUnit = (u: string | null) => !!u && VOLUME_UNITS.includes(u);
const isMassUnit = (u: string | null) => !!u && MASS_UNITS.includes(u);

const volumeToMl = (val: number, unit: string) =>
  (VOLUME_FACTORS_ML[unit] ?? 1) * val;

const massToGrams = (val: number, unit: string) =>
  (MASS_FACTORS_G[unit] ?? 1) * val;

function mlToUsSmart(amountMl: number) {
  if (amountMl < 1) return { value: amountMl, unit: "ml" };
  if (amountMl < 15) return { value: amountMl / 5, unit: "tsp" };
  if (amountMl < 60) return { value: amountMl / 15, unit: "tbsp" };
  return { value: amountMl / 240, unit: "cup" };
}

function gramsToUs(grams: number) {
  return { value: grams / 28.3495, unit: "oz" };
}

function deduceIngredientId(text: string): string | null {
  const lower = text.toLowerCase();
  if (ingredientDensities[lower]) return lower;

  for (const [raw, canon] of Object.entries(ingredientSynonyms)) {
    if (lower.includes(raw)) return canon;
  }
  return null;
}

function formatAmountForDisplay(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const whole = Math.floor(rounded + 1e-8);
  let frac = rounded - whole;

  const fractions = [
    { dec: 0.25, sym: "¼" },
    { dec: 0.33, sym: "⅓" },
    { dec: 0.5, sym: "½" },
    { dec: 0.67, sym: "⅔" },
    { dec: 0.75, sym: "¾" },
  ];

  let best: string | null = null;
  let diff = 0.02;

  for (const f of fractions) {
    const d = Math.abs(frac - f.dec);
    if (d < diff) {
      diff = d;
      best = f.sym;
      frac = f.dec;
    }
  }

  if (best) {
    return whole === 0 ? best : `${whole} ${best}`;
  }

  if (Math.abs(rounded - Math.round(rounded)) < 0.01) {
    return String(Math.round(rounded));
  }

  return rounded.toFixed(2).replace(/\.00$/, "");
}

function pluralizeUnit(unit: string, value: number) {
  if (Math.abs(value - 1) < 0.01) return unit;
  if (unit === "cup") return "cups";
  return unit;
}

const normalizeInlineUnit = (line: string) =>
  line.replace(/(\d(?:\s+\d+\/\d+)?)\s*([a-zA-Z]+)/, "$1 $2");

function parseRecipeLine(line: string): ParsedLine {
  const original = line;
  let text = normalizeInlineUnit(cleanLine(line.trim()));

  if (!text) return { original, quantity: null, unit: null, ingredient: "" };

  const parts = text.split(/\s+/);
  const qty = parseAmount(parts[0]);
  if (qty == null)
    return { original, quantity: null, unit: null, ingredient: text };

  let unit: string | null = null;
  let idx = 1;

  if (parts.length > 1) {
    const maybe = normalizeUnitToken(parts[1]);
    if (maybe && (isVolumeUnit(maybe) || isMassUnit(maybe))) {
      unit = maybe;
      idx = 2;
    }
  }

  return {
    original,
    quantity: qty,
    unit,
    ingredient: parts.slice(idx).join(" "),
  };
}

function convertParsedLine(parsed: ParsedLine, system: System): string | null {
  if (parsed.quantity == null) return null;

  const qty = parsed.quantity;
  const rawUnit = normalizeUnitToken(parsed.unit || "");
  const ingredientText = parsed.ingredient;

  const id =
    deduceIngredientId(ingredientText) ||
    ingredientSynonyms[ingredientText] ||
    ingredientText;

  const isVol = rawUnit && isVolumeUnit(rawUnit);
  const isMass = rawUnit && isMassUnit(rawUnit);

  if (!isVol && !isMass) return parsed.original;

  let finalValue = 0;
  let finalUnit = "";

  if (isVol) {
    const ml = volumeToMl(qty, rawUnit!);
    if (system === "metric") {
      finalValue = ml;
      finalUnit = "ml";
    } else {
      const us = mlToUsSmart(ml);
      finalValue = us.value;
      finalUnit = us.unit;
    }
  } else if (isMass) {
    const grams = massToGrams(qty, rawUnit!);
    if (system === "metric") {
      finalValue = grams;
      finalUnit = "g";
    } else {
      const density = ingredientDensities[id] || null;
      if (density) {
        const cups = grams / density;
        const converted = mlToUsSmart(cups * 240);
        finalValue = converted.value;
        finalUnit = converted.unit;
      } else {
        const us = gramsToUs(grams);
        finalValue = us.value;
        finalUnit = us.unit;
      }
    }
  }

  const valStr = formatAmountForDisplay(finalValue);
  const unitStr = pluralizeUnit(finalUnit, finalValue);

  return ingredientText
    ? `${valStr} ${unitStr} ${ingredientText}`.trim()
    : `${valStr} ${unitStr}`.trim();
}

/* ---------------------------------------
   COMPONENT
----------------------------------------*/

export default function Calculator() {
  /* URL-based tab syncing */
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const defaultTab: TabId =
    tabParam === "scale" || tabParam === "full" || tabParam === "ingredient"
      ? (tabParam as TabId)
      : "ingredient";

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  /* Ingredient converter */
  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [ingredientText, setIngredientText] = useState("");
  const [ingredientNote, setIngredientNote] = useState<string | null>(null);
  const [convResult, setConvResult] = useState<string | null>(null);
  const [convError, setConvError] = useState<string | null>(null);
  const [convCopied, setConvCopied] = useState(false);

  /* Scale */
  const [scaleOriginalServings, setScaleOriginalServings] = useState("4");
  const [scaleNewServings, setScaleNewServings] = useState("8");
  const [scaleInput, setScaleInput] = useState("");
  const [scaleOutput, setScaleOutput] = useState("");
  const [scaleError, setScaleError] = useState<string | null>(null);
  const [scaleCopied, setScaleCopied] = useState(false);

  /* Full recipe */
  const [fullInput, setFullInput] = useState("");
  const [fullOutput, setFullOutput] = useState("");
  const [fullSystem, setFullSystem] = useState<System>("us");
  const [fullError, setFullError] = useState<string | null>(null);
  const [fullCopied, setFullCopied] = useState(false);

  /* ---------------------------------------
     INGREDIENT CONVERTER
  ----------------------------------------*/

  function handleIngredientConvert() {
    setConvError(null);
    setConvResult(null);
    setIngredientNote(null);

    const qty = parseAmount(amount);
    if (qty == null || qty <= 0) {
      setConvError("Please enter a valid amount.");
      return;
    }

    const from = normalizeUnitToken(fromUnit);
    const to = normalizeUnitToken(toUnit);

    if (!from || !to) {
      setConvError("Select both units.");
      return;
    }

    const fromVol = isVolumeUnit(from);
    const fromMass = isMassUnit(from);
    const toVol = isVolumeUnit(to);
    const toMass = isMassUnit(to);

    let ingredientId: string | null = null;
    if (ingredientText.trim()) {
      ingredientId = deduceIngredientId(ingredientText);
      setIngredientNote(
        ingredientId
          ? `Detected ingredient: ${ingredientId}`
          : "Ingredient not recognized—using basic conversion."
      );
    }

    const canon =
      ingredientId ??
      ingredientSynonyms[ingredientText] ??
      ingredientText.toLowerCase();

    const density = ingredientDensities[canon];

    if (fromVol && toVol) {
      const ml = volumeToMl(qty, from);
      const result = ml / VOLUME_FACTORS_ML[to];
      setConvResult(
        `${formatAmountForDisplay(result)} ${pluralizeUnit(to, result)}`
      );
      return;
    }

    if (fromMass && toMass) {
      const g = massToGrams(qty, from);
      const result = g / MASS_FACTORS_G[to];
      setConvResult(
        `${formatAmountForDisplay(result)} ${pluralizeUnit(to, result)}`
      );
      return;
    }

    if (fromVol && toMass) {
      if (!density) {
        setConvError(
          "Volume → Weight requires a recognized ingredient (flour, sugar, etc.)"
        );
        return;
      }
      const ml = volumeToMl(qty, from);
      const grams = (ml / 240) * density;
      const result = grams / MASS_FACTORS_G[to];
      setConvResult(
        `${formatAmountForDisplay(result)} ${pluralizeUnit(to, result)}`
      );
      return;
    }

    if (fromMass && toVol) {
      if (!density) {
        setConvError(
          "Weight → Volume requires a recognized ingredient (flour, sugar, etc.)"
        );
        return;
      }
      const grams = massToGrams(qty, from);
      const cups = grams / density;
      const ml = cups * 240;
      const result = ml / VOLUME_FACTORS_ML[to];
      setConvResult(
        `${formatAmountForDisplay(result)} ${pluralizeUnit(to, result)}`
      );
      return;
    }

    setConvError("Units not convertible.");
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
    if (convResult) {
      await navigator.clipboard.writeText(convResult);
      setConvCopied(true);
      setTimeout(() => setConvCopied(false), 1500);
    }
  }

  /* ---------------------------------------
     SCALE RECIPE
  ----------------------------------------*/

  function handleScaleRecipe() {
    setScaleError(null);
    setScaleOutput("");

    const orig = Number(scaleOriginalServings);
    const next = Number(scaleNewServings);

    if (!orig || !next) {
      setScaleError("Enter valid servings.");
      return;
    }

    if (!scaleInput.trim()) {
      setScaleError("Paste a list first.");
      return;
    }

    const factor = next / orig;
    const lines = scaleInput.split(/\r?\n/);
    const out: string[] = [];

    for (const line of lines) {
      const parsed = parseRecipeLine(line);
      if (parsed.quantity == null) {
        out.push(parsed.original);
        continue;
      }

      const newQty = parsed.quantity * factor;
      const unitStr = parsed.unit ? ` ${parsed.unit}` : "";
      const ingStr = parsed.ingredient ? ` ${parsed.ingredient}` : "";

      out.push(
        `${formatAmountForDisplay(newQty)}${unitStr}${ingStr}`.trim()
      );
    }

    setScaleOutput(
      `Original servings: ${orig}\nNew servings: ${next}\n\n${out.join("\n")}`
    );
  }

  function handleScaleClear() {
    setScaleInput("");
    setScaleOutput("");
    setScaleCopied(false);
    setScaleError(null);
  }

  async function handleScaleCopy() {
    if (scaleOutput) {
      await navigator.clipboard.writeText(scaleOutput);
      setScaleCopied(true);
      setTimeout(() => setScaleCopied(false), 1500);
    }
  }

  /* ---------------------------------------
     FULL RECIPE
  ----------------------------------------*/

  function handleFullConvert() {
    setFullError(null);
    setFullOutput("");

    if (!fullInput.trim()) {
      setFullError("Paste a recipe first.");
      return;
    }

    const lines = fullInput.split(/\r?\n/);
    const out: string[] = [];

    for (const line of lines) {
      const parsed = parseRecipeLine(line);
      out.push(convertParsedLine(parsed, fullSystem) ?? parsed.original);
    }

    setFullOutput(out.join("\n"));
  }

  function handleFullClear() {
    setFullInput("");
    setFullOutput("");
    setFullCopied(false);
    setFullError(null);
  }

  async function handleFullCopy() {
    if (fullOutput) {
      await navigator.clipboard.writeText(fullOutput);
      setFullCopied(true);
      setTimeout(() => setFullCopied(false), 1500);
    }
  }

  /* ---------------------------------------
     UI
  ----------------------------------------*/

  const TABS: { id: TabId; label: string; subtitle: string }[] = [
    {
      id: "ingredient",
      label: "Ingredient Converter",
      subtitle: "Convert one ingredient",
    },
    {
      id: "scale",
      label: "Scale a Recipe",
      subtitle: "Change serving sizes",
    },
    {
      id: "full",
      label: "Full Recipe Converter",
      subtitle: "US ↔ Metric (smart units)",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
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
            Convert ingredients, scale recipes, and switch between US & Metric.
          </p>
        </div>
      </div>

      <FloralDivider variant="vine" size="sm" />

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchParams({ tab: tab.id });
            }}
            className={`px-3 py-2 rounded-2xl border text-sm sm:text-base transition ${
              activeTab === tab.id
                ? "bg-emerald-700 text-white border-emerald-800 shadow"
                : "bg-[#fffaf4] text-[#4b3b2f] border-[#e4d5b8] hover:bg-[#f5ebdc]"
            }`}
          >
            <div className="font-semibold">{tab.label}</div>
            <div className="text-xs opacity-80">{tab.subtitle}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 bg-white/90 border border-[#e4d5b8] rounded-2xl shadow-lg p-5">
        {/* INGREDIENT CONVERTER */}
        {activeTab === "ingredient" && (
          <>
            <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
              Ingredient Converter
            </h2>

            <p className="text-sm text-[#5f3c43] mb-4">
              Convert between cups, grams, ounces, and more. For weight↔volume
              conversions, type the ingredient to use accurate densities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Amount</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                  placeholder="1 1/2"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                >
                  <option value="">Unit</option>
                  {VOLUME_UNITS.concat(MASS_UNITS).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                >
                  <option value="">Unit</option>
                  {VOLUME_UNITS.concat(MASS_UNITS).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">
                Ingredient (optional)
              </label>
              <input
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                placeholder="flour, sugar, oats…"
              />
              {ingredientNote && (
                <p className="text-xs text-[#3c6150] mt-1">{ingredientNote}</p>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleIngredientConvert}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-semibold shadow"
              >
                Convert
              </button>
              <button
                onClick={handleIngredientClear}
                className="flex-1 py-2 rounded-xl bg-[#f2ebd7] border border-[#e4d5b8]"
              >
                Clear
              </button>
              <button
                onClick={handleIngredientCopy}
                disabled={!convResult}
                className="flex-1 py-2 rounded-xl bg-amber-200 border border-[#e4d5b8] disabled:opacity-50"
              >
                {convCopied ? "Copied!" : "Copy"}
              </button>
            </div>

            {convResult && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold">
                {convResult}
              </div>
            )}

            {convError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-xl">
                {convError}
              </div>
            )}
          </>
        )}

        {/* SCALE RECIPE */}
        {activeTab === "scale" && (
          <>
            <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
              Scale a Recipe
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Original servings
                </label>
                <input
                  value={scaleOriginalServings}
                  onChange={(e) => setScaleOriginalServings(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  New servings
                </label>
                <input
                  value={scaleNewServings}
                  onChange={(e) => setScaleNewServings(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                />
              </div>
            </div>

            <label className="text-sm font-medium mb-1 block">
              Ingredients (one per line)
            </label>
            <textarea
              value={scaleInput}
              onChange={(e) => setScaleInput(e.target.value)}
              className="w-full min-h-[140px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
              placeholder="1 cup flour&#10;2 tbsp sugar"
            />

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleScaleRecipe}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white shadow"
              >
                Scale
              </button>
              <button
                onClick={handleScaleClear}
                className="flex-1 py-2 rounded-xl bg-[#f2ebd7] border border-[#e4d5b8]"
              >
                Clear
              </button>
              <button
                onClick={handleScaleCopy}
                disabled={!scaleOutput}
                className="flex-1 py-2 rounded-xl bg-amber-200 border border-[#e4d5b8] disabled:opacity-50"
              >
                {scaleCopied ? "Copied!" : "Copy"}
              </button>
            </div>

            {scaleOutput && (
              <textarea
                readOnly
                className="mt-4 w-full min-h-[160px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                value={scaleOutput}
              />
            )}

            {scaleError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-xl">
                {scaleError}
              </div>
            )}
          </>
        )}

        {/* FULL RECIPE CONVERTER */}
        {activeTab === "full" && (
          <>
            <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
              Full Recipe Converter
            </h2>

            <div className="mb-3 flex gap-4">
              <label className="text-sm">
                <input
                  type="radio"
                  checked={fullSystem === "us"}
                  onChange={() => setFullSystem("us")}
                />{" "}
                US-friendly
              </label>
              <label className="text-sm">
                <input
                  type="radio"
                  checked={fullSystem === "metric"}
                  onChange={() => setFullSystem("metric")}
                />{" "}
                Metric-friendly
              </label>
            </div>

            <label className="text-sm font-medium mb-1 block">
              Ingredient list
            </label>
            <textarea
              value={fullInput}
              onChange={(e) => setFullInput(e.target.value)}
              className="w-full min-h-[160px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
              placeholder="1 cup flour&#10;200 g sugar&#10;2 tbsp butter"
            />

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleFullConvert}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white shadow"
              >
                Convert
              </button>
              <button
                onClick={handleFullClear}
                className="flex-1 py-2 rounded-xl bg-[#f2ebd7] border border-[#e4d5b8]"
              >
                Clear
              </button>
              <button
                onClick={handleFullCopy}
                disabled={!fullOutput}
                className="flex-1 py-2 rounded-xl bg-amber-200 border border-[#e4d5b8] disabled:opacity-50"
              >
                {fullCopied ? "Copied!" : "Copy"}
              </button>
            </div>

            {fullOutput && (
              <textarea
                readOnly
                className="mt-4 w-full min-h-[160px] p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
                value={fullOutput}
              />
            )}

            {fullError && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-xl">
                {fullError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
