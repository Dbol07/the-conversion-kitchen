import React, { useEffect, useState } from "react";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";
import BgMain from "../assets/backgrounds/bg-main.jpg";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

// ---------------------------
// Cute Cottagecore Filter Lists
// ---------------------------

const CUISINE_TAGS = [
  { id: "italian", label: "🍝 Italian" },
  { id: "mediterranean", label: "🥗 Mediterranean" },
  { id: "asian", label: "🍚 Asian" },
  { id: "american", label: "🍯 Homestyle" },
];

const DIET_TAGS = [
  { id: "vegetarian", label: "🌱 Vegetarian" },
  { id: "vegan", label: "🌿 Vegan" },
  { id: "gluten free", label: "✨ Gluten Free" },
  { id: "ketogenic", label: "🔥 Keto" },
  { id: "paleo", label: "🦴 Paleo" },
];

const TIME_TAGS = [
  { id: "15", label: "⏱ 15 min" },
  { id: "30", label: "⏱ 30 min" },
  { id: "45", label: "⏱ 45 min" },
];

// Cozy baking keywords
const BAKING_KEYWORDS = [
  "cake",
  "cookie",
  "brownie",
  "pie",
  "muffin",
  "bread",
  "tart",
  "cupcake",
  "scone",
  "pastry",
];

// ---------------------------
// Component
// ---------------------------

export default function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [activeCuisines, setActiveCuisines] = useState<string[]>([]);
  const [activeDiets, setActiveDiets] = useState<string[]>([]);
  const [activeTimes, setActiveTimes] = useState<string[]>([]);
  const [bakingOnly, setBakingOnly] = useState(false);

  // ---------------------------
  // Toggle helpers
  // ---------------------------
  function toggleItem(list: string[], setter: (v: string[]) => void, id: string) {
    if (list.includes(id)) {
      setter(list.filter((x) => x !== id));
    } else {
      setter([...list, id]);
    }
  }

  // ---------------------------
  // Reset all filters
  // ---------------------------
  function resetFilters() {
    setSearch("");
    setActiveCuisines([]);
    setActiveDiets([]);
    setActiveTimes([]);
    setBakingOnly(false);
    fetchRecipes(); // reload default results
  }

  // ---------------------------
  // Fetch recipes
  // ---------------------------
  async function fetchRecipes() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("number", "24");
      params.set("addRecipeInformation", "true");
      params.set("apiKey", API_KEY || "");

      if (search.trim()) params.set("query", search.trim());
      if (activeCuisines.length)
        params.set("cuisine", activeCuisines.join(","));
      if (activeDiets.length) params.set("diet", activeDiets.join(","));
      if (activeTimes.length)
        params.set("maxReadyTime", activeTimes[activeTimes.length - 1]);

      // Cozy Baking Only filter
      if (bakingOnly) {
        params.set("includeIngredients", "flour,sugar,butter,eggs");
      }

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Spoonacular error:", errText);
        throw new Error("Failed to fetch recipes");
      }

      const data = await res.json();
      let results = data.results || [];

      // Extra local filtering for baking vibe
      if (bakingOnly) {
        results = results.filter((r: any) => {
          const title = r.title.toLowerCase();
          return BAKING_KEYWORDS.some((kw) => title.includes(kw));
        });
      }

      setRecipes(results);
    } catch (err) {
      console.error(err);
      setError("Unable to load recipes at the moment.");
    } finally {
      setLoading(false);
    }
  }

  // Load on first mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // ---------------------------
  // Render
  // ---------------------------

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgMain})` }}
    >
      <div className="bg-[#1b302c]/40 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Recipes
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Cozy inspiration for your next kitchen adventure
            </p>
          </header>

          <FloralDivider variant="mushroom" />

          {/* SEARCH */}
          <div className="mt-6 mb-4 flex justify-center">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full max-w-md px-4 py-2 rounded-xl shadow-md
                bg-[#faf6f0] text-[#1b302c] border border-[#b8d3d5]
                focus:outline-none focus:ring-2 focus:ring-[#b8d3d5]
              "
            />
          </div>

          {/* FILTER TAGS */}
          <div className="space-y-4">

            {/* Cuisine */}
            <div className="flex flex-wrap gap-2 justify-center">
              {CUISINE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() =>
                    toggleItem(activeCuisines, setActiveCuisines, tag.id)
                  }
                  className={`px-4 py-2 rounded-full border shadow-sm transition
                    ${
                      activeCuisines.includes(tag.id)
                        ? "bg-emerald-200 border-emerald-400"
                        : "bg-[#faf6f0] border-[#b8d3d5]"
                    }
                  `}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Diet */}
            <div className="flex flex-wrap gap-2 justify-center">
              {DIET_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() =>
                    toggleItem(activeDiets, setActiveDiets, tag.id)
                  }
                  className={`px-4 py-2 rounded-full border shadow-sm transition
                    ${
                      activeDiets.includes(tag.id)
                        ? "bg-emerald-200 border-emerald-400"
                        : "bg-[#faf6f0] border-[#b8d3d5]"
                    }
                  `}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Time */}
            <div className="flex flex-wrap gap-2 justify-center">
              {TIME_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleItem(activeTimes, setActiveTimes, tag.id)}
                  className={`px-4 py-2 rounded-full border shadow-sm transition
                    ${
                      activeTimes.includes(tag.id)
                        ? "bg-emerald-200 border-emerald-400"
                        : "bg-[#faf6f0] border-[#b8d3d5]"
                    }
                  `}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Cozy Baking Only Toggle */}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setBakingOnly(!bakingOnly)}
                className={`px-5 py-2 rounded-xl shadow-md transition border
                  ${
                    bakingOnly
                      ? "bg-amber-200 border-amber-400 text-[#4b3b2f]"
                      : "bg-[#faf6f0] border-[#b8d3d5] text-[#1b302c]"
                  }
                `}
              >
                🍰 Cozy Baking Only
              </button>
            </div>

            {/* Apply & Reset */}
            <div className="text-center flex gap-4 justify-center mt-4">
              <button
                onClick={fetchRecipes}
                className="px-6 py-2 bg-emerald-200 hover:bg-emerald-300 text-[#1b302c] rounded-xl shadow-md transition"
              >
                Apply Filters ✨
              </button>

              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-rose-200 hover:bg-rose-300 text-[#4b3b2f] rounded-xl shadow-md transition"
              >
                Reset Filters ♻️
              </button>
            </div>
          </div>

          {/* RESULTS */}
          {loading && (
            <p className="text-white text-center text-lg mt-10">
              Loading recipes…
            </p>
          )}

          {error && (
            <p className="text-red-200 text-center text-lg mt-10">{error}</p>
          )}

          {!loading && !error && (
            <DecorativeFrame className="mt-6">
              <div className="parchment-card p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                  {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to={`/recipes/${recipe.id}`}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-md font-bold text-[#1b302c]">
                          {recipe.title}
                        </h3>
                        <p className="text-xs text-[#5f3c43] mt-1">
                          {recipe.readyInMinutes} min • {recipe.servings} servings
                        </p>
                      </div>
                    </Link>
                  ))}

                </div>

                {recipes.length === 0 && (
                  <p className="text-center text-[#5f3c43] mt-6 text-sm">
                    No recipes found. Try adjusting your filters.
                  </p>
                )}
              </div>
            </DecorativeFrame>
          )}
        </div>
      </div>
    </div>
  );
}
