// RecipeDetails.tsx — Ari-cleaned + no missing functions

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";

import FloralDivider from "@/components/FloralDivider";
import Tooltip from "@/components/Tooltip";
import BackToTop from "@/components/BackToTop";

import { mealdbLookup } from "@/utils/mealdb";
import { trackedSpoonFetch } from "@/utils/spoonacularUsage";

import recipesBanner from "@/assets/banners/recipes-banner.png";
import "@/index.css";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source") || "mealdb";

  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);

  /* ------------------------------------------------------
     STEP 1 — Spoonacular fetch function (local)
  ------------------------------------------------------ */
  async function fetchSpoonRecipe(recipeId: string) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${
      import.meta.env.VITE_SPOON_API
    }&includeNutrition=false`;

    const res = await trackedSpoonFetch(url);
    if (!res.ok) throw new Error("Spoonacular getRecipe failed");
    return await res.json();
  }

  /* ------------------------------------------------------
     STEP 2 — Normalize Spoonacular → unified shape
  ------------------------------------------------------ */
  function normalizeSpoonRecipe(data: any) {
    return {
      id: data.id,
      title: data.title,
      thumbnail: data.image,
      description: data.summary
        ? data.summary.replace(/<[^>]+>/g, "")
        : "",
      category: data.dishTypes?.[0] || "",
      cuisine: data.cuisines?.[0] || "",

      ovenC: data.temperature?.metric,
      ovenF: data.temperature?.us,
      ovenGas: null,
      ovenFan: null,

      ingredients: data.extendedIngredients?.map((i: any) => ({
        amount: `${i.amount} ${i.unit}`.trim(),
        ingredient: i.name,
      })) ?? [],

      instructions:
        data.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) ??
        (data.instructions ? [data.instructions] : []),
    };
  }

  /* ------------------------------------------------------
     STEP 3 — Normalize MealDB → unified shape
  ------------------------------------------------------ */
  function normalizeMealDbRecipe(meal: any) {
    return {
      id: meal.id,
      title: meal.title,
      thumbnail: meal.image,
      description: meal.instructions?.split("\n")[0] ?? "",
      category: meal.category || "",
      cuisine: meal.area || "",

      ovenC: null,
      ovenF: null,
      ovenGas: null,
      ovenFan: null,

      ingredients: meal.ingredients.map((i: any) => ({
        amount: i.measure,
        ingredient: i.ingredient,
      })),

      instructions:
        meal.instructions?.split("\n").filter((s: string) => s.trim()) ?? [],
    };
  }

  /* ------------------------------------------------------
     STEP 4 — Load recipe with fallback
  ------------------------------------------------------ */
  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        let result = null;

        if (source === "mealdb") {
          const meal = await mealdbLookup(id);
          if (meal) {
            result = normalizeMealDbRecipe(meal);
          } else {
            const spoon = await fetchSpoonRecipe(id).catch(() => null);
            if (spoon) result = normalizeSpoonRecipe(spoon);
          }
        } else {
          const spoon = await fetchSpoonRecipe(id).catch(() => null);
          if (spoon) {
            result = normalizeSpoonRecipe(spoon);
          } else {
            const meal = await mealdbLookup(id).catch(() => null);
            if (meal) result = normalizeMealDbRecipe(meal);
          }
        }

        if (!result) {
          setError("Recipe not found.");
        } else {
          setRecipe(result);
        }
      } catch (err) {
        console.error(err);
        setError("Unexpected error loading recipe.");
      }

      setLoading(false);
    }

    load();
  }, [id, source]);

  /* ------------------------------------------------------
     Copy ingredients
  ------------------------------------------------------ */
  function handleCopy() {
    if (!recipe) return;

    const txt = recipe.ingredients
      ?.map((i: any) => `${i.amount} ${i.ingredient}`)
      .join("\n");

    navigator.clipboard.writeText(txt || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* ------------------------------------------------------
     Loading + Error states
  ------------------------------------------------------ */
  if (loading)
    return <div className="p-8 text-center text-[#4b3b2f]">Loading recipe…</div>;

  if (error || !recipe)
    return (
      <div className="p-8 text-center text-[#4b3b2f]">
        {error || "Recipe not found."}
        <br />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white"
        >
          Go back
        </button>
      </div>
    );

  /* ------------------------------------------------------
     MAIN RENDER
  ------------------------------------------------------ */
  return (
    <div className="relative max-w-5xl mx-auto px-4 pb-24 pt-6">

      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#4b3b2f]">
        {recipe.title}
      </h1>

      {(recipe.category || recipe.cuisine) && (
        <p className="text-center text-[#5f3c43] mt-1 italic">
          {recipe.category}
          {recipe.category && recipe.cuisine ? " · " : ""}
          {recipe.cuisine}
        </p>
      )}

      <div className="flex justify-center mt-3 mb-6">
        <FloralDivider variant="floral" size="md" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT COLUMN */}
        <div>
          <div className="rounded-2xl shadow border border-[#e4d5b8] overflow-hidden">
            <img src={recipe.thumbnail} className="w-full object-cover" />
          </div>

          <div className="mt-4 p-4 bg-[#fffaf4] border border-[#e4d5b8] rounded-2xl shadow-sm">
            <h3 className="font-semibold text-lg text-[#4b3b2f] mb-2">
              Quick Notes
            </h3>

            {recipe.description && (
              <p className="text-sm text-[#5f3c43]">{recipe.description}</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — INGREDIENTS */}
        <div className="p-5 bg-[#fffaf4] border border-[#e4d5b8] rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-[#4b3b2f] mb-3">
            Ingredients
          </h3>

          <ul className="text-sm text-[#4b3b2f] space-y-1 mb-4">
            {recipe.ingredients.map((ing: any, i: number) => (
              <li key={i}>
                {ing.amount} {ing.ingredient}
              </li>
            ))}
          </ul>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-xl bg-emerald-700 text-white font-semibold shadow"
          >
            {copied ? "Copied!" : "Copy Ingredients"}
          </button>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/calculator?tab=ingredient"
              className="w-full py-2 rounded-xl bg-amber-200 border border-[#e4d5b8] text-center"
            >
              Convert an ingredient ✨
            </Link>
            <Link
              to="/calculator?tab=scale"
              className="w-full py-2 rounded-xl bg-[#f2ebd7] border border-[#e4d5b8] text-center"
            >
              Send to scale tool
            </Link>
          </div>
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="mt-10 p-5 bg-white/90 border border-[#e4d5b8] rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-3 text-[#4b3b2f]">Instructions</h3>
        <ol className="list-decimal ml-5 space-y-2 text-sm text-[#4b3b2f]">
          {recipe.instructions.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      <BackToTop />
    </div>
  );
}
