import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
        );

        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRecipe();
  }, [id]);

  /* ----------------------------------------------------
     CONVERT INGREDIENTS → SEND TO CALCULATOR
  ---------------------------------------------------- */
  function handleConvertIngredients() {
    if (!recipe?.extendedIngredients) return;

    // Build "name:amount unit" pairs
    const formatted = recipe.extendedIngredients
      .map((ing: any) => {
        const name = ing.nameClean || ing.name || "";
        const amount = ing.original || "";
        return `${name}:${amount}`;
      })
      .join(";");

    // Navigate directly to Calculator with query parameter
    navigate(`/calculator?ingredients=${encodeURIComponent(formatted)}`);
  }

  /* ----------------------------------------------------
     UI
  ---------------------------------------------------- */
  if (loading) {
    return (
      <div className="text-center text-white py-20 text-xl">
        Loading recipe...
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center text-white py-20 text-xl">
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

            {/* SUMMARY */}
            <div
              className="text-[#5f3c43] leading-relaxed mt-4"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />

            <FloralDivider variant="mushroom" />

            {/* INGREDIENTS HEADER + BUTTON */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1b302c] mt-4 mb-2">
                Ingredients
              </h2>

              <button
                onClick={handleConvertIngredients}
                className="mt-4 px-4 py-2 bg-emerald-200 hover:bg-emerald-300 text-[#1b302c] rounded-xl shadow"
              >
                Convert Ingredients →
              </button>
            </div>

            {/* INGREDIENT LIST */}
            <ul className="list-disc list-inside text-[#3c6150] space-y-1">
              {recipe.extendedIngredients?.map((ing: any) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>

            <FloralDivider variant="vine" />

            {/* INSTRUCTIONS */}
            <h2 className="text-xl font-bold text-[#1b302c] mt-4 mb-2">
              Instructions
            </h2>

            {recipe.analyzedInstructions?.length ? (
              <ol className="list-decimal list-inside space-y-2 text-[#5f3c43]">
                {recipe.analyzedInstructions[0].steps.map((step: any) => (
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
            {recipe.nutrition?.nutrients && (
              <>
                <h2 className="text-xl font-bold text-[#1b302c] mt-4 mb-2">
                  Nutrition Highlights
                </h2>

                <div className="grid grid-cols-2 gap-3 text-[#3c6150]">
                  {recipe.nutrition.nutrients.slice(0, 6).map((nut: any) => (
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
