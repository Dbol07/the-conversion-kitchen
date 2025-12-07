import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";
import recipesBanner from "@/assets/banners/recipes-banner.png";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY as string;

interface Ingredient {
  id: number;
  original: string;
}

interface Step {
  number: number;
  step: string;
}

interface RecipeData {
  id: number;
  title: string;
  image?: string;
  summary?: string;
  servings?: number;
  extendedIngredients?: Ingredient[];
  analyzedInstructions?: { steps: Step[] }[];
  nutrition?: { nutrients: { name: string; amount: number; unit: string }[] };
}

/* ------------------- SUMMARY CLEANING ---------------------- */
function stripHtml(html: string | undefined | null): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

/*  Highlight servings phrases */
function highlightServings(text: string) {
  return text.replace(
    /\b(serves|yields|makes)\s+\d+/gi,
    match => `<span class="serving-highlight">${match}</span>`
  );
}

/*  Convert Spoonacular “related recipe” text into internal search tags */
function convertRelatedLinks(text: string) {
  return text.replace(
    /\b([A-Za-z][A-Za-z0-9\s'&-]+cake|muffin|cookies?|bread)\b/gi,
    (m) =>
      `<a class="related-chip" href="/recipes?search=${encodeURIComponent(
        m
      )}">${m}</a>`
  );
}

/* Apply all cleaning steps */
function processSummary(html: string | undefined | null): string {
  let clean = stripHtml(html);
  clean = highlightServings(clean);
  clean = convertRelatedLinks(clean);
  return clean;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRecipe() {
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
      );
      const data: RecipeData = await res.json();

      setRecipe({
        ...data,
        summary: processSummary(data.summary)
      });
    } catch (err) {
      console.error("Failed to load recipe", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadRecipe();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-[#4b3b2f] mt-20">Loading recipe…</div>
    );

  if (!recipe)
    return (
      <div className="text-center text-[#4b3b2f] mt-20">Recipe not found.</div>
    );

  /* Copy Ingredients */
  function copyIngredients() {
    const servings = recipe.servings ? `Ingredients (serves ${recipe.servings})\n\n` : "Ingredients\n\n";
    const list = recipe.extendedIngredients?.map(i => `• ${i.original}`).join("\n") ?? "";
    navigator.clipboard.writeText(servings + list);
    alert("Ingredients copied!");
  }

  return (
    <div className="min-h-screen pb-24 bg-[#1b302c]/20">

      {/* ⭐ PAGE BANNER */}
      <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-b-2xl overflow-hidden shadow-xl">
        <img
          src={recipesBanner}
          alt="Recipe Banner"
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-[#1b302c]/35" />

        <h1 className="absolute inset-0 flex items-center justify-center text-center
                       text-3xl sm:text-4xl font-bold text-white drop-shadow-xl px-4">
          {recipe.title}
        </h1>
      </div>

      {/* BACK BUTTON */}
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-[#b8d3d5] text-[#1b302c] rounded-xl shadow 
                     hover:bg-[#a77a72] hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <DecorativeFrame>
          <div className="parchment-card p-6">

            {/* IMAGE */}
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="rounded-xl shadow mb-6 w-full"
              />
            )}

            {/* SUMMARY */}
            <div
              className="text-[#5f3c43] mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: recipe.summary || "" }}
            />

            <FloralDivider variant="mushroom" />

            {/* INGREDIENTS */}
            <h2 className="text-xl font-bold text-[#1b302c] mt-6">Ingredients</h2>

            {recipe.extendedIngredients?.length ? (
              <>
                <ul className="list-disc list-inside mt-2 mb-4 text-[#5f3c43]">
                  {recipe.extendedIngredients.map(i => (
                    <li key={i.id}>{i.original}</li>
                  ))}
                </ul>

                <button
                  onClick={copyIngredients}
                  className="px-4 py-2 bg-[#3c6150] text-white rounded-xl shadow hover:bg-[#2b4c3c] transition"
                >
                  Copy Ingredients
                </button>
              </>
            ) : (
              <p className="italic text-[#5f3c43]">No ingredients listed.</p>
            )}

            <FloralDivider variant="vine" />

            {/* INSTRUCTIONS */}
            <h2 className="text-xl font-bold text-[#1b302c] mt-6">Instructions</h2>

            {recipe.analyzedInstructions?.length ? (
              <ol className="list-decimal list-inside space-y-2 mt-2 text-[#5f3c43] leading-relaxed">
                {recipe.analyzedInstructions[0].steps.map(s => (
                  <li key={s.number}>{s.step}</li>
                ))}
              </ol>
            ) : (
              <p className="italic text-[#5f3c43]">Instructions unavailable.</p>
            )}

            <FloralDivider variant="mushroom" />

            {/* NUTRITION */}
            {recipe.nutrition?.nutrients && (
              <>
                <h2 className="text-xl font-bold text-[#1b302c] mt-6">
                  Nutrition Highlights
                </h2>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  {recipe.nutrition.nutrients.slice(0, 6).map((n, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#b8d3d5]/20 rounded-xl shadow text-[#3c6150]"
                    >
                      <p className="font-semibold">{n.name}</p>
                      <p>{n.amount} {n.unit}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </DecorativeFrame>
      </div>
    </div>
  );
}
