import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import FloralDivider from "@/components/FloralDivider";
import BackToTop from "@/components/BackToTop";

import { mealdbSearch } from "@/utils/mealdb";
import { trackedSpoonFetch } from "@/utils/spoonacularUsage";

import recipesBanner from "@/assets/banners/recipes-banner.png";
import bgRecipes from "@/assets/backgrounds/bg-recipes.png";

import "@/index.css";

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [query, setQuery] = useState(initialQuery);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ----------------------------------------------
     SEARCH FORM SUBMIT
  ----------------------------------------------- */
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams({ search: query });
  }

  /* ----------------------------------------------
     HYBRID SEARCH FUNCTION
  ----------------------------------------------- */
  async function fetchRecipes(q: string) {
    const clean = q.trim();
    if (!clean) {
      setRecipes([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let combined: any[] = [];

      /* ------------------------------
         1) MealDB first
      ------------------------------- */
      console.log("[Recipes] Searching MealDB:", clean);

      try {
        const hits = await mealdbSearch(clean);

        if (hits.length) {
          console.log("[Recipes] MealDB returned:", hits.length);

          combined = hits.map((m) => ({
            id: m.id,
            title: m.title,
            image: m.image,
            readyInMinutes: 30,
            cuisines: m.area ? [m.area] : [],
            diets: [],
            dishTypes: m.category ? [m.category] : [],
            vegetarian: false,
            vegan: false,
            veryHealthy: false,
            source: "mealdb",
          }));
        }
      } catch (err) {
        console.warn("[Recipes] MealDB error:", err);
      }

      const gotMealDb = combined.length > 0;

      /* ------------------------------
         2) Spoonacular fallback
      ------------------------------- */
      if (!gotMealDb) {
        console.log("[Recipes] Falling back to Spoonacular…");

        const params = new URLSearchParams();
        params.set("query", clean);
        params.set("addRecipeInformation", "true");
        params.set("number", "24");

        const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
        const res = await trackedSpoonFetch(url);

        if (!res.ok) throw new Error("Spoonacular request failed");

        const data = (await res.json()) as { results?: any[] };
        const results = data.results ?? [];

        combined = results.map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image,
          readyInMinutes: r.readyInMinutes ?? 0,
          cuisines: r.cuisines ?? [],
          diets: r.diets ?? [],
          dishTypes: r.dishTypes ?? [],
          vegetarian: r.vegetarian,
          vegan: r.vegan,
          veryHealthy: r.veryHealthy,
          source: "spoonacular",
        }));
      }

      setRecipes(combined);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading recipes.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------
     RUN SEARCH WHEN URL PARAM CHANGES
  ----------------------------------------------- */
  useEffect(() => {
    const q = searchParams.get("search") || "";
    fetchRecipes(q);
  }, [searchParams]);

  /* ----------------------------------------------
     RENDER
  ----------------------------------------------- */
  return (
    <div
      className="min-h-screen pb-28 pt-4"
      style={{
        backgroundImage: `url(${bgRecipes})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Banner */}
      <div className="relative w-full max-w-3xl mx-auto">
        <img
          src={recipesBanner}
          className="w-full rounded-2xl shadow-xl object-cover"
          alt="Recipes Banner"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Recipes
          </h1>
        </div>
      </div>

      <FloralDivider variant="vine" size="sm" />

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearchSubmit}
        className="max-w-xl mx-auto mt-6 bg-[#fffaf4] p-4 rounded-2xl border border-[#e4d5b8] shadow-md"
      >
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes…"
            className="flex-1 p-3 rounded-xl border border-[#d8c6a4] bg-white text-[#4b3b2f]"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-emerald-700 text-white font-semibold rounded-xl shadow hover:bg-emerald-800"
          >
            Go
          </button>
        </div>
      </form>

      {/* Loading / Error */}
      <div className="max-w-4xl mx-auto mt-6">
        {loading && (
          <p className="text-center text-[#4b3b2f] text-lg font-medium">
            Searching…
          </p>
        )}

        {error && (
          <div className="text-center text-red-700 bg-red-100 border border-red-300 p-3 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* RESULTS GRID */}
      <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {recipes.map((r) => (
          <Link
            key={r.id}
            to={`/recipes/${r.id}?source=${r.source}`}
            className="block group"
          >
            <div className="bg-white/80 rounded-2xl overflow-hidden shadow-md border border-[#e4d5b8] hover:shadow-xl transition">
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-56 object-cover group-hover:scale-[1.03] transition"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#4b3b2f] group-hover:text-emerald-700 transition">
                  {r.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* NO RESULTS */}
      {!loading && !error && recipes.length === 0 && (
        <p className="text-center text-[#4b3b2f] text-lg mt-10">
          Try searching for something delicious!
        </p>
      )}

      <BackToTop />
    </div>
  );
}
