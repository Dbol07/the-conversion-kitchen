import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getTemplateById } from "@/lib/templateLoader";
import FloralDivider from "@/components/FloralDivider";
import DecorativeFrame from "@/components/DecorativeFrame";
import recipesBanner from "@/assets/banners/recipes-banner.png";

export default function TemplatePreview() {
  const { name } = useParams();
  const template = getTemplateById(name || "");
  const [copied, setCopied] = useState(false);

  if (!template) {
    return (
      <div className="p-6 text-center min-h-screen flex items-center justify-center">
        <div className="bg-white/90 border border-[#e4d5b8] p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-[#4b3b2f] mb-2">
            Template not found
          </h2>
          <p className="text-[#5f3c43] mb-4">
            The recipe template you're looking for doesn't exist or was moved.
          </p>
          <Link
            to="/"
            className="text-emerald-700 font-semibold underline hover:text-emerald-900"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  async function copyIngredients() {
    try {
      await navigator.clipboard.writeText(template.ingredients.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="min-h-screen pb-24 bg-[#1b302c]/20">

      {/* ⭐ PAGE BANNER */}
      <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-b-2xl overflow-hidden shadow-xl">
        <img
          src={recipesBanner}
          alt="Template Banner"
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-[#1b302c]/35" />

        <h1 className="absolute inset-0 flex items-center justify-center text-center
                       text-3xl sm:text-4xl font-bold text-white drop-shadow-xl px-4">
          {template.name}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4">

        <DecorativeFrame>
          <div className="parchment-card p-6">

            {/* IMAGE */}
            <img
              src={template.image}
              alt={template.name}
              className="w-full rounded-xl shadow-xl mb-6"
            />

            <FloralDivider variant="floral" size="md" />

            {/* INGREDIENTS */}
            <div className="bg-[#fff7eb]/90 border border-[#e4d5b8] rounded-2xl p-6 mt-8 shadow">
              <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
                Ingredients
              </h2>

              <ul className="list-disc pl-6 text-[#5f3c43] space-y-1">
                {template.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>

              <button
                onClick={copyIngredients}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#2f6e4f] text-white font-semibold
                           shadow hover:bg-[#26593f] transition"
              >
                {copied ? "Copied!" : "Copy Ingredients"}
              </button>
            </div>

            {/* INSTRUCTIONS */}
            {template.instructions && (
              <div className="bg-[#fff7eb]/90 border border-[#e4d5b8] rounded-2xl p-6 mt-8 shadow">
                <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
                  Instructions
                </h2>

                <ol className="list-decimal pl-6 text-[#5f3c43] space-y-2 leading-relaxed">
                  {template.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <FloralDivider variant="vine" size="sm" />

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/calculator"
                className="w-full py-3 text-center rounded-xl bg-emerald-600 
                           text-white font-semibold shadow hover:bg-emerald-700"
              >
                Convert Now →
              </Link>

              <Link
                to="/recipes"
                className="w-full py-3 text-center rounded-xl bg-amber-200 text-[#4b3b2f] 
                           font-semibold shadow hover:bg-amber-300"
              >
                Browse More Recipes
              </Link>
            </div>
          </div>
        </DecorativeFrame>
      </div>
    </div>
  );
}
