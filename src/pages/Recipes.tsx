// src/pages/Recipes.tsx — Hybrid MealDB + Spoonacular Search

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import { mealdbSearch } from "@/utils/mealdb";
import { trackedSpoonFetch, getSpoonUsage } from "@/utils/spoonacularUsage";

import FloralDivider from "@/components/FloralDivider";
import DecorativeFrame from "@/components/DecorativeFrame";

import bgGuide from "@/assets/backgrounds/bg-guide.jpg";
import "@/index.css";

// Unified preview format (MealDB + Spoonacular)
interface RecipePreview {
  id: string;
  title: string;
  image: string;
  source: "mealdb" | "spoonacular";
}

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [query, setQuery] = useState(initialQuery);
  const [filterApplied, setFilterApplied] = useState(false);

  // FORCE re-run when query changes
  const shouldSearch = filterApplied || initialQuery;

  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recipes", query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) return [];

      console.log("[Recipes] Searching MealDB first:", query);

      // 1️⃣ Try TheMealDB Premium (unlimited)
      const mealdb = await mealdbSearch(query);

      if (mealdb.length > 0) {
        console.log("[Recipes] MealDB returned results:", mealdb.length);
        return mealdb;
      }

      console.log("[Recipes] MealDB returned 0… falling back to Spoonacular");

      // 2️⃣ Spoonacular fallback
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        query
      )}&number=10&apiKey=${
        import.meta.env.VITE_SPOONACULAR_API_KEY
      }&instructionsRequired=true&addRecipeInformation=true`;

      const res = await trackedSpoonFetch(url);
      if (!res.ok) {
        console.warn("[Spoonacular] fallback request failed", res.status);
        return [];
      }

      const data = await res.json();

      return (
        data.results?.map((r: any) => ({
          id: r.id.toString(),
          title: r.title,
          image: r.image || "",
          source: "spoonacular" as const,
        })) || []
      );
    },
    enabled: shouldSearch !== "",
    staleTime: 1000 * 60 * 60, // 1 hour (MealDB allows this)
  });

  // Auto-run search if URL has ?search=
  useEffect(() => {
    if (initialQuery) {
      setFilterApplied(true);
      refetch();
    }
    // eslint-disable-next-line
  }, []);

  const usage = getSpoonUsage();

  // Handle Spoonacular rate limit
  const isLimitError =
    error &&
    (error as any).message &&
    ((error as any).message === "SPOON_DAILY_LIMIT" ||
      (error as any).message === "SPOON_RATE_LIMIT");

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        backgroundImage: `url(${bgGuide})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#1b302c]/15 min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-2">
            Recipes
          </h1>

          <FloralDivider variant="vine" />

          <DecorativeFrame className="mt-6">
            <div className="p-6 space-y-6">

              {/* Search Bar */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search recipes…"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#9bc99e] bg-white shadow text-[#1b302c]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <button
                  onClick={() => {
                    setFilterApplied(true);
                    setSearchParams({ search: query });
                    refetch();
                  }}
                  className="px-4 py-3 rounded-xl bg-[#3c6150] text-white shadow hover:bg-[#2f4d41]"
                >
                  Go
                </button>
              </div>

              {/* Spoonacular quota visual (optional) */}
              {usage.isNearLimit && (
                <p className="text-xs text-[#5f3c43] text-right">
                  ⚠ Spoonacular fallback limit: {usage.count}/{usage.dailyLimit}
                </p>
              )}

              {/* Error display */}
              {isLimitError && (
                <div className="bg-[#fde2e1] text-[#7a2626] p-3 rounded-xl text-center shadow">
                  <p className="font-semibold">
                    Spoonacular has hit its free daily limit.
                  </p>
                  <p className="text-xs mt-1">
                    TheMealDB results still work normally.  
                  </p>
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <p className="text-center text-[#1b302c]">Searching…</p>
              )}

              {/* No results */}
              {!isLoading && results?.length === 0 && (
                <p className="text-center text-[#1b302c]">
                  No recipes found. Try something else.
                </p>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results?.map((recipe: RecipePreview) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}?source=${recipe.source}`}
                    className="block bg-white/70 rounded-xl shadow hover:shadow-md 
                               overflow-hidden transition border border-[#d9c7a3]"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-44 object-cover recipe-thumb"
                    />

                    <div className="p-4">
                      <h3 className="font-bold text-[#1b302c] text-lg leading-snug">
                        {recipe.title}
                      </h3>

                      {/* Optional small source badge */}
                      <span className="source-badge mt-2 inline-block">
                        {recipe.source === "mealdb" ? "MealDB" : "Spoonacular"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
