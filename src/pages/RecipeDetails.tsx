import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FloralDivider from "@/components/FloralDivider";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${
          import.meta.env.VITE_SPOONACULAR_KEY
        }`
      );
      const data = await res.json();
      setRecipe(data);
    }
    load();
  }, [id]);

  if (!recipe) return <div className="p-6 text-center">Loading…</div>;

  const ingredientsText = recipe.extendedIngredients
    .map((i: any) => `${i.original}`)
    .join("\n");

  async function copyIngredients() {
    try {
      await navigator.clipboard.writeText(ingredientsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pb-24">
      <img
        src={recipe.image}
        className="w-full rounded-xl shadow-xl mb-6"
        alt={recipe.title}
      />

      <h1 className="text-3xl font-bold text-center text-[#4b3b2f] mb-4">
        {recipe.title}
      </h1>

      {/* Highlighted Summary Links */}
      <div
        className="prose prose-sm max-w-none text-[#5f3c43] mb-4"
        dangerouslySetInnerHTML={{
          __html: recipe.summary.replace(
            /<a /g,
            `<a class="text-emerald-700 underline hover:text-emerald-900" `
          ),
        }}
      />

      <FloralDivider variant="floral" size="md" />

      {/* INGREDIENTS */}
      <div className="bg-white/90 border border-[#e4d5b8] rounded-xl p-5 mt-6 shadow">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">Ingredients</h2>

        <ul className="list-disc pl-6 text-[#5f3c43] space-y-1">
          {recipe.extendedIngredients.map((i: any) => (
            <li key={i.id}>{i.original}</li>
          ))}
        </ul>

        <button
          onClick={copyIngredients}
          className="mt-4 w-full py-2 rounded-xl bg-[#2f6e4f] text-white hover:bg-[#26593f] transition font-semibold"
        >
          {copied ? "Copied!" : "Copy Ingredients"}
        </button>

        <Link
          to="/calculator"
          className="mt-3 w-full block text-center py-2 rounded-xl bg-amber-200 text-[#4b3b2f] hover:bg-amber-300 font-semibold shadow"
        >
          Convert Now →
        </Link>
      </div>

      {/* INSTRUCTIONS */}
      <div className="bg-white/90 border border-[#e4d5b8] rounded-xl p-5 mt-6 shadow">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
          Instructions
        </h2>

        <ol className="list-decimal pl-6 text-[#5f3c43] space-y-2">
          {recipe.analyzedInstructions[0]?.steps.map((s: any) => (
            <li key={s.number}>{s.step}</li>
          )) || <p>No instructions found.</p>}
        </ol>
      </div>
    </div>
  );
}
