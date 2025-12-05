import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { convertLocally } from "@/lib/unitConversion";

// Auto-import all template JSON files
const templates = import.meta.glob("/src/templates/*.json", {
  eager: true,
  import: "default",
}) as Record<string, any>;

export default function CalculatorPage() {
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("cups");
  const [toUnit, setToUnit] = useState("grams");
  const [ingredient, setIngredient] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------------------
     1. TEMPLATE AUTO-LOADING
  ---------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateName = params.get("template");
    if (!templateName) return;

    // Find template file by name
    const match = Object.entries(templates).find(([path]) =>
      path.toLowerCase().includes(templateName.toLowerCase())
    );

    if (!match) return;

    const template = match[1];

    // Pre-fill calculator fields using the template data
    if (template.amount) setAmount(String(template.amount));
    if (template.fromUnit) setFromUnit(template.fromUnit);
    if (template.toUnit) setToUnit(template.toUnit);
    if (template.ingredient) setIngredient(template.ingredient);

    setResult(null);
    setError(null);
  }, [location.search]);

  /* ----------------------------------------------------
     2. SMART HYBRID CONVERSION (local → Wolfram)
  ---------------------------------------------------- */
  async function smartConvert() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Local conversion only if no ingredient
      if (!ingredient) {
        const local = convertLocally(amount, fromUnit, toUnit);
        if (local.ok) {
          const rounded = Math.round(local.value * 100) / 100;
          setResult(`${rounded} ${toUnit}`);
          setLoading(false);
          return;
        }
      }

      // Otherwise → Wolfram
      const queryParts = [
        amount,
        ingredient ? ingredient.trim() : "",
        fromUnit,
        "to",
        toUnit,
      ].filter(Boolean);

      const query = queryParts.join(" ");

      const response = await fetch("/api/wolfram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      setResult(data.resultText);

    } catch (err) {
      setError("Sorry, I couldn’t convert that.");
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------------
     3. UI
  ---------------------------------------------------- */
  return (
    <div className="calculator-page-container p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Kitchen Conversion Calculator</h1>

      {/* AMOUNT */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 1 1/2"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* FROM UNIT */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">From Unit</label>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-full p-2 border rounded"
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

      {/* TO UNIT */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">To Unit</label>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full p-2 border rounded"
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

      {/* INGREDIENT */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Ingredient (Optional — required for cups→grams)
        </label>
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="e.g. flour, sugar, butter…"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={smartConvert}
        disabled={loading}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition disabled:opacity-50"
      >
        {loading ? "Converting…" : "Convert"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-4 p-3 bg-white/70 rounded shadow border">
          <p className="font-semibold text-lg">{result}</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
