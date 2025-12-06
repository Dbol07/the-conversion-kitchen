import PageDivider from "@/components/PageDivider";
import { getDividerForPage } from "@/lib/dividers";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import calculatorBanner from "@/assets/banners/calculator-banner.png";
import { loadTemplateFile } from "@/lib/templateLoader";

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
    loadTemplateFile(templateName).then((template) => {
      if (template?.calculator) {
        setAmount(template.calculator.amount || "");
        setFromUnit(template.calculator.fromUnit || "");
        setToUnit(template.calculator.toUnit || "");
        setIngredient(template.calculator.ingredient || "");
      }
    });
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

    // Flour example conversion
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

  const dividerImage = getDividerForPage("calculator");

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-32">

      {/* ⭐ Banner with overlay text */}
      <div className="relative w-full max-w-4xl mx-auto mt-6">
        <img
          src={calculatorBanner}
          alt="Calculator Banner"
          className="w-full rounded-xl shadow-xl"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#4b3b2f] drop-shadow-lg">
          Kitchen Conversion Calculator
        </h1>
      </div>

      {/* Divider */}
      <div className="flex justify-center mt-6">
        <PageDivider src={dividerImage} size="md" />
      </div>

      {/* ⭐ Calculator Card */}
      <div className="max-w-2xl mx-auto bg-white/90 border border-[#e4d5b8] rounded-2xl shadow-xl p-6 mt-8">

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
          <option value="cups">Cups</option>
          <option value="tablespoons">Tablespoons</option>
          <option value="teaspoons">Teaspoons</option>
          <option value="grams">Grams</option>
          <option value="oz">Ounces</option>
          <option value="ml">Milliliters</option>
          <option value="liters">Liters</option>
        </select>

        {/* TO UNIT */}
        <label className="block font-medium mb-1">To Unit</label>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
        >
          <option value="">Select unit…</option>
          <option value="grams">Grams</option>
          <option value="cups">Cups</option>
          <option value="oz">Ounces</option>
          <option value="tablespoons">Tablespoons</option>
          <option value="teaspoons">Teaspoons</option>
          <option value="ml">Milliliters</option>
          <option value="liters">Liters</option>
        </select>

        {/* INGREDIENT → DROPDOWN */}
        <label className="block font-medium mb-1">
          Ingredient (required for some conversions)
        </label>
        <select
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
        >
          <option value="">Select ingredient…</option>
          <option value="flour">Flour</option>
          <option value="sugar">Sugar</option>
          <option value="butter">Butter</option>
          <option value="honey">Honey</option>
          <option value="oats">Oats</option>
          <option value="rice">Rice</option>
        </select>

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
