import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { convertLocally } from "@/lib/unitConversion";
import calculatorBanner from "@/assets/banners/calculator-banner.png";

// Auto-import template JSON files
const templates = import.meta.glob("/src/assets/templates/*-template.json", {
  eager: true,
  import: "default",
}) as Record<string, any>;

export default function CalculatorPage() {
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("cups");
  const [toUnit, setToUnit] = useState("grams");
  const [ingredient, setIngredient] = useState("");

  const [ingredientList, setIngredientList] = useState<
    { name: string; amount: string }[]
  >([]);

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------------------
     1. TEMPLATE AUTO-LOAD (from TemplatePreview → Calculator)
  ---------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get("template");
    const ingString = params.get("ingredients");

    // ---------------------------
    // TEMPLATE LOADING
    // ---------------------------
    if (name) {
      const match = Object.entries(templates).find(([path]) =>
        path.toLowerCase().includes(`${name}-template.json`)
      );

      if (match) {
        const template = match[1];
        if (template.amount) setAmount(String(template.amount));
        if (template.fromUnit) setFromUnit(template.fromUnit);
        if (template.toUnit) setToUnit(template.toUnit);
        if (template.ingredient) setIngredient(template.ingredient);

        setResult(null);
        setError(null);
      }
    }

    // ---------------------------
    // INGREDIENT LIST (from RecipeDetails)
    // ---------------------------
    if (ingString) {
      const parsed = ingString.split(";").map((pair) => {
        const [name, amount] = pair.split(":");
        return { name, amount };
      });
      setIngredientList(parsed);
    }
  }, [location.search]);

  /* ----------------------------------------------------
     2. SMART HYBRID CONVERSION (Local → Wolfram)
  ---------------------------------------------------- */
  async function smartConvert() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // LOCAL conversion (no ingredient → unit-only)
      if (!ingredient) {
        const local = convertLocally(amount, fromUnit, toUnit);
        if (local.ok) {
          const rounded = Math.round(local.value * 100) / 100;
          setResult(`${rounded} ${toUnit}`);
          setLoading(false);
          return;
        }
      }

      // Wolfram Alpha fallback (ingredient needed)
      const query = `convert ${amount} ${ingredient || ""} from ${fromUnit} to ${toUnit}`.trim();

      const res = await fetch("/api/wolfram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();

      setResult(data.resultText);
    } catch {
      setError("Sorry, I couldn’t convert that.");
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------------
     3. COPY RESULT
  ---------------------------------------------------- */
  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
  }

  /* ----------------------------------------------------
     4. UI — Cottagecore Style
  ---------------------------------------------------- */
  return (
    <div className="calculator-page max-w-3xl mx-auto px-4 pb-16">

      {/* ⭐ BANNER */}
      <div className="w-full mb-6">
        <img
          src={calculatorBanner}
          alt="Calculator Banner"
          className="w-full rounded-lg shadow-md"
        />
      </div>

      <div className="bg-[#fffdf7]/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-[#e4d5b8]">

        <h1 className="text-3xl font-bold mb-6 text-center text-[#4b3b2f]">
          Kitchen Conversion Calculator
        </h1>

        {/* ⭐ INGREDIENT LIST FROM RECIPE DETAILS */}
        {ingredientList.length > 0 && (
          <div className="mb-6 p-4 bg-white/80 rounded-xl shadow border border-[#d6c6a9]">
            <p className="font-semibold mb-2 text-[#4b3b2f]">
              Choose an ingredient to convert:
            </p>

            <div className="space-y-2">
              {ingredientList.map((ing, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // Attempt to split "amount + unit"
                    const parts = ing.amount.split(" ");
                    const amt = parts.shift() || "";
                    const unit = parts.join(" ");

                    setAmount(amt);
                    setFromUnit(unit);
                    setIngredient(ing.name);
                  }}
                  className="w-full text-left px-4 py-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg shadow transition font-medium text-[#3c4b39]"
                >
                  <span className="capitalize">{ing.name}</span> — {ing.amount}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold text-[#4b3b2f]">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1 1/2"
            className="w-full p-3 border rounded-xl bg-white shadow-sm"
          />
        </div>

        {/* From Unit */}
        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold text-[#4b3b2f]">From Unit</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-3 border rounded-xl bg-white shadow-sm"
          >
            <option value="cups">Cups</option>
            <option value="tbsp">Tablespoons</option>
            <option value="tsp">Teaspoons</option>
            <option value="ml">Milliliters</option>
            <option value="l">Liters</option>
            <option value="oz">Ounces</option>
            <option value="g">Grams</option>
            <option value="kg">Kilograms</option>
            <option value="fl oz">Fluid Ounces</option>
            <option value="lb">Pounds</option>
            <option value="C">Celsius</option>
            <option value="F">Fahrenheit</option>
          </select>
        </div>

        {/* To Unit */}
        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold text-[#4b3b2f]">To Unit</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-3 border rounded-xl bg-white shadow-sm"
          >
            <option value="grams">Grams</option>
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms</option>
            <option value="oz">Ounces</option>
            <option value="cups">Cups</option>
            <option value="tbsp">Tablespoons</option>
            <option value="tsp">Teaspoons</option>
            <option value="ml">Milliliters</option>
            <option value="l">Liters</option>
            <option value="fl oz">Fluid Ounces</option>
            <option value="lb">Pounds</option>
            <option value="C">Celsius</option>
            <option value="F">Fahrenheit</option>
          </select>
        </div>

        {/* Ingredient */}
        <div className="mb-4 text-left">
          <label className="block mb-1 font-semibold text-[#4b3b2f]">
            Ingredient (optional — required for cups→grams)
          </label>
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="e.g. flour, sugar, butter…"
            className="w-full p-3 border rounded-xl bg-white shadow-sm"
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={smartConvert}
          disabled={loading}
          className="w-full bg-emerald-700 text-white py-3 rounded-xl shadow-md hover:bg-emerald-800 transition disabled:opacity-50"
        >
          {loading ? "Converting…" : "Convert"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 bg-white/80 rounded-xl shadow flex justify-between items-center border">
            <p className="font-semibold text-lg text-[#4b3b2f]">{result}</p>

            <button
              onClick={copyResult}
              className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded-lg shadow text-[#4b3b2f]"
            >
              Copy
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
