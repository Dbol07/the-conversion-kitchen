import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getTemplateById } from "@/lib/templateLoader";
import FloralDivider from "@/components/FloralDivider";

export default function TemplatePreview() {
  const { name } = useParams();
  const template = getTemplateById(name || "");
  const [copied, setCopied] = useState(false);

  if (!template) {
    return (
      <div className="p-6 text-center">
        <p>Template not found.</p>
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
    <div className="max-w-3xl mx-auto p-6 pb-24">
      {/* Image */}
      <img
        src={template.image}
        alt={template.name}
        className="w-full rounded-xl shadow-xl mb-6"
      />

      <h1 className="text-3xl font-bold text-[#4b3b2f] text-center mb-4">
        {template.name}
      </h1>

      <FloralDivider variant="floral" size="md" />

      {/* INGREDIENTS */}
      <div className="bg-white/90 border border-[#e4d5b8] rounded-xl p-5 mt-6 shadow">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">Ingredients</h2>

        <ul className="list-disc pl-6 text-[#5f3c43] space-y-1">
          {template.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>

        <button
          onClick={copyIngredients}
          className="mt-4 w-full py-2 rounded-xl bg-[#2f6e4f] text-white hover:bg-[#26593f] transition font-semibold"
        >
          {copied ? "Copied!" : "Copy Ingredients"}
        </button>
      </div>

      {/* INSTRUCTIONS */}
      {template.instructions && (
        <div className="bg-white/90 border border-[#e4d5b8] rounded-xl p-5 mt-6 shadow">
          <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
            Instructions
          </h2>

          <ol className="list-decimal pl-6 text-[#5f3c43] space-y-2">
            {template.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-8 flex flex-col gap-3">
        <Link
          to="/calculator"
          className="w-full py-3 text-center rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
        >
          Convert Now →
        </Link>

        <Link
          to="/recipes"
          className="w-full py-3 text-center rounded-xl bg-amber-200 text-[#4b3b2f] font-semibold shadow hover:bg-amber-300"
        >
          Browse More Recipes
        </Link>
      </div>
    </div>
  );
}
