import PageDivider from "@/components/PageDivider";
import { getDividerForPage } from "@/lib/dividers";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import calculatorBanner from "@/assets/banners/calculator-banner.png";

export default function Calculator() {
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  /* ----------------------------------------
     1. TEMPLATE PREFILL SYSTEM
  ---------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateName = params.get("template");
    const shouldPrefill = params.get("prefill") === "true";

    if (templateName && shouldPrefill) {
      import(`../templates/${templateName}-template.json`)
        .then((template) => {
          if (template.calculator) {
            setAmount(template.calculator.amount || "");
            setFromUnit(template.calculator.fromUnit || "");
            setToUnit(template.calculator.toUnit || "");
            setIngredient(template.calculator.ingredient || "");
          }
        })
        .catch((err) => console.error("Template load error:", err));
    }
  }, [location.search]);

  /* ----------------------------------------
     2. STANDARD CONVERSION LOGIC
  ---------------------------------------- */
  function convert() {
    setError("");
    setResult(null);

    if (!amount || !fromUnit || !toUnit) {
      setError("Please fill out all required fields.");
      return;
    }

    let convertedValue = null;

    // Flour conversion example
    if (ingredient.toLowerCase() === "flour") {
      if (fromUnit === "cups" && toUnit === "grams") {
        convertedValue = parseFloat(amount) * 120;
      }
    }

    if (convertedValue === null) {
      setError("Sorry, I couldn’t convert that.");
    } else {
      setResult(`${convertedValue} ${toUnit}`);
    }
  }

  /* ----------------------------------------
     3. DIVIDER (NOW STABLE, NOT CHANGING ON TYPE)
  ---------------------------------------- */
  const dividerImage = getDividerForPage("calculator");

  /* ----------------------------------------
     4. UI
  ---------------------------------------- */
  return (
    <div className="min-h-screen bg-[#faf6f0] pb-32">
      {/* Title moved ABOVE banner */}
      <h1 className="text-4xl font-bold text-center pt-10 mb-4 text-[#4b3b2f]">
        Kitchen Conversion Calculator
      </h1>

      {/* Decorative banner */}
      <div className="flex justify-center mb-6">
        <img
          src={calculatorBanner}
          alt="Calculator Banner"
          className="w-full max-w-4xl rounded-xl shadow"
        />
      </div>

      {/* Divider (stable) */}
      <PageDivider src={dividerImage} size="md" />

      <div className="max-w-2xl mx-auto bg-white/90 border border-[#e4d5b8] rounded-2xl shadow-xl p-6 mt-6">
        {/* AMOUNT */}
        <label className="block font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
        />

        {/* FROM UNIT */}
        <label className="block font-medium mb-1">From Unit</label>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
        >
          <option value="">Select unit…</option>
          <option value="cups">cups</option>
          <option value="grams">grams</option>
          <option value="oz">oz</option>
        </select>

        {/* TO UNIT */}
        <label className="block font-medium mb-1">To Unit</label>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
        >
          <option value="">Select unit…</option>
          <option value="grams">grams</option>
          <option value="cups">cups</option>
          <option value="oz">oz</option>
        </select>

        {/* INGREDIENT */}
        <label className="block font-medium mb-1">
          Ingredient (required for some conversions)
        </label>
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
        />

        {/* BUTTON */}
        <button
          onClick={convert}
          className="w-full py-3 bg-[#2f6e4f] text-white rounded-xl shadow hover:bg-[#26593f] transition"
        >
          Convert
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-center font-semibold text-[#1b302c]">
            {result}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-center text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
