import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FloralDivider from "@/components/FloralDivider";
import DecorativeFrame from "@/components/DecorativeFrame";

import bgGuide from "@/assets/backgrounds/bg-guide.jpg";

// Detect multi-word capitalized phrases → convert into internal search links
function convertRelatedLinks(text: string) {
  return text.replace(
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,6})\b/g,
    (match) =>
      `<a class="related-chip" href="/recipes?search=${encodeURIComponent(
        match
      )}">${match}</a>`
  );
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${
        import.meta.env.VITE_SPOONACULAR_API_KEY
      }&includeNutrition=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch recipe");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading recipe…</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error loading recipe.</p>;
  if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

  return (
    <div
      className="min-h-screen w-full pb-28"
      style={{
        backgroundImage: `url(${bgGuide})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Lightened overlay */}
      <div className="bg-[#1b302c]/15 min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Header + Back Button */}
          <button
            className="mb-4 px-4 py-2 bg-[#b8d3d5] text-[#1b302c] rounded-xl shadow hover:bg-[#9bc9ae]"
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
              {/* Recipe image */}
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full rounded-xl shadow-md"
                />
              )}

              {/* Summary text (with styled box & clickable links) */}
              <div
                className="text-[#5f3c43] leading-relaxed bg-[#f7e6c4]/40 p-4 rounded-xl shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: convertRelatedLinks(recipe.summary || ""),
                }}
              />

              <FloralDivider variant="floral-thin" />

              {/* INGREDIENTS */}
              <h2 className="text-xl font-bold text-[#1b302c] mt-2">Ingredients</h2>

              {/* Highlight serving size */}
              {recipe.servings && (
                <p className="text-[#5f3c43] italic mb-2">
                  Makes / Serves:{" "}
                  <span className="font-bold serving-highlight">
                    {recipe.servings}
                  </span>
                </p>
              )}

              <ul className="list-disc list-inside text-[#1b302c] space-y-1">
                {recipe.extendedIngredients?.map((ingredient: any) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>

              {/* Copy Ingredients Button */}
              <button
                onClick={() => {
                  const textToCopy = `
${recipe.title}
Ingredients (serves ${recipe.servings}):
${recipe.extendedIngredients?.map((i: any) => `- ${i.original}`).join("\n")}
                  `;
                  navigator.clipboard.writeText(textToCopy.trim());
                  alert("Ingredients copied!");
                }}
                className="px-6 py-3 bg-[#3c6150] text-white rounded-xl shadow hover:bg-[#2f4d41] ease-in-out duration-300"
              >
                Copy Ingredients
              </button>

              <FloralDivider variant="mushroom-thin" />

              {/* INSTRUCTIONS */}
              <h2 className="text-xl font-bold text-[#1b302c]">Instructions</h2>

              <ol className="list-decimal list-inside text-[#1b302c] space-y-2 leading-relaxed">
                {recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => (
                  <li key={step.number}>{step.step}</li>
                ))}
              </ol>

              <FloralDivider variant="floral" />

              {/* NUTRITION */}
              <h2 className="text-xl font-bold text-[#1b302c]">Nutrition Highlights</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {recipe.nutrition?.nutrients?.slice(0, 8).map((nutrient: any, index: number) => (
                  <div
                    key={index}
                    className="bg-[#f7e6c4]/60 p-4 rounded-xl shadow text-[#5f3c43]"
                  >
                    <p className="font-bold">{nutrient.name}</p>
                    <p>{nutrient.amount} {nutrient.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
