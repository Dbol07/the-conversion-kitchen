// src/pages/RecipeDetails.tsx — Dual-source (MealDB + Spoonacular)

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import FloralDivider from "@/components/FloralDivider";
import DecorativeFrame from "@/components/DecorativeFrame";

import bgGuide from "@/assets/backgrounds/bg-guide.jpg";

import { mealdbLookup } from "@/utils/mealdb";
import { trackedSpoonFetch, getSpoonUsage } from "@/utils/spoonacularUsage";

// Convert capitalized words into internal recipe links
function convertRelatedLinks(text: string) {
  return text.replace(
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,6})\b/g,
    (match) =>
      `<a class="related-chip" href="/recipes?search=${encodeURIComponent(
        match
      )}">${match}</a>`
  );
}

// Pretty fallback UI for Spoonacular rate limits
function RateLimitMessage({ usage }: any) {
  const minutes =
    usage.blockedMsRemaining > 0
      ? Math.max(1, Math.ceil(usage.blockedMsRemaining / 60000))
      : 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2ebd7] px-4">
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/90 shadow text-center space-y-3">
        <h2 className="text-xl font-bold text-[#5f3c43]">
          We’ve reached today’s recipe limit 🌙
        </h2>
        <p className="text-sm text-[#5f3c43] leading-relaxed">
          Spoonacular’s free API only allows a small number of recipe lookups
          per day. You’ve used{" "}
          <strong>
            {usage.count}/{usage.dailyLimit}
          </strong>{" "}
          calls today.
        </p>
        <p className="text-xs text-[#5f3c43]">
          The kitchen faeries are taking a tiny break. Please try again in about{" "}
          <strong>{minutes} minute(s)</strong>.
        </p>
      </div>
    </div>
  );
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // From Recipes.tsx we added "?source=mealdb" or "?source=spoonacular"
  const source = searchParams.get("source") || "mealdb"; // default safe

  // Unified loader for both sources
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["recipeDetails", id, source],
    queryFn: async () => {
      if (source === "mealdb") {
        // ⭐ Load from TheMealDB Premium
        return mealdbLookup(id!);
      }

      // ⭐ Otherwise load from Spoonacular
      const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${
        import.meta.env.VITE_SPOONACULAR_API_KEY
      }&includeNutrition=true`;

      const res = await trackedSpoonFetch(url);

      if (!res.ok) throw new Error("FETCH_ERROR");
      const data = await res.json();

      return {
        id: data.id.toString(),
        title: data.title,
        image: data.image || "",
        instructions:
          data.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) || [],
        ingredients:
          data.extendedIngredients?.map((i: any) => ({
            original: i.original,
          })) || [],
        servings: data.servings,
        category: data.dishTypes?.[0],
        area: data.cuisines?.[0],
        summary: data.summary || "",
        source: "spoonacular",
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour caching (MealDB allows)
  });

  const usage = getSpoonUsage();

  // Handle Spoonacular rate limit
  const isLimitError =
    error &&
    ((error as any).message === "SPOON_DAILY_LIMIT" ||
      (error as any).message === "SPOON_RATE_LIMIT");

  if (isLimitError) {
    return <RateLimitMessage usage={usage} />;
  }

  if (isLoading) {
    return <p className="text-center mt-10 text-[#1b302c]">Loading recipe…</p>;
  }

  if (!recipe) {
    return (
      <p className="text-center mt-10 text-[#1b302c]">
        Recipe not found or unavailable.
      </p>
    );
  }

  return (
    <div
      className="min-h-screen w-full pb-28"
      style={{
        backgroundImage: `url(${bgGuide})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#1b302c]/15 min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">

          <button
            className="mb-4 px-4 py-2 bg-[#b8d3d5] text-[#1b302c] rounded-xl shadow hover:bg-[#9bc99e]"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-4">
            {recipe.title}
          </h1>

          <FloralDivider variant="vine" />

          <DecorativeFrame className="mt-6">
            <div className="p-6 space-y-6">

              {/* Image */}
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full rounded-xl shadow-md"
                />
              )}

              {/* SUMMARY (Spoonacular only) */}
              {recipe.source === "spoonacular" && recipe.summary && (
                <div
                  className="text-[#5f3c43] leading-relaxed bg-[#f7e6c4]/40 p-4 rounded-xl shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: convertRelatedLinks(recipe.summary),
                  }}
                />
              )}

              <FloralDivider variant="floral" />

              {/* INGREDIENTS */}
              <h2 className="text-xl font-bold text-[#1b302c] mt-2">Ingredients</h2>

              {recipe.servings && (
                <p className="text-[#5f3c43] italic mb-2">
                  Makes / Serves:{" "}
                  <span className="font-bold serving-highlight">
                    {recipe.servings}
                  </span>
                </p>
              )}

              <ul className="list-disc list-inside text-[#1b302c] space-y-1">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing.original}</li>
                ))}
              </ul>

              {/* COPY BUTTON */}
              <button
                onClick={() => {
                  const text = `
${recipe.title}
Ingredients:
${recipe.ingredients.map((i) => "- " + i.original).join("\n")}
                  `;
                  navigator.clipboard.writeText(text.trim());
                  alert("Ingredients copied!");
                }}
                className="px-6 py-3 bg-[#3c6150] text-white rounded-xl shadow hover:bg-[#2f4d41]"
              >
                Copy Ingredients
              </button>

              <FloralDivider variant="mushroom" />

              {/* INSTRUCTIONS */}
              <h2 className="text-xl font-bold text-[#1b302c]">Instructions</h2>

              {recipe.instructions.length === 0 ? (
                <p className="text-[#5f3c43] italic">
                  No instructions available.
                </p>
              ) : (
                <ol className="list-decimal list-inside text-[#1b302c] space-y-2 leading-relaxed">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
