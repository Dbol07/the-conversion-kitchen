import React, { useState } from "react";
import { convert } from "../utils/conversions";
import FloralDivider from "../components/FloralDivider";
import DecorativeFrame from "../components/DecorativeFrame";
import BgCalculator from "../assets/backgrounds/bg-calculator.jpg";

export default function Calculator() {
  const [category, setCategory] = useState("volume");
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cup");
  const [toUnit, setToUnit] = useState("ml");
  const [result, setResult] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Recipe scaler state
  const [originalServings, setOriginalServings] = useState("");
  const [newServings, setNewServings] = useState("");
  const [scaledAmount, setScaledAmount] = useState("");

  const units = {
    volume: ["tsp", "tbsp", "fl oz", "cup", "pint", "quart", "gallon", "ml", "liter"],
    weight: ["oz", "lb", "g", "kg"],
    temperature: ["F", "C", "K"],
  };

  const handleConvert = (val: string) => {
    setValue(val);
    if (val && !isNaN(Number(val))) {
      const converted = convert(Number(val), fromUnit, toUnit, category);
      setResult(converted.toFixed(2));
    } else {
      setResult("");
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (value) {
      const converted = convert(Number(value), toUnit, temp, category);
      setResult(converted.toFixed(2));
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // Recipe scaler logic
  const scaleRecipe = () => {
    if (!originalServings || !newServings) return;

    const ratio = Number(newServings) / Number(originalServings);

    if (value) {
      setScaledAmount((Number(value) * ratio).toFixed(2));
    }
  };

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgCalculator})` }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Unit Converter</h1>
            <p className="text-white/90 mt-2">Quick & easy kitchen conversions</p>
          </div>

          <FloralDivider variant="vine" />

          {/* UNIT CONVERSION FRAME */}
          <DecorativeFrame className="mt-6">
            <div className="parchment-card p-6">
              <label className="block mb-4">
                <span className="text-[#1b302c] font-semibold">Category</span>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setResult("");
                  }}
                  className="w-full mt-2 p-3 border-2 border-[#b8d3d5] rounded-xl bg-[#faf6f0] focus:border-[#3c6150] transition-all"
                >
                  <option value="volume">Volume</option>
                  <option value="weight">Weight</option>
                  <option value="temperature">Temperature</option>
                </select>
              </label>

              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-4 items-end">
                <label>
                  <span className="text-[#1b302c] font-semibold">From</span>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full mt-2 p-3 border-2 border-[#b8d3d5] rounded-xl bg-[#faf6f0]"
                  >
                    {units[category as keyof typeof units].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  onClick={swapUnits}
                  className="bg-[#a77a72] text-white p-3 rounded-xl hover:bg-[#5f3c43] transition-all hover:scale-110 shadow-md"
                  title="Swap units"
                >
                  ⇄
                </button>

                <label>
                  <span className="text-[#1b302c] font-semibold">To</span>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full mt-2 p-3 border-2 border-[#b8d3d5] rounded-xl bg-[#faf6f0]"
                  >
                    {units[category as keyof typeof units].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <input
                type="number"
                value={value}
                onChange={(e) => handleConvert(e.target.value)}
                placeholder="Enter value..."
                className="w-full p-4 border-2 border-[#b8d3d5] rounded-xl mb-4 text-lg bg-[#faf6f0]"
              />

              {result && (
                <div className="bg-gradient-to-r from-[#b8d3d5] to-[#a77a72]/50 p-4 rounded-xl flex justify-between items-center shadow-inner">
                  <span className="text-2xl font-bold text-[#1b302c]">
                    {result} {toUnit}
                  </span>
                  <button
                    onClick={copyResult}
                    className="cottagecore-btn bg-[#3c6150] text-white hover:bg-[#5f3c43]"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </DecorativeFrame>

          {/* RECIPE SCALER FRAME */}
          <DecorativeFrame className="mt-10">
            <div className="parchment-card p-6">
              <h2 className="text-2xl font-bold text-[#1b302c] mb-4 text-center">
                Recipe Scaler
              </h2>

              <label className="block mb-4">
                <span className="text-[#1b302c] font-semibold">Original servings</span>
                <input
                  type="number"
                  value={originalServings}
                  onChange={(e) => setOriginalServings(e.target.value)}
                  className="w-full p-3 border-2 border-[#b8d3d5] rounded-xl bg-[#faf6f0]"
                />
              </label>

              <label className="block mb-4">
                <span className="text-[#1b302c] font-semibold">New servings</span>
                <input
                  type="number"
                  value={newServings}
                  onChange={(e) => setNewServings(e.target.value)}
                  className="w-full p-3 border-2 border-[#b8d3d5] rounded-xl bg-[#faf6f0]"
                />
              </label>

              <button
                onClick={scaleRecipe}
                className="w-full mt-2 py-3 bg-[#3c6150] text-white rounded-xl hover:bg-[#5f3c43] transition"
              >
                Scale Recipe
              </button>

              {scaledAmount && (
                <div className="mt-4 bg-[#b8d3d5]/50 p-4 rounded-xl text-center">
                  <span className="text-xl text-[#1b302c] font-bold">
                    Scaled amount: {scaledAmount}
                  </span>
                </div>
              )}
            </div>
          </DecorativeFrame>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 bg-[#3c6150] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          ✓ Copied!
        </div>
      )}
    </div>
  );
}
