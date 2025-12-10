import React from "react";

interface KnowledgeCardProps {
  title: string;
  category: string;
  difficulty?: string;
  summary: string;
  whenToUse?: string;
  howToSpot?: string;
  steps?: string[];
  tips?: string[];
  onClose?: () => void;
}

export default function KnowledgeCard({
  title,
  category,
  difficulty,
  summary,
  whenToUse,
  howToSpot,
  steps,
  tips,
  onClose,
}: KnowledgeCardProps) {
  return (
    <div className="relative max-w-xl mx-auto mt-4 p-4 sm:p-5 rounded-2xl border border-[#e4d5b8] bg-[#fffaf4]/95 shadow-lg">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-[#f2ebd7] text-[#5f3c43] border border-[#e4d5b8] hover:bg-[#e4d5b8]"
        >
          close
        </button>
      )}

      <div className="text-xs uppercase tracking-wide text-[#8b6a50] mb-1">
        {category}
        {difficulty ? ` · ${difficulty}` : null}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-[#4b3b2f] mb-2">
        {title}
      </h3>

      <p className="text-sm text-[#5f3c43] mb-3">{summary}</p>

      {whenToUse && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-[#4b3b2f] mb-1">
            When to use it
          </h4>
          <p className="text-sm text-[#5f3c43]">{whenToUse}</p>
        </div>
      )}

      {howToSpot && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-[#4b3b2f] mb-1">
            How to spot it
          </h4>
          <p className="text-sm text-[#5f3c43]">{howToSpot}</p>
        </div>
      )}

      {steps && steps.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-[#4b3b2f] mb-1">
            Quick how-to
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-[#5f3c43]">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="mt-2 border-t border-dashed border-[#e4d5b8] pt-2">
          <h4 className="text-sm font-semibold text-[#4b3b2f] mb-1">
            Cozy tips
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#5f3c43]">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
