
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
   (SWC-safe, no continue, balanced braces)
-------------------------------------------------------- */

function enhanceInstructions(raw: string) {
  if (!raw) return [];

  // Split into lines and remove empty ones
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const steps: JSX.Element[] = [];

  // OUTER LOOP — each instruction line
  for (let idx = 0; idx < lines.length; idx++) {
    let step = lines[idx];

    // -----------------------------------------
    // 0) Strip any existing numbering
    // -----------------------------------------
    step = step.replace(
      /^(?:\d+\.\s*|\d+\)\s*|step\s*\d+[:.)-]?\s*)/i,
      ""
    ).trim();
    // -----------------------------------------
    // 1) Detect ml / fl oz and g / oz first
    // -----------------------------------------
    step = step.replace(
      /(\d+)\s*ml\s*\/\s*(\d+(?:\.\d+)?)\s*(fl\s?oz)/gi,
      (_m, ml, floz, unit) =>
        `__MLFL__${ml}/${floz}${unit.replace(/\s+/g, "")}`
    );

    step = step.replace(
      /(\d+)\s*g\s*\/\s*(\d+(?:\.\d+)?)\s*oz/gi,
      (_m, g, oz) => `__GOZ__${g}/${oz}`
    );

    // -----------------------------------------
    // 2) Fan / Gas Mark
    // -----------------------------------------
    step = step.replace(
      /fan\s*\/?\s*gas\s*mark\s*(\d+)/gi,
      (_m, n) => `__FAN__${n}`
    );

    // -----------------------------------------
    // 3) cm / mm (allow decimals)
    // -----------------------------------------
    step = step.replace(
      /(\d+(?:\.\d+)?)\s?cm/gi,
      (_m, cmVal) => {
        const cm = parseFloat(cmVal);
        if (Number.isNaN(cm)) return _m;
        const inch = Math.max(1, Math.round(cm / 2.54));
        return `__CM__${cm}/${inch}`;
      }
    );

    step = step.replace(
      /(\d+(?:\.\d+)?)\s?mm/gi,
      (_m, mmVal) => {
        const mm = parseFloat(mmVal);
        if (Number.isNaN(mm)) return _m;
        const inch = Math.max(1, Math.round(mm / 25.4));
        return `__MM__${mm}/${inch}`;
      }
    );

// -----------------------------------------
// 4) Temperature detection (STRICT)
// Only match temps when meaning is explicit
// -----------------------------------------
step = step.replace(
  // Requires °C / °F OR oven context
  /\b(?:oven|preheat|heat(?:\s+the)?\s+oven\s+to|bake\s+at)?\s*(\d{2,3})\s*°?\s*(C|F)\b/gi,
  (_match, numStr, unit) => {
    const num = parseInt(numStr, 10);
    if (Number.isNaN(num) || num < 70 || num > 300) return _match;

    const originalUnit = unit.toUpperCase() as "C" | "F";
    const c = originalUnit === "C" ? num : convertTemp(num, "C");
    const f = originalUnit === "F" ? num : convertTemp(num, "F");

    return `__TEMP__${c}/${f}`;
  }
);
    // -----------------------------------------
    // Split into parts
    // -----------------------------------------
    const parts = step.split(
      /(__TEMP__\d+\/\d+|__CM__[\d.]+\/\d+|__MM__[\d.]+\/\d+|__MLFL__\d+\/[\d.]+floz|__GOZ__\d+\/[\d.]+|__FAN__\d+)/
    );

    const jsxParts: (string | JSX.Element)[] = [];

    // INNER LOOP — build JSX
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      // TEMP + FAN
      if (part.startsWith("__TEMP__")) {
        const [cStr, fStr] = part.replace("__TEMP__", "").split("/");
        const c = Number(cStr);
        const f = Number(fStr);
        const gas = cToGasMark(c);

        let fanText = "";
        for (let j = 1; j <= 2; j++) {
          if (parts[i + j]?.startsWith("__FAN__")) {
            fanText = ` • Fan Gas Mark ${parts[i + j].replace("__FAN__", "")}`;
            parts[i + j] = "";
            break;
          }
        }

        jsxParts.push(
          (
            <Tooltip
              key={`temp-${idx}-${i}`}
              label={`🌿 Gas Mark ${gas}\nA gentle UK baking scale — higher marks mean warmer ovens.`}
            >
<span
  style={{
    backgroundColor: "#D7B4ED",
    color: "#271A36",
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "0.85em",
  }}
>
  {c}°C • {f}°F • Gas Mark {gas}
  {fanText}{" "}
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
          )
        );
      }

      // CM
      else if (part.startsWith("__CM__")) {
        const [cm, inch] = part.replace("__CM__", "").split("/");
        jsxParts.push(
          (
            <span
              style={{
                backgroundColor: "#B4EAED",
                color: "#172A3D",
                padding: "2px 8px",
                borderRadius: "999px",
                fontSize: "0.85em",
                margin: "0 2px",
              }}
            >
              {cm}cm ≈ {inch}in ✨
            </span>
          )
        );
      }

      // MM
      else if (part.startsWith("__MM__")) {
        const [mm, inch] = part.replace("__MM__", "").split("/");
        jsxParts.push(
          (
            <span
              style={{
                backgroundColor: "#B4EAED",
                color: "#172A3D",
                padding: "2px 8px",
                borderRadius: "999px",
                fontSize: "0.85em",
                margin: "0 2px",
              }}
            >
              {mm}mm ≈ {inch}in ✨
            </span>
          )
        );
      }

      // ML / FL OZ
else if (part.startsWith("__MLFL__")) {
  const [ml, floz] = part.replace("__MLFL__", "").split("/");
  jsxParts.push(
    (
      <span
        style={{
          backgroundColor: "#EDC1B9",
          color: "#633129",
          padding: "2px 8px",
          borderRadius: "999px",
          fontSize: "0.85em",
          margin: "0 2px",
        }}
      >
        {ml}ml ≈ {Number(floz).toFixed(1)}fl oz ✨
      </span>
    )
  );
}

// ML (single value)
else if (part.startsWith("__ML__")) {
  const [ml, floz] = part.replace("__ML__", "").split("/");
  jsxParts.push(
    <span
      style={{
        backgroundColor: "#EDC1B9",
        color: "#633129",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "0.85em",
        margin: "0 2px",
      }}
    >
      {ml}ml ≈ {floz}fl oz ✨
    </span>
  );
}

      // G / OZ
else if (part.startsWith("__GOZ__")) {
  const [g, oz] = part.replace("__GOZ__", "").split("/");
  jsxParts.push(
    (
      <span
        style={{
          backgroundColor: "#EDC1B9",
          color: "#633129",
          padding: "2px 8px",
          borderRadius: "999px",
          fontSize: "0.85em",
          margin: "0 2px",
        }}
      >
        {g}g ≈ {Number(oz).toFixed(1)}oz ✨
      </span>
    )
  );
}

      // Plain text
      else {
        jsxParts.push(part);
      }
    }

    // -----------------------------------------
    // Only push steps with visible content
    // -----------------------------------------
    const hasVisibleContent = jsxParts.some((p) =>
      typeof p === "string" ? p.trim() !== "" : true
    );

    if (hasVisibleContent) {
      steps.push(
        <p key={idx}>
          {idx + 1}. {jsxParts}
        </p>
      );
    }
  }

  return steps;
}
/* -------------------------------------------------------
   PREP / COOK / READY EXTRACTION
   - Pulls metadata out of instructions
   - Keeps instructions clean
-------------------------------------------------------- */
function extractTimesFromInstructions(text: string) {
  if (!text) {
    return {
      cleanedInstructions: "",
      prep: null,
      cook: null,
      ready: null,
    };
  }

  const prep =
    text.match(/prep[:\s]*([\d\s]+min)/i)?.[1] ?? null;

  const cook =
    text.match(/cook[:\s]*([\d\s]+min)/i)?.[1] ?? null;

  const ready =
    text.match(/ready\s*in[:\s]*([\d\s]+min)/i)?.[1] ?? null;

  // Remove metadata-only lines from instructions
  const cleanedInstructions = text
    .split("\n")
    .filter(
      (line) =>
        !/prep[:\s]*\d+/i.test(line) &&
        !/cook[:\s]*\d+/i.test(line) &&
        !/ready\s*in[:\s]*\d+/i.test(line)
    )
    .join("\n");

  return {
    cleanedInstructions,
    prep,
    cook,
    ready,
  };
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
const { cleanedInstructions, prep, cook, ready } =
  extractTimesFromInstructions(recipe.instructions);

  return (
    <div
      className="min-h-screen pb-32 pt-8"
      style={{
        backgroundImage: `url(${bgRecipes})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
{/* --------------------------------------------------
   HEADER & NAVIGATION
   - Back button: history back → fallback to /recipes
--------------------------------------------------- */}

{/* BACK BUTTON (storybook arrow) */}
<button
  onClick={() => {
    // If the user has navigation history, go back
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback (direct link, refresh, etc.)
      navigate("/recipes");
    }
  }}
  className="absolute left-4 top-6 w-10 h-10 rounded-full
             bg-white/80 shadow border border-[#e4d5b8]
             flex items-center justify-center
             text-[#4b3b2f] text-2xl"
  aria-label="Go back"
>
  🡠
</button>

{/* TITLE BOX */}
<div className="mx-auto mt-4 max-w-3xl px-4">
  <div className="bg-white/80 border border-[#e4d5b8] rounded-2xl shadow p-6 text-center">
    <h1 className="text-3xl font-bold text-[#4b3b2f]">
      {recipe.title}
    </h1>

    <p className="text-[#5f3c43] italic mt-1">
      {recipe.cuisine}
      {recipe.category ? ` · ${recipe.category}` : ""}
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

  {/* Copy button + toast */}
  <div className="relative">
    {copiedToast && (
      <div
        className="absolute -top-9 left-1/2 -translate-x-1/2
                   rounded-full px-4 py-1 text-sm shadow-sm"
        style={{
          backgroundColor: "#F0E4D3", // toast bg
          color: "#4b3b2f",
          border: "1px solid #e4d5b8",
        }}
      >
        ✨ Ingredients copied! ✨
      </div>
    )}

    <button
      onClick={handleCopyIngredients}
      className={`w-full py-3 rounded-xl font-semibold shadow mb-4 transition
        ${copiedToast ? "ring-2 ring-emerald-300" : ""}`}
      style={{
        backgroundColor: "#50BA4C", // copy button bg
        color: "white",
      }}
    >
      Copy Ingredients
    </button>
  </div>

  {/* Convert + Scale */}
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={goToConverter}
      className="py-2 rounded-xl bg-amber-100 border border-[#e4d5b8]
                 text-[#4b3b2f] text-sm font-medium shadow"
    >
      Convert Ingredients ✨
    </button>

    <button
      onClick={goToScaleTool}
      className="py-2 rounded-xl bg-amber-50 border border-[#e4d5b8]
                 text-[#4b3b2f] text-sm font-medium shadow"
    >
      Scale this Recipe ✨
    </button>
  </div>
</div>
      </div>  {/* 👈 CLOSES THE GRID LAYOUT */}


      {/* QUICK NOTES */}
      <div className="max-w-5xl mx-auto mt-10 px-4">

<div
  className="border border-[#e4d5b8] rounded-2xl shadow p-5"
  style={{ backgroundColor: "#DCF0D5" }}
>
  <h2 className="text-lg font-semibold text-[#4b3b2f] mb-2">
    Quick Notes
  </h2>

  <p className="text-[#4b3b2f] mb-1">
    {recipe.description ||
      "A cozy recipe from our kitchen to yours."}
  </p>

  <p className="text-[#4b3b2f] italic mb-2">
   
    {recipe.cuisine && ` Region: ${recipe.cuisine}`}
    {recipe.category && ` · Style: ${recipe.category}`}
  </p>

  {(prep || cook || ready) && (
    <p className="text-[#4b3b2f]">
      ⏱️
      {prep && ` Prep: ${prep}`}
      {cook && ` • Cook: ${cook}`}
      {ready && ` • Ready: ${ready}`}
    </p>
  )}
</div>

      </div>

      {/* INSTRUCTIONS */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white/90 border border-[#e4d5b8] rounded-2xl shadow p-6 leading-relaxed text-[#4b3b2f] space-y-3">
          <h2 className="text-xl font-semibold text-[#4b3b2f] mb-2">
            Instructions
          </h2>
          {enhanceInstructions(cleanedInstructions)}

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
<div className="max-w-4xl mx-auto mt-12 px-4 relative">
  {/* Legend Header Button */}
  <button
    onClick={() => setLegendOpen(!legendOpen)}
    className="w-full flex justify-between items-center
               rounded-2xl border border-[#e4d5b8]
               px-4 py-3 shadow-sm"
    style={{
      backgroundColor: "#BDDBAD",
      color: "#2B1E18", // header text
    }}
  >
    <span className="font-semibold text-base">
      What do these little symbols mean? ✨
    </span>
    <span className="text-xl">
      {legendOpen ? "−" : "+"}
    </span>
  </button>

{/* Back to Top – floating below legend header */}
<div className="absolute right-6 top-[72px] z-20">
  <BackToTop variant="inline" />
</div>

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
      {/* Inner content box (opacity intentionally preserved) */}
      <div className="bg-white/75 p-5 rounded-2xl">
        {/* Temperature Pills */}
        <p className="font-semibold mb-2" style={{ color: "#6B463E" }}>
          Temperature Pills
        </p>
        <ul className="list-disc ml-5 mb-4 space-y-1" style={{ color: "#6B463E" }}>
          <li>
            We show oven temperatures in both <strong>°C and °F</strong>.
          </li>
          <li>
            <strong>Fan ovens</strong> usually cook hotter — a cozy rule
            of thumb is <strong>reduce by ~20°C</strong>.
          </li>
          <li>
            <strong>Gas marks</strong> are included when helpful
            (for example, Gas Mark 4 ≈ 180°C).
          </li>
        </ul>

        {/* Pan & Tin Sizes */}
        <p className="font-semibold mb-2" style={{ color: "#6B463E" }}>
          Pan &amp; Tin Sizes
        </p>
        <ul className="list-disc ml-5 mb-4 space-y-1" style={{ color: "#6B463E" }}>
          <li>
            Sizes like <strong>20cm</strong> or <strong>8mm</strong> show
            centimetres / millimetres alongside converted inches so you
            can use the pans you already own.
          </li>
        </ul>

        {/* Sparkles */}
        <p className="font-semibold mb-2" style={{ color: "#6B463E" }}>
          Sparkles ✨
        </p>
        <ul className="list-disc ml-5 space-y-1" style={{ color: "#6B463E" }}>
          <li>
            Sparkles simply mean <strong>“tap me”</strong> — there’s a
            helpful little note waiting.
          </li>
        </ul>

        {/* Cozy Helpers Closing Line */}
        <p
          className="mt-5 text-center italic"
          style={{ color: "#6B463E" }}
        >
          🌸 These cozy helpers are here to make cooking easier — no
          guessing, no scary math, just gentle guidance. 🌸
        </p>
      </div>
    </div>
  )}
</div>

    </div>
  );
}

