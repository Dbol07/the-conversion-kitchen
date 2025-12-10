// src/pages/RecipeDetails.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import FloralDivider from "@/components/FloralDivider";
import Tooltip from "@/components/Tooltip";
import { fetchMealDbRecipe } from "@/utils/mealdb"; // CORRECT SOURCE
import "@/index.css";

interface RecipeData {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strArea?: string;
  strCategory?: string;
  ingredients: { ingredient: string; measure: string }[];
}

/* ----------------------------------------------------
   HELPERS: Temperature + Length Detection
---------------------------------------------------- */

// Detect Celsius like "180C" or "180°C"
const celsiusRegex = /(\d{2,3})\s?°?C\b/gi;

// Detect centimeters: "20cm" or "20 cm"
const cmRegex = /(\d+)\s?cm\b/gi;

// Convert °C → °F
function cToF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

// Convert cm → inches
function cmToIn(cm: number) {
  return Math.round((cm / 2.54) * 10) / 10;
}

// Fan oven rule: -20°C
function fanOven(c: number) {
  return c - 20;
}

/* ----------------------------------------------------
   TOOLTIP-WRAPPED STRING REPLACER
---------------------------------------------------- */

function enhanceInstructionText(instruction: string) {
  if (!instruction) return instruction;

  let updated = instruction;

  // Temperature conversions
  updated = updated.replace(celsiusRegex, (full, c) => {
    const cNum = Number(c);
    const fNum = cToF(cNum);
    const fan = fanOven(cNum);

    return `<temp data="${cNum}" tooltip="${fNum}" fan="${fan}">${cNum}°C</temp>`;
  });

  // Length conversions
  updated = updated.replace(cmRegex, (full, cm) => {
    const cmNum = Number(cm);
    const inchNum = cmToIn(cmNum);

    return `<len data="${cmNum}" tooltip="${inchNum}">${cmNum}cm</len>`;
  });

  return updated;
}

/* ----------------------------------------------------
   PARSE INSTRUCTIONS INTO REACT ELEMENTS
---------------------------------------------------- */

function renderEnhancedText(text: string) {
  const parts = text
    .split(/(<temp[^>]*>.*?<\/temp>|<len[^>]*>.*?<\/len>)/g)
    .filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("<temp")) {
      const c = Number(part.match(/data="(\d+)"/)?.[1]);
      const f = Number(part.match(/tooltip="(\d+)"/)?.[1]);
      const fan = Number(part.match(/fan="(\d+)"/)?.[1]);

      return (
        <Tooltip
          key={i}
          label={`${c}°C → ${f}°F\nFan oven: ${fan}°C`}
          rounded
          subtle
        >
          <span className="highlight-temp">{c}°C</span>
        </Tooltip>
      );
    }

    if (part.startsWith("<len")) {
      const cm = Number(part.match(/data="(\d+)"/)?.[1]);
      const inch = Number(part.match(/tooltip="([\d.]+)"/)?.[1]);

      return (
        <Tooltip
          key={i}
          label={`${cm} cm → ${inch} in`}
          rounded
          subtle
        >
          <span className="highlight-length">{cm}cm</span>
        </Tooltip>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */

export default function RecipeDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get("source") || "mealdb";

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        if (source === "mealdb") {
          const data = await fetchMealDbRecipe(id!);
          setRecipe(data);
        }

        // (Optional) fallback for Spoonacular if you re-enable later  
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, source]);

  if (loading) {
    return (
      <div className="p-8 text-center text-[#4b3b2f] text-xl">
        Loading…
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-8 text-center text-red-600 text-xl">
        Recipe not found.
      </div>
    );
  }

  const enhancedInstructions = enhanceInstructionText(recipe.strInstructions);

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-xl bg-[#dfe7df] text-[#1b302c] font-medium shadow border border-[#b8d3d5] mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center text-[#4b3b2f]">
        {recipe.strMeal}
      </h1>

      <FloralDivider variant="vine" size="sm" />

      {/* IMAGE */}
      <div className="flex justify-center mt-4">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="rounded-xl shadow-lg max-w-full"
        />
      </div>

      <FloralDivider variant="floral" size="xs" />

      {/* INGREDIENTS */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">Ingredients</h2>

        <ul className="list-disc pl-6 space-y-1 text-[#3c2e22]">
          {recipe.ingredients.map((item, i) =>
            item.ingredient ? (
              <li key={i}>
                {item.measure} {item.ingredient}
              </li>
            ) : null
          )}
        </ul>

        <button
          onClick={() =>
            navigator.clipboard.writeText(
              recipe.ingredients
                .map((i) => `${i.measure} ${i.ingredient}`)
                .join("\n")
            )
          }
          className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl shadow hover:bg-emerald-800"
        >
          Copy Ingredients
        </button>
      </section>

      <FloralDivider variant="floral" size="xs" />

      {/* INSTRUCTIONS */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
          Instructions
        </h2>

        <ol className="list-decimal pl-6 space-y-3 text-[#3c2e22] leading-relaxed">
          {enhancedInstructions
            .split(/\r?\n/)
            .filter(Boolean)
            .map((line, idx) => (
              <li key={idx}>{renderEnhancedText(line)}</li>
            ))}
        </ol>
      </section>

      {/* CALCULATOR BUTTON */}
      <div className="mt-6 text-center">
        <Link
          to="/calculator?tab=full"
          className="inline-block px-6 py-3 bg-amber-300 text-[#4b3b2f] rounded-xl shadow border border-[#d8c29a] hover:bg-amber-400"
        >
          Open Recipe Converter
        </Link>
      </div>

      <FloralDivider variant="vine" size="sm" />

      {/* LEGEND ACCORDION */}
      <div className="mt-6">
        <button
          onClick={() => setShowLegend((p) => !p)}
          className="w-full text-left px-4 py-3 rounded-xl bg-[#fff3d6] border border-[#e4d5b8] font-semibold text-[#4b3b2f]"
        >
          {showLegend ? "▼" : "►"} Help & Legend
        </button>

        {showLegend && (
          <div className="mt-3 bg-white/90 border border-[#e4d5b8] rounded-xl p-4 space-y-3">
            <p className="text-sm">
              <span className="highlight-temp px-2 py-1 rounded">180°C</span>  
              → Tap to see °F + fan oven conversion.
            </p>
            <p className="text-sm">
              <span className="highlight-length px-2 py-1 rounded">20cm</span>  
              → Tap to show the equivalent in inches.
            </p>
            <p className="text-sm">
              Fan oven temperatures are typically **20°C lower**.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
