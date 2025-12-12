import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import FloralDivider from "@/components/FloralDivider";
import Tooltip from "@/components/Tooltip";
import BackToTop from "@/components/BackToTop";

import { mealdbLookup } from "@/utils/mealdb";
import { trackedSpoonFetch } from "@/utils/spoonacularUsage";

import bgRecipes from "@/assets/backgrounds/bg-recipes.png";
import legendBanner from "@/assets/banners/legend-banner.png";

/* -------------------------------------------------------
   HELPER FUNCTIONS
-------------------------------------------------------- */

// Convert °C ↔ °F
function convertTemp(value: number, to: "F" | "C") {
  return to === "F"
    ? Math.round((value * 9) / 5 + 32)
    : Math.round(((value - 32) * 5) / 9);
}

// Convert cm ↔ in (cm → in only for this use)
function cmToIn(cm: number) {
  return +(cm / 2.54).toFixed(2);
}

// Convert mm → in
function mmToIn(mm: number) {
  return +(mm / 25.4).toFixed(2);
}

// -----------------------------
// Gas mark helper (rough home-baking mapping)
// -----------------------------
const cToGasMark = (c: number): string => {
  if (c < 135) return "¼–½";
  if (c < 145) return "1";
  if (c < 155) return "2";
  if (c < 165) return "3";
  if (c < 175) return "4";
  if (c < 185) return "5";
  if (c < 195) return "6";
  if (c < 210) return "7";
  if (c < 225) return "8";
  return "9";
};

/* -------------------------------------------------------
   TOOLTIP INJECTION FOR INSTRUCTIONS
-------------------------------------------------------- */

function enhanceInstructions(raw: string) {
  if (!raw) return [];

  // Split into lines and clean up empty items
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const steps: JSX.Element[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    let step = lines[idx];

    // -----------------------------------------
    // 0) Strip any existing numbering ("1.", "Step 1", "3. step 2", etc.)
    // -----------------------------------------
    step = step.replace(
      /^(?:\d+\.\s*|\d+\)\s*|step\s*\d+[:.)-]?\s*)/i,
      ""
    ).trim();

    // -----------------------------------------
    // 1) Highlight ml/fl oz and g/oz combos first
    //    (so they don't get mistaken for temps)
    // -----------------------------------------
    step = step.replace(
      /(\d+)\s*ml\s*\/\s*(\d+)\s*(fl\s?oz)/gi,
      (_match, ml, flozVal, flozUnit) =>
        `__MLFL_PILL__${ml}/${flozVal}${flozUnit.replace(/\s+/g, "")}`
    );

    step = step.replace(
      /(\d+)\s*g\s*\/\s*(\d+)\s*oz/gi,
      (_match, g, oz) => `__GOZ_PILL__${g}/${oz}`
    );

    // -----------------------------------------
    // 2) Fan/Gas Mark phrases
    //    e.g. "fan/Gas Mark 4"
    // -----------------------------------------
    step = step.replace(
      /fan\s*\/?\s*gas\s*mark\s*(\d+)/gi,
      (_m, n) => `__FAN_GAS__${n}`
    );

    // -----------------------------------------
    // 3) Pan / tin sizes in cm & mm
    //    20cm, 2cm, 8mm, etc.
    // -----------------------------------------
    step = step.replace(
      /(\d+)\s?cm/gi,
      (_m, cmVal) => {
        const cmNum = parseInt(cmVal, 10);
        if (Number.isNaN(cmNum)) return _m;
        const inchesRounded = Math.max(1, Math.round(cmNum / 2.54)); // nearest whole inch, min 1
        return `__CM_PILL__${cmNum}/${inchesRounded}`;
      }
    );

    step = step.replace(
      /(\d+)\s?mm/gi,
      (_m, mmVal) => {
        const mmNum = parseInt(mmVal, 10);
        if (Number.isNaN(mmNum)) return _m;
        const inchesRounded = Math.max(
          1,
          Math.round(mmNum / 25.4)
        );
        return `__MM_PILL__${mmNum}/${inchesRounded}`;
      }
    );

    // -----------------------------------------
    // 4) Temperature detection
    //    Patterns like: 180, 180C, 180°C, 350F, 350°F
    //    + ignore times like "60 minutes"
    // -----------------------------------------
    step = step.replace(
      /(\d{2,3})(?:\s*°?\s*(C|F))?(?!\s*(minutes?|mins?|min|hours?|hrs?|hr|h)\b)/gi,
      (match, numStr, unit) => {
        const num = parseInt(numStr, 10);
        if (Number.isNaN(num) || num < 70 || num > 300) return match;

        let originalUnit: "C" | "F" = "C";
        if (unit) {
          originalUnit = unit.toUpperCase() as "C" | "F";
        }
        if (!unit) {
          originalUnit = "C"; // your rule: assume °C
        }

        const celsius =
          originalUnit === "C" ? num : convertTemp(num, "C");
        const fahrenheit =
          originalUnit === "F" ? num : convertTemp(num, "F");

        return `__TEMP_PILL__${celsius}/${fahrenheit}`;
      }
    );

    // -----------------------------------------
    // 5) Split into parts & build JSX with pills
    //    We handle TEMP+FAN as one pill by looking ahead
    // -----------------------------------------
    const parts = step.split(
      /(__TEMP_PILL__\d+\/\d+|__CM_PILL__\d+\/\d+|__MM_PILL__\d+\/\d+|__MLFL_PILL__\d+\/[0-9.]+floz|__GOZ_PILL__\d+\/[0-9.]+|__FAN_GAS__\d+)/
    );

    const jsxParts: (string | JSX.Element)[] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!part) continue;

      // TEMP pill (may be followed by FAN_GAS)
      if (part.startsWith("__TEMP_PILL__")) {
        const [cStr, fStr] = part
          .replace("__TEMP_PILL__", "")
          .split("/");
        const cNum = Number(cStr);
        const fNum = Number(fStr);
        const gas = cToGasMark(cNum);

        // Check if the next part is a FAN_GAS placeholder
        let fanText = "";
        if (i + 1 < parts.length && parts[i + 1].startsWith("__FAN_GAS__")) {
          const fanMark = parts[i + 1].replace("__FAN_GAS__", "");
          fanText = ` • Fan Gas Mark ${fanMark}`;
          i++; // consume the fan part so it doesn't render separately
        }

        jsxParts.push(
        <Tooltip
  key={`temp-${idx}-${i}`}
  label={`🌿 Gas Mark ${gas}\nA gentle UK baking scale — higher marks mean warmer ovens.`}
>
  <span style={{ color: "#271A36" }}>
    {cNum}°C • {fNum}°F • Gas Mark {gas}
    {fanText}
    {" "}
    <span
      style={{
        verticalAlign: "super",
        fontSize: "0.65em",
        opacity: 0.9,
      }}
    >
      ✨
    </span>
  </span>
</Tooltip>

        );
        continue;
      }

      // CM (pan size) pill
      if (part.startsWith("__CM_PILL__")) {
        const [cmStr, inchRoundedStr] = part
          .replace("__CM_PILL__", "")
          .split("/");
        const cmVal = Number(cmStr);
        const inchRounded = Number(inchRoundedStr);

        jsxParts.push(
          <Tooltip
            key={`cm-${idx}-${i}`}
            label={`${cmVal} cm ≈ ${inchRounded} in`}
          >
            <span style={{ color: "#172A3D" }}>
              {cmVal}cm • {inchRounded}in{" "}
              <span
                style={{
                  verticalAlign: "super",
                  fontSize: "0.65em",
                  opacity: 0.9,
                }}
              >
                ✨
              </span>
            </span>
          </Tooltip>
        );
        continue;
      }

      // MM pill
      if (part.startsWith("__MM_PILL__")) {
        const [mmStr, inchRoundedStr] = part
          .replace("__MM_PILL__", "")
          .split("/");
        const mmVal = Number(mmStr);
        const inchRounded = Number(inchRoundedStr);

        jsxParts.push(
          <Tooltip
            key={`mm-${idx}-${i}`}
            label={`${mmVal} mm ≈ ${inchRounded} in`}
          >
            <span style={{ color: "#172A3D" }}>
              {mmVal}mm • {inchRounded}in{" "}
              <span
                style={{
                  verticalAlign: "super",
                  fontSize: "0.65em",
                  opacity: 0.9,
                }}
              >
                ✨
              </span>
            </span>
          </Tooltip>
        );
        continue;
      }

      // ML / FL OZ pill (pre-written pair, like 325ml/11fl oz)
      if (part.startsWith("__MLFL_PILL__")) {
        const [mlStr, flozStr] = part
          .replace("__MLFL_PILL__", "")
          .split("/");
        const mlVal = Number(mlStr);
        const flozVal = Number(flozStr.replace("floz", ""));
        const flozRounded = Number(flozVal.toFixed(1));

        jsxParts.push(
          <Tooltip
            key={`mlfl-${idx}-${i}`}
            label={`${mlVal} ml ≈ ${flozRounded} fl oz`}
          >
            <span style={{ color: "#172A3D" }}>
              {mlVal}ml • {flozRounded}fl oz{" "}
              <span
                style={{
                  verticalAlign: "super",
                  fontSize: "0.65em",
                  opacity: 0.9,
                }}
              >
                ✨
              </span>
            </span>
          </Tooltip>
        );
        continue;
      }

      // G / OZ pill (pre-written pair, like 9g/9oz)
      if (part.startsWith("__GOZ_PILL__")) {
        const [gStr, ozStr] = part
          .replace("__GOZ_PILL__", "")
          .split("/");
        const gVal = Number(gStr);
        const ozVal = Number(ozStr);
        const ozRounded = Number(ozVal.toFixed(1));

        jsxParts.push(
          <Tooltip
            key={`goz-${idx}-${i}`}
            label={`${gVal} g ≈ ${ozRounded} oz`}
          >
            <span style={{ color: "#172A3D" }}>
              {gVal}g • {ozRounded}oz{" "}
              <span
                style={{
                  verticalAlign: "super",
                  fontSize: "0.65em",
                  opacity: 0.9,
                }}
              >
                ✨
              </span>
            </span>
          </Tooltip>
        );
        continue;
      }

      // FAN_GAS that didn't get merged with a temp (rare fallback)
      if (part.startsWith("__FAN_GAS__")) {
        const fanMark = part.replace("__FAN_GAS__", "");
        jsxParts.push(
          <span key={`fan-${idx}-${i}`} style={{ color: "#271A36" }}>
            Fan Gas Mark {fanMark}
          </span>
        );
        continue;
      }

      // Plain text
      jsxParts.push(part);
    }

    steps.push(
      <p key={idx}>
        {idx + 1}. {jsxParts}
      </p>
    );
  }

  return steps;
}
/* -------------------------------------------------------
   COMPONENT
-------------------------------------------------------- */

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source") || "mealdb";

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [legendOpen, setLegendOpen] = useState(false);
const [copiedToast, setCopiedToast] = useState(false);

  /* --------------------------------------------------
     LOAD RECIPE
  --------------------------------------------------- */
  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        setLoading(true);

        if (source === "mealdb") {
          const data = await mealdbLookup(id);
          if (!data) throw new Error("Recipe not found");

          setRecipe({
            id: data.id,
            title: data.title,
            image: data.image,
            instructions: data.instructions,
            ingredients: data.ingredients.map((i) => ({
              ingredient: i.ingredient,
              measure: i.measure,
            })),
            description:
              data.tags?.length
                ? `A cozy dish featuring: ${data.tags.join(", ")}`
                : "",
            cuisine: data.area,
            category: data.category,
          });

          return;
        }

        if (source === "spoonacular") {
          const url = `https://api.spoonacular.com/recipes/${id}/information`;
          const response = await trackedSpoonFetch(url);

          if (!response.ok) throw new Error("Spoonacular recipe not found");

          const data = await response.json();

          setRecipe({
            id: data.id,
            title: data.title,
            image: data.image,
            instructions: data.instructions
              ?.replace(/<[^>]+>/g, "")
              .trim(),
            description:
              (data.summary
                ?.replace(/<[^>]+>/g, "")
                .slice(0, 250) || "") + "...",
            ingredients: data.extendedIngredients.map((i: any) => ({
              ingredient: i.name,
              measure: `${i.amount} ${i.unit}`,
            })),
            cuisine: data.cuisines?.[0],
            category: data.dishTypes?.[0],
          });

          return;
        }
      } catch (err: any) {
        console.error(err);
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, source]);

  /* --------------------------------------------------
     COPY INGREDIENTS
  --------------------------------------------------- */
async function handleCopyIngredients() {
  if (!recipe) return;

  const text = recipe.ingredients
    .map((i) => `${i.measure} ${i.ingredient}`)
    .join("\n");

  await navigator.clipboard.writeText(text);

  // show cute toast above the button
  setCopiedToast(true);
  setTimeout(() => setCopiedToast(false), 1500);
}
  /* --------------------------------------------------
     SCALE TOOL
  --------------------------------------------------- */
  function goToScaleTool() {
    if (!recipe) return;

    const list = recipe.ingredients
      .map((i) => `${i.measure} ${i.ingredient}`)
      .join("\n");

    navigate(`/calculator?tab=scale&paste=${encodeURIComponent(list)}`);
  }

  /* --------------------------------------------------
     INGREDIENT CONVERTER
  --------------------------------------------------- */
  function goToConverter() {
    navigate(`/calculator?tab=ingredient`);
  }

  /* --------------------------------------------------
     RENDER
  --------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-[#4b3b2f]">Loading...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-[#4b3b2f]">Recipe not found.</p>
        <button
          onClick={() => navigate("/recipes")}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl shadow"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-32 pt-8"
      style={{
        backgroundImage: `url(${bgRecipes})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* BACK BUTTON (storybook arrow) */}
      <button
        onClick={() => navigate("/recipes")}
        className="absolute left-4 top-6 w-10 h-10 rounded-full bg-white/80 shadow border border-[#e4d5b8] flex items-center justify-center text-[#4b3b2f] text-2xl"
      >
        🡠
      </button>

      {/* Title Box */}
      <div className="mx-auto mt-4 max-w-3xl px-4">
        <div className="bg-white/80 border border-[#e4d5b8] rounded-2xl shadow p-6 text-center">
          <h1 className="text-3xl font-bold text-[#4b3b2f]">
            {recipe.title}
          </h1>
          <p className="text-[#5f3c43] italic mt-1">
            {recipe.cuisine}{" "}
            {recipe.category ? `· ${recipe.category}` : ""}
          </p>
        </div>
      </div>

      <FloralDivider variant="vine" size="sm" />

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#e4d5b8] bg-white/70">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

{/* INGREDIENTS CARD */}
<div className="bg-white/90 border border-[#e4d5b8] rounded-2xl shadow-lg p-6 relative overflow-hidden">
  <h2 className="text-xl font-semibold text-center text-[#4b3b2f] mb-4">
    ✨ Ingredients ✨
  </h2>

  <ul className="text-[#4b3b2f] space-y-1 mb-4">
    {recipe.ingredients.map((i, idx) => (
      <li key={idx}>
        • {i.measure} {i.ingredient}
      </li>
    ))}
  </ul>

  {/* Copy button + sparkle-ish border when toast is showing */}
  <div className="relative">
    {copiedToast && (
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#fffaf4] border border-[#e4d5b8] rounded-full px-4 py-1 text-sm text-[#4b3b2f] shadow-sm">
        ✨ Ingredients copied! ✨
      </div>
    )}

    <button
      onClick={handleCopyIngredients}
      className={`w-full py-3 rounded-xl bg-emerald-700 text-white font-semibold shadow mb-4 transition
        ${copiedToast ? "ring-2 ring-emerald-300" : ""}`}
    >
      Copy Ingredients
    </button>
  </div>

  {/* Convert + Scale */}
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={goToConverter}
      className="py-2 rounded-xl bg-amber-100 border border-[#e4d5b8] text-[#4b3b2f] text-sm font-medium shadow"
    >
      Convert Ingredients ✨
    </button>

    <button
      onClick={goToScaleTool}
      className="py-2 rounded-xl bg-amber-50 border border-[#e4d5b8] text-[#4b3b2f] text-sm font-medium shadow"
    >
      Scale this Recipe ✨
    </button>
  </div>
</div>

      {/* QUICK NOTES */}
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div
          className="border border-[#e4d5b8] rounded-2xl shadow p-5"
          style={{ backgroundColor: "#BDDBAD" }}
        >
          <h2 className="text-lg font-semibold text-[#4b3b2f] mb-2">
            Quick Notes
          </h2>
          <p className="text-[#4b3b2f] mb-1">
            {recipe.description ||
              "A cozy recipe from our kitchen to yours."}
          </p>

          {recipe.cuisine && (
            <p className="text-[#4b3b2f]">Region: {recipe.cuisine}</p>
          )}
          {recipe.category && (
            <p className="text-[#4b3b2f]">Style: {recipe.category}</p>
          )}
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white/90 border border-[#e4d5b8] rounded-2xl shadow p-6 leading-relaxed text-[#4b3b2f] space-y-3">
          <h2 className="text-xl font-semibold text-[#4b3b2f] mb-2">
            Instructions
          </h2>
          {enhanceInstructions(recipe.instructions)}
        </div>
      </div>

      {/* DIVIDER + FOOTER (above legend) */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <FloralDivider variant="vine" size="sm" />
        <p className="text-center italic text-[#4b3b2f] mt-4">
          🌿 Every oven is a little different — use these as cozy guides
          and trust your senses first. 🌿
        </p>
      </div>

      {/* LEGEND */}
      <div className="max-w-4xl mx-auto mt-12 px-4">
        {/* Legend Header Button */}
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className="w-full flex justify-between items-center rounded-2xl border border-[#e4d5b8] px-4 py-3 shadow-sm"
          style={{
            backgroundColor: "#DCF0D5",
            color: "#7A5047",
          }}
        >
          <span className="font-semibold text-base">
            What do these little symbols mean? ✨
          </span>
          <span className="text-xl">
            {legendOpen ? "−" : "+"}
          </span>
        </button>

        {/* Legend Content */}
        {legendOpen && (
          <div
            className="mt-4 rounded-2xl border border-[#e4d5b8] shadow-md p-6"
            style={{
              backgroundImage: `url(${legendBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
<div className="bg-white/75 p-5 rounded-2xl">

              {/* Temperature Pills */}
              <p className="font-semibold text-[#2B1E18] mb-2">
                Temperature Pills
              </p>
              <ul className="text-[#2B1E18] list-disc ml-5 mb-4 space-y-1">
                <li>
                  We show oven temperatures in both{" "}
                  <strong>°C and °F</strong>.{" "}
                  <span className="italic">
                    Tap (mobile) or hover (desktop)
                  </span>{" "}
                  to see extra tips.
                </li>
                <li>
                  <strong>Fan ovens</strong> usually cook hotter — a cozy
                  rule of thumb is{" "}
                  <strong>reduce by ~20°C</strong>.
                </li>
                <li>
                  <strong>Gas marks</strong> are included when helpful
                  (for example, Gas Mark 4 ≈ 180°C).
                </li>
              </ul>

              {/* Length Conversion */}
              <p className="font-semibold text-[#2B1E18] mb-2">
                Pan &amp; Tin Sizes
              </p>
              <ul className="text-[#2B1E18] list-disc ml-5 mb-4 space-y-1">
                <li>
                  Sizes like <strong>20cm</strong> or{" "}
                  <strong>8mm</strong> show{" "}
                  <strong>centimetres / millimetres</strong> alongside
                  converted <strong>inches</strong> so you can use the
                  pans you already own.
                </li>
              </ul>

              {/* Sparkles */}
              <p className="font-semibold text-[#2B1E18] mb-2">
                Sparkles ✨
              </p>
              <ul className="text-[#2B1E18] list-disc ml-5 space-y-1">
                <li>
                  Sparkles simply mean{" "}
                  <strong>“tap me” or “hover me”</strong> — there’s a
                  helpful little note waiting.
                </li>
              </ul>

              {/* Cozy Helpers Closing Line */}
              <p className="mt-5 text-center italic text-[#2B1E18]">
                🌸 These cozy helpers are here to make cooking easier —
                no guessing, no scary math, just gentle guidance. 🌸
              </p>
            </div>
          </div>
        )}
      </div>

      {/* BACK TO TOP */}
      <div className="mt-16 mb-20">
        <BackToTop size="lg" offset={200} />
      </div>
    </div>
  );
}
