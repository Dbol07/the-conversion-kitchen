import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

interface SpoonacularRecipe {
  id: number;
  title: string;
  image?: string;
  summary?: string;
  extendedIngredients?: { id: number; original: string }[];
  analyzedInstructions?: { steps: { number: number; step: string }[] }[];
  readyInMinutes?: number;
  servings?: number;
  nutrition?: { nutrients: { name: string; amount: number; unit: string }[] };
}

function stripHtmlToText(html: string | undefined | null): string {
  if (!html) return "";
  // Basic HTML tag removal; keeps plain text only
  return html.replace(/<[^>]+>/g, "");
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<SpoonacularRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
        );

        const data: SpoonacularRecipe = await res.json();

        // Sanitize summary so it cannot contain links or HTML
        const cleanSummary = stripHtmlToText(data.summary);

        setRecipe({
          ...data,
          summary: cleanSummary,
        });
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2ebd7]">
        <p className="text-lg text-[#4b3b2f]">Loading recipe…</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center text-[#4b3b2f] py-20 text-xl">
        Recipe not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 page-transition page-bg bg-[#1b302c]/30 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-[#b8d3d5] text-[#1b302c] rounded-xl shadow hover:bg-[#a77a72] hover:text-white transition-all"
        >
          ← Back
        </button>

        <DecorativeFrame>
          <div className="parchment-card p-6">
            {/* TITLE */}
            <h1 className="text-3xl font-bold text-[#1b302c] mb-3">
              {recipe.title}
            </h1>

            {/* IMAGE */}
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="rounded-xl shadow-lg mb-4 w-full"
              />
            )}

            <FloralDivider variant="vine" />

            {/* SUMMARY (plain text, no links) */}
            {recipe.summary && (
              <p className="text-[#5f3c43] leading-relaxed mt-4 whitespace-pre-line">
                {recipe.summary}
              </p>
            )}

            <FloralDivider variant="mushroom" />

            {/* INGREDIENTS */}
            <h2 className="text-xl font-bold text-[#1b302c] mt-4 mb-2">
              Ingredients
            </h2>

            {recipe.extendedIngredients?.length ? (
              <ul className="list-disc list-inside space-y-1 text-[#5f3c43]">
                {recipe.extendedIngredients.map((ing) => (
                  <li key={ing.id}>{ing.original}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-[#5f3c43]">
                Ingredients list not available.
              </p>
            )}

            <FloralDivider variant="vine" />

            {/* INSTRUCTIONS */}
            <h2 className="text-xl font-bold text-[#1b302c] mt-4 mb-2">
              Instructions
            </h2>

            {recipe.analyzedInstructions?.length ? (
              <ol className="list-decimal list-inside space-y-2 text-[#5f3c43]">
                {recipe.analyzedInstructions[0].steps.map((step) => (
                  <li key={step.number} className="leading-relaxed">
                    {step.step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="italic text-[#5f3c43]">
                Instructions unavailable.
              </p>
            )}

            <FloralDivider variant="mushroom" />

            {/* NUTRITION */}
            {recipe.nutrition?.n
              && (
              <>
                <h2 className="text-xl font-bold text-[#1b302c] mt-4 mb-2">
                  Nutrition Highlights
                </h2>

                <div className="grid grid-cols-2 gap-3 text-[#3c6150]">
                  {recipe.nutrition.nutrients.slice(0, 6).map((nut) => (
                    <div
                      key={nut.name}
                      className="p-3 bg-[#b8d3d5]/20 rounded-xl shadow"
                    >
                      <p className="font-semibold">{nut.name}</p>
                      <p>
                        {nut.amount} {nut.unit}
                      </p>
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
