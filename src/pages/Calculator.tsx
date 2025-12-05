import React, { useEffect, useState } from "react";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";
import BgCalculator from "../assets/backgrounds/bg-calculator.jpg";
import { loadTemplates, RecipeTemplate } from "../utils/templateLoader";

type MeasurementSystem = "us" | "metric";
type Kind = "volume" | "weight";

// Simple unit conversion helpers (same as before)
const volumeFactorsMl: Record<string, number> = {
  tsp: 4.92892,
  tbsp: 14.7868,
  cup: 240,
  ml: 1,
  l: 1000,
};

const weightFactorsG: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

function convertValue(
  value: number,
  fromUnit: string,
  toUnit: string,
  kind: Kind
): number | null {
  if (kind === "volume") {
    const from = volumeFactorsMl[fromUnit];
    const to = volumeFactorsMl[toUnit];
    if (!from || !to) return null;
    return (value * from) / to;
  } else {
    const from = weightFactorsG[fromUnit];
    const to = weightFactorsG[toUnit];
    if (!from || !to) return null;
    return (value * from) / to;
  }
}

// Ingredient densities in grams per cup (approx)
const ingredientGramsPerCup: Record<string, number> = {
  flour: 120,
  sugar: 200,
  "brown sugar": 220,
  butter: 227,
};

// Parse strings like "2 cups", "1 1/2 cups", "0.5 cup"
function parseAmountAndRest(
  measurement: string
): { amount: number | null; rest: string } {
  const tokens = measurement.trim().split(/\s+/);
  let amount = 0;
  let consumed = 0;

  const isNumber = (t: string) => /^\d+(\.\d+)?$/.test(t);
  const isFraction = (t: string) => /^\d+\/\d+$/.test(t);

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (isNumber(t)) {
      amount += parseFloat(t);
      consumed = i + 1;
    } else if (isFraction(t)) {
      const [num, den] = t.split("/");
      amount += parseInt(num, 10) / parseInt(den, 10);
      consumed = i + 1;
    } else {
      break;
    }
  }

  if (consumed === 0) {
    return { amount: null, rest: measurement };
  }

  const rest = tokens.slice(consumed).join(" ");
  return { amount, rest };
}

const volumeUnits = ["tsp", "tbsp", "cup", "ml", "l"];
const weightUnits = ["g", "kg", "oz", "lb"];

export default function Calculator() {
  // System toggle
  const [system, setSystem] = useState<MeasurementSystem>("us");

  // Converter state
  const [kind, setKind] = useState<Kind>("volume");
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cup");
  const [toUnit, setToUnit] = useState("ml");
  const [convertResult, setConvertResult] = useState<string | null>(null);

  // Recipe scaler state
  const [origServings, setOrigServings] = useState("");
  const [newServings, setNewServings] = useState("");

  // Templates
  const [templates, setTemplates] = useState<RecipeTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

  // Ingredient weight helper
  const [weightIngredient, setWeightIngredient] = useState("flour");
  const [weightAmount, setWeightAmount] = useState("");
  const [weightUnit, setWeightUnit] = useState("cup");
  const [weightResult, setWeightResult] = useState<string | null>(null);

  // Derived scale factor
  const scaleFactor =
    origServings && newServings
      ? Number(newServings) / Number(origServings)
      : null;

  const activeTemplate =
    templates.length > 0 ? templates[activeTemplateIndex] : null;

  // Load templates on mount
  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setTemplatesLoading(true);
        const data = await loadTemplates();
        if (!cancelled) {
          setTemplates(data);
          if (data.length > 0) {
            setActiveTemplateIndex(0);
            // Only set origServings if user hasn't typed anything yet
            setOrigServings((prev) =>
              prev || String(data[0].servings ?? "")
            );
          }
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
        if (!cancelled) {
          setTemplatesError("Unable to load recipe templates.");
        }
      } finally {
        if (!cancelled) {
          setTemplatesLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setConvertResult("Please enter a valid number.");
      return;
    }
    const result = convertValue(value, fromUnit, toUnit, kind);
    if (result === null) {
      setConvertResult("Conversion not available for these units.");
    } else {
      setConvertResult(`${result.toFixed(2)} ${toUnit}`);
    }
  };

  const handleWeightConvert = () => {
    const amt = parseFloat(weightAmount);
    if (isNaN(amt)) {
      setWeightResult("Enter a valid amount.");
      return;
    }

    const gramsPerCup = ingredientGramsPerCup[weightIngredient];
    if (!gramsPerCup) {
      setWeightResult("Unknown ingredient.");
      return;
    }

    let grams = 0;
    if (weightUnit === "cup") {
      grams = amt * gramsPerCup;
    } else if (weightUnit === "tbsp") {
      const cups = amt / 16; // 16 tbsp = 1 cup
      grams = cups * gramsPerCup;
    } else if (weightUnit === "tsp") {
      const cups = amt / 48; // 48 tsp = 1 cup
      grams = cups * gramsPerCup;
    } else if (weightUnit === "g") {
      grams = amt;
    } else if (weightUnit === "oz") {
      grams = amt * 28.3495;
    }

    const ounces = grams / 28.3495;
    setWeightResult(
      `${grams.toFixed(1)} g (${ounces.toFixed(2)} oz) of ${weightIngredient}`
    );
  };

  const handleCopyScaledRecipe = async () => {
    if (!scaleFactor || !activeTemplate) {
      alert("Please select a template and set servings first.");
      return;
    }

    const lines: string[] = [];

    for (const ing of activeTemplate.ingredients) {
      const sourceString = system === "us" ? ing.us : ing.metric;
      const { amount, rest } = parseAmountAndRest(sourceString);
      if (amount === null) {
        // fallback: show as original with factor
        lines.push(`- ${sourceString} (${scaleFactor.toFixed(2)}×) ${ing.item}`);
      } else {
        const scaled = amount * scaleFactor;
        lines.push(
          `- **${scaled.toFixed(2)} ${rest}** ${ing.item}`.trim()
        );
      }
    }

    const markdownParts: string[] = [
      `### ${activeTemplate.name} (scaled)`,
      ``,
      `Base servings: ${activeTemplate.servings}`,
      `New servings: ${newServings || "?"}`,
      `Scale factor: ${scaleFactor.toFixed(2)}×`,
      ``,
      ...lines,
    ];

    if (activeTemplate.instructions && activeTemplate.instructions.length > 0) {
      markdownParts.push("", "#### Instructions", "");
      activeTemplate.instructions.forEach((step, idx) => {
        markdownParts.push(`${idx + 1}. ${step}`);
      });
    }

    const markdown = markdownParts.join("\n");

    try {
      await navigator.clipboard.writeText(markdown);
      alert("Scaled recipe copied in Markdown format!");
    } catch (err) {
      console.error(err);
      alert("Unable to copy to clipboard in this browser.");
    }
  };

  const currentUnits = kind === "volume" ? volumeUnits : weightUnits;

  const systemLabel = system === "us" ? "US Cups" : "Metric";

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgCalculator})` }}
    >
      <div className="bg-[#1b302c]/40 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Kitchen Calculator
            </h1>
            <p className="text-white/85 text-sm mt-1">
              Convert measurements, scale recipes, and keep everything cozy.
            </p>
          </header>

          {/* SYSTEM TOGGLE */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-[#faf6f0]/90 rounded-full p-1 shadow-md">
              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  system === "us"
                    ? "bg-[#5f3c43] text-white"
                    : "text-[#5f3c43]"
                }`}
                onClick={() => setSystem("us")}
              >
                US
              </button>
              <button
                className={`px-4 py-1 text-sm rounded-full ${
                  system === "metric"
                    ? "bg-[#5f3c43] text-white"
                    : "text-[#5f3c43]"
                }`}
                onClick={() => setSystem("metric")}
              >
                Metric
              </button>
            </div>
          </div>

          <FloralDivider variant="vine" />

          {/* MEASUREMENT CONVERTER */}
          <DecorativeFrame className="mt-6">
            <div className="parchment-card p-6">
              <h2 className="text-2xl font-bold text-[#1b302c] text-center mb-3">
                Measurement Converter
              </h2>
              <p className="text-[#5f3c43] text-sm text-center mb-4">
                Quickly convert between common kitchen units ({systemLabel}).
              </p>

              {/* Volume / Weight toggle */}
              <div className="flex justify-center mb-4 gap-2">
                <button
                  className={`px-4 py-1 rounded-full text-sm ${
                    kind === "volume"
                      ? "bg-[#3c6150] text-white"
                      : "bg-[#faf6f0] text-[#5f3c43] border border-[#b8d3d5]"
                  }`}
                  onClick={() => {
                    setKind("volume");
                    setFromUnit("cup");
                    setToUnit(system === "metric" ? "ml" : "cup");
                  }}
                >
                  Volume
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm ${
                    kind === "weight"
                      ? "bg-[#3c6150] text-white"
                      : "bg-[#faf6f0] text-[#5f3c43] border border-[#b8d3d5]"
                  }`}
                  onClick={() => {
                    setKind("weight");
                    setFromUnit(system === "metric" ? "g" : "oz");
                    setToUnit(system === "metric" ? "g" : "oz");
                  }}
                >
                  Weight
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="p-3 rounded-xl bg-white border-2 border-[#b8d3d5] text-[#1b302c] shadow-sm focus:border-[#3c6150] transition-all"
                />

                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="p-3 rounded-xl bg-white border-2 border-[#b8d3d5] text-[#1b302c] shadow-sm focus:border-[#3c6150] transition-all"
                >
                  {currentUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="p-3 rounded-xl bg-white border-2 border-[#b8d3d5] text-[#1b302c] shadow-sm focus:border-[#3c6150] transition-all"
                >
                  {currentUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleConvert}
                className="w-full mt-4 py-3 rounded-xl bg-[#3c6150] text-white font-semibold hover:bg-[#5f3c43] transition-all shadow-md"
              >
                Convert
              </button>

              {convertResult && (
                <div className="mt-4 bg-[#b8d3d5]/40 p-4 rounded-xl text-center shadow-inner">
                  <p className="text-lg font-bold text-[#1b302c]">
                    {convertResult}
                  </p>
                </div>
              )}

              {/* Ingredient Weight Helper */}
              <div className="mt-6 pt-4 border-t border-[#e0d4c3]">
                <h3 className="text-lg font-bold text-[#1b302c] mb-2 text-center">
                  Ingredient Weight Helper
                </h3>
                <p className="text-[#5f3c43] text-xs text-center mb-3">
                  Perfect for flour, sugar, brown sugar, and butter.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <input
                    type="number"
                    value={weightAmount}
                    onChange={(e) => setWeightAmount(e.target.value)}
                    placeholder="Amount"
                    className="p-3 rounded-xl bg-white border-2 border-[#b8d3d5] text-[#1b302c] shadow-sm focus:border-[#3c6150] transition-all"
                  />

                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="p-3 rounded-xl bg-white border-2 border-[#b8d3d5] text-[#1b302c] shadow-sm focus:border-[#3c6150] transition-all"
                  >
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                  </select>

                  <select
                    value={weightIngredient}
                    onChange={(e) => setWeightIngredient(e.target.value)}
                    className="p-3 rounded-xl bg-white border-2 border-[#b8d3d5] text-[#1b302c] shadow-sm focus:border-[#3c6150] transition-all"
                  >
                    <option value="flour">Flour</option>
                    <option value="sugar">Sugar</option>
                    <option value="brown sugar">Brown sugar</option>
                    <option value="butter">Butter</option>
                  </select>
                </div>

                <button
                  onClick={handleWeightConvert}
                  className="w-full py-2 rounded-xl bg-[#a77a72] text-white text-sm font-semibold hover:bg-[#5f3c43] transition-all shadow-md"
                >
                  Convert to weight
                </button>

                {weightResult && (
                  <p className="mt-2 text-center text-[#1b302c] text-sm bg-[#b8d3d5]/40 p-2 rounded-xl">
                    {weightResult}
                  </p>
                )}
              </div>
            </div>
          </DecorativeFrame>

          <div className="my-8">
            <FloralDivider variant="mushroom" />
          </div>

          {/* RECIPE SCALER + TEMPLATES */}
          <DecorativeFrame>
            <div className="parchment-card p-6">
              <h2 className="text-2xl font-bold text-[#1b302c] text-center mb-3">
                Recipe Scaler & Templates
              </h2>
              <p className="text-[#5f3c43] text-sm text-center mb-4">
                Pick a base recipe, set servings, and get a scaled ingredient
                list in {systemLabel.toLowerCase()}.
              </p>

              {/* Servings inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[#1b302c] font-semibold text-sm">
                    Original Servings
                  </label>
                  <input
                    type="number"
                    value={origServings}
                    onChange={(e) => setOrigServings(e.target.value)}
                    placeholder={
                      activeTemplate
                        ? String(activeTemplate.servings)
                        : "e.g. 12"
                    }
                    className="w-full p-3 mt-1 rounded-xl border-2 border-[#b8d3d5] bg-white focus:border-[#3c6150] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[#1b302c] font-semibold text-sm">
                    Desired Servings
                  </label>
                  <input
                    type="number"
                    value={newServings}
                    onChange={(e) => setNewServings(e.target.value)}
                    placeholder="e.g. 18"
                    className="w-full p-3 mt-1 rounded-xl border-2 border-[#b8d3d5] bg-white focus:border-[#3c6150] transition-all"
                  />
                </div>
              </div>

              {/* Template selector */}
              {templatesLoading && (
                <p className="text-center text-[#5f3c43] text-sm mb-4">
                  Loading templates…
                </p>
              )}

              {templatesError && (
                <p className="text-center text-red-200 text-sm mb-4">
                  {templatesError}
                </p>
              )}

              {!templatesLoading && templates.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#5f3c43] mb-2 text-center">
                    Choose a cozy starting point:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {templates.map((t, idx) => (
                      <button
                        key={t.name + idx}
                        onClick={() => {
                          setActiveTemplateIndex(idx);
                          setOrigServings((prev) =>
                            prev || String(t.servings ?? "")
                          );
                        }}
                        className={`p-3 rounded-xl text-sm text-left border-2 transition-all shadow-sm flex flex-col items-center ${
                          idx === activeTemplateIndex
                            ? "border-[#a77a72] bg-[#b8d3d5]/40"
                            : "border-[#b8d3d5] bg-[#faf6f0] hover:bg-[#b8d3d5]/20"
                        }`}
                      >
                        {t.thumb && (
                          <img
                            src={t.thumb}
                            alt={t.name}
                            className="w-20 h-20 object-cover rounded-lg mb-2 shadow-md"
                          />
                        )}
                        <div className="font-semibold text-[#1b302c] text-center">
                          {t.name}
                        </div>
                        <div className="text-xs text-[#5f3c43] text-center">
                          Base: {t.servings} servings
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!templatesLoading && templates.length === 0 && (
                <p className="text-center text-[#5f3c43] text-sm mb-4">
                  No templates found yet. Add JSON + images to
                  <br />
                  <code className="text-xs bg-[#faf6f0] px-2 py-1 rounded">
                    src/assets/templates/
                  </code>
                </p>
              )}

              {/* Scaled ingredient list */}
              {activeTemplate && scaleFactor ? (
                <div className="mt-4 bg-[#b8d3d5]/30 p-4 rounded-xl shadow-inner">
                  <h3 className="text-lg font-bold text-[#1b302c] mb-2">
                    Scaled Ingredients ({system === "us" ? "US" : "Metric"})
                  </h3>
                  <ul className="space-y-1 text-sm text-[#1b302c]">
                    {activeTemplate.ingredients.map((ing, idx) => {
                      const source = system === "us" ? ing.us : ing.metric;
                      const { amount, rest } = parseAmountAndRest(source);

                      if (amount === null) {
                        return (
                          <li key={idx}>
                            {source} ({scaleFactor.toFixed(2)}×) {ing.item}
                          </li>
                        );
                      }

                      const scaled = amount * scaleFactor;
                      return (
                        <li key={idx}>
                          <span className="font-semibold">
                            {scaled.toFixed(2)} {rest}
                          </span>{" "}
                          {ing.item}
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    onClick={handleCopyScaledRecipe}
                    className="mt-4 w-full py-2 rounded-xl bg-[#3c6150] text-white text-sm font-semibold hover:bg-[#5f3c43] transition-all shadow-md"
                  >
                    Copy scaled recipe (Markdown)
                  </button>
                </div>
              ) : (
                <p className="text-center text-[#5f3c43] mt-3 text-sm">
                  Select a template and enter both serving values to see the
                  scaled ingredient list.
                </p>
              )}
            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
