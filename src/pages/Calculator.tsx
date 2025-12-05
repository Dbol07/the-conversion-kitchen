import PageDivider from "@/components/PageDivider";
import getDividerForPage from "@/lib/dividers";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { convertLocally } from "@/lib/unitConversion";
import calculatorBanner from "@/assets/banners/calculator-banner.png";

// Auto-import recipe templates
const templates = import.meta.glob("/src/assets/templates/*-template.json", {
  eager: true,
  import: "default",
}) as Record<string, any>;

// Full unit list
const UNIT_OPTIONS = [
  "cups", "tbsp", "tsp",
  "ml", "l",
  "g", "kg",
  "oz", "lb",
  "fl oz",
  "C", "F",
];

/* ---------------------------------------------------------
   TYPE — Bulk Ingredient Row
--------------------------------------------------------- */
type IngredientRow = {
  ingredient: string;
  amount: string;
  unit: string;
  result?: string;
};

export default function CalculatorPage() {
  const location = useLocation();

  /* ---------------------------------------------------------
     CORE CALCULATOR STATE
  --------------------------------------------------------- */
  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("cups");
  const [toUnit, setToUnit] = useState("grams");
  const [ingredient, setIngredient] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------------------
     BULK INGREDIENT MODE
  --------------------------------------------------------- */
  const [rows, setRows] = useState<IngredientRow[]>([]);
  const bulkMode = rows.length > 0;

  /* ---------------------------------------------------------
     1. Detect bulk ingredient mode (?ingredients=)
  --------------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("ingredients");

    if (!raw) return;

    // Example format: "flour:2 cups;sugar:1/2 cup"
    const parsed = raw.split(";").map((pair) => {
      const [name, fullAmount = ""] = pair.split(":");
      const parts = fullAmount.trim().split(" ");

      let amount = parts[0] ?? "";
      let unit = parts[1] ?? "g"; // default safe

      return {
        ingredient: name?.trim() || "",
        amount,
        unit,
        result: "",
      };
    });

    if (parsed.length > 0) {
      setRows(parsed);
    }
  }, [location.search]);

  /* ---------------------------------------------------------
     2. Template auto-load (from TemplatePreview)
  --------------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get("template");
    if (!name) return;

    const match = Object.entries(templates).find(([path]) =>
      path.toLowerCase().includes(`${name}-template.json`)
    );

    if (!match) return;
    const template = match[1];

    if (template.amount) setAmount(String(template.amount));
    if (template.fromUnit) setFromUnit(template.fromUnit);
    if (template.toUnit) setToUnit(template.toUnit);
    if (template.ingredient) setIngredient(template.ingredient);

    setResult(null);
    setError(null);
  }, [location.search]);

  /* ---------------------------------------------------------
     3. Local → Wolfram smart conversion
  --------------------------------------------------------- */
  async function smartConvertSingle(amount: string, from: string, to: string, ing: string) {
    // Try local (only when ingredient empty)
    if (!ing) {
      const local = convertLocally(amount, from, to);
      if (local.ok) {
        const rounded = Math.round(local.value * 100) / 100;
        return `${rounded} ${to}`;
      }
    }

    // Wolfram fallback
    const query = `convert ${amount} ${ing || ""} from ${from} to ${to}`.trim();

    const response = await fetch("/api/wolfram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    if (!data.ok || !response.ok) {
      throw new Error(data.error || "Conversion failed");
    }
    return data.resultText;
  }

  /* ---------------------------------------------------------
     4. Single conversion button
  --------------------------------------------------------- */
  async function smartConvert() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const output = await smartConvertSingle(amount, fromUnit, toUnit, ingredient);
      setResult(output);

    } catch (err) {
      setError("Sorry, I couldn’t convert that.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------------
     5. BULK conversion (Convert All Ingredients)
  --------------------------------------------------------- */
  async function convertAllRows() {
    setLoading(true);
    try {
      const newRows = await Promise.all(
        rows.map(async (row) => {
          try {
            const out = await smartConvertSingle(row.amount, row.unit, "g", row.ingredient);
            return { ...row, result: out };
          } catch {
            return { ...row, result: "Conversion failed" };
          }
        })
      );
      setRows(newRows);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------------
     6. Copy all results
  --------------------------------------------------------- */
  function copyAll() {
    const text = rows.map((r) => `${r.ingredient}: ${r.result}`).join("\n");
    navigator.clipboard.writeText(text);
  }

  /* ---------------------------------------------------------
     7. UI — Cottagecore layout
  --------------------------------------------------------- */
  return (
    <div className="calculator-page max-w-3xl mx-auto px-4 pb-16">

      {/* Banner */}
      <div className="w-full mb-6">
        <img
          src={calculatorBanner}
          alt="Calculator Banner"
          className="w-full rounded-lg shadow-md"
        />
      </div>

{/* PAGE DIVIDER */}
<div className="flex justify-center my-6">
  <PageDivider src={getDividerForPage("calculator")} />
</div>

      <div className="bg-[#fffdf7]/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-[#e4d5b8]">

        {/* ---------------------------------------------------------
           BULK INGREDIENT MODE
        --------------------------------------------------------- */}
        {bulkMode && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center text-[#4b3b2f]">
              Convert Recipe Ingredients
            </h1>

            {rows.map((row, i) => (
              <div key={i} className="mb-4 p-4 bg-white rounded-xl shadow border">
                <div className="grid grid-cols-3 gap-3">

                  {/* Ingredient */}
                  <input
                    type="text"
                    value={row.ingredient}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].ingredient = e.target.value;
                      setRows(copy);
                    }}
                    className="p-2 border rounded"
                  />

                  {/* Amount */}
                  <input
                    type="text"
                    value={row.amount}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].amount = e.target.value;
                      setRows(copy);
                    }}
                    className="p-2 border rounded"
                  />

                  {/* Unit */}
                  <select
                    value={row.unit}
                    onChange={(e) => {
                      const copy = [...rows];
                      copy[i].unit = e.target.value;
                      setRows(copy);
                    }}
                    className="p-2 border rounded"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {row.result && (
                  <p className="mt-2 font-semibold text-[#4b3b2f]">
                    → {row.result}
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={convertAllRows}
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3 rounded-xl shadow hover:bg-emerald-800 transition"
            >
              {loading ? "Converting…" : "Convert All Ingredients"}
            </button>

            {rows.some((r) => r.result) && (
              <button
                onClick={copyAll}
                className="w-full mt-3 bg-amber-200 hover:bg-amber-300 text-[#4b3b2f] py-3 rounded-xl shadow"
              >
                Copy All Results
              </button>
            )}

            <div className="h-6" />
          </>
        )}

        {/* ---------------------------------------------------------
           SINGLE CONVERSION MODE
        --------------------------------------------------------- */}
        {!bulkMode && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-[#4b3b2f]">
              Kitchen Conversion Calculator
            </h1>

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

            {/* From */}
            <div className="mb-4 text-left">
              <label className="block mb-1 font-semibold text-[#4b3b2f]">
                From Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white shadow-sm"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="mb-4 text-left">
              <label className="block mb-1 font-semibold text-[#4b3b2f]">
                To Unit
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white shadow-sm"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
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
                className="w-full p-3 border rounded-xl bg-white shadow-sm"
              />
            </div>

            {/* Convert */}
            <button
              onClick={smartConvert}
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3 rounded-xl shadow hover:bg-emerald-800 transition disabled:opacity-50"
            >
              {loading ? "Converting…" : "Convert"}
            </button>

            {/* Result */}
            {result && (
              <div className="mt-6 p-4 bg-white/80 rounded-xl shadow flex justify-between items-center border">
                <p className="font-semibold text-lg text-[#4b3b2f]">{result}</p>

                <button
                  onClick={() => navigator.clipboard.writeText(result)}
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
          </>
        )}
      </div>
    </div>
  );
}
