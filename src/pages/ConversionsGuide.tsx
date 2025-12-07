import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FloralDivider from "@/components/FloralDivider";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  cuisines: string[];
  diets: string[];
  veryHealthy: boolean;
  vegetarian: boolean;
  vegan: boolean;
}

/* ---------------------------
   TAG GENERATION (Restored)
---------------------------- */

function buildTags(r: Recipe) {
  const tags: string[] = [];

  // diets
  r.diets?.forEach((d) => tags.push(d));

  // cuisines
  r.cuisines?.forEach((c) => tags.push(c));

  // healthy?
  if (r.veryHealthy) tags.push("healthy");

  // quick-prep flag
  if (r.readyInMinutes <= 20) tags.push("quick");

  // veg flags
  if (r.vegetarian) tags.push("vegetarian");
  if (r.vegan) tags.push("vegan");

  return tags.slice(0, 6);
}

/* ---------------------------
   COMPONENT
---------------------------- */

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [cozyOnly, setCozyOnly] = useState(false);

  // prevent constant API calls — simple memory cache
  const cacheKey = "recipesCacheV1";

  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);

      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setRecipes(parsed);
        setFiltered(parsed);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
            import.meta.env.VITE_SPOONACULAR_KEY
          }&number=40&addRecipeInformation=true`
        );

        const data = await res.json();
        const list: Recipe[] = data.results;

        sessionStorage.setItem(cacheKey, JSON.stringify(list));

        setRecipes(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error loading recipes:", err);
      }

      setLoading(false);
    }

    loadRecipes();
  }, []);

  /* ---------------------------
     FILTER HANDLER
  ---------------------------- */

  function applyFilters() {
    let out = [...recipes];

    if (maxTime) {
      out = out.filter((r) => r.readyInMinutes <= maxTime);
    }

    if (selectedCuisine) {
      out = out.filter((r) =>
        r.cuisines?.includes(selectedCuisine.toLowerCase())
      );
    }

    if (selectedDiet) {
      out = out.filter((r) => r.diets?.includes(selectedDiet.toLowerCase()));
    }

    if (cozyOnly) {
      // Custom "cozy baking" rule
      out = out.filter((r) =>
        ["dessert", "baking", "breakfast"].some((word) =>
          r.title.toLowerCase().includes(word)
        )
      );
    }

    setFiltered(out);
  }

  function resetFilters() {
    setMaxTime(null);
    setSelectedCuisine("");
    setSelectedDiet("");
    setCozyOnly(false);
    setFiltered(recipes);
  }

  /* ---------------------------
     UI
  ---------------------------- */

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <h1 className="text-3xl font-bold text-center text-[#4b3b2f]">
        Recipe Collections
      </h1>

      <FloralDivider variant="vine" size="md" />

      {/* FILTERS */}
      <div className="mt-6 bg-white/90 border border-[#e4d5b8] rounded-xl p-5 shadow">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-3">
          Filter Recipes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Max time */}
          <div>
            <label className="text-sm font-medium mb-1 block">Max Time</label>
            <select
              value={maxTime || ""}
              onChange={(e) => setMaxTime(Number(e.target.value) || null)}
              className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
            >
              <option value="">Any</option>
              <option value="15">≤ 15 minutes</option>
              <option value="30">≤ 30 minutes</option>
              <option value="45">≤ 45 minutes</option>
            </select>
          </div>

          {/* Cuisine */}
          <div>
            <label className="text-sm font-medium mb-1 block">Cuisine</label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
            >
              <option value="">Any</option>
              <option value="italian">Italian</option>
              <option value="american">American</option>
              <option value="asian">Asian</option>
              <option value="french">French</option>
              <option value="mediterranean">Mediterranean</option>
            </select>
          </div>

          {/* Diet */}
          <div>
            <label className="text-sm font-medium mb-1 block">Diet</label>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
            >
              <option value="">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten free">Gluten-Free</option>
              <option value="ketogenic">Keto</option>
            </select>
          </div>
        </div>

        {/* COZY TOGGLE */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={cozyOnly}
            onChange={(e) => setCozyOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm text-[#5f3c43]">
            Cozy Baking Only (desserts, breakfast, warm vibes)
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={applyFilters}
            className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Apply Filters
          </button>

          <button
            onClick={resetFilters}
            className="flex-1 py-2 rounded-xl bg-[#f2ebd7] text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-[#e4d5b8]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-10 text-[#4b3b2f]">Loading recipes…</div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filtered.map((r) => (
            <Link
              key={r.id}
              to={`/recipes/${r.id}`}
              className="bg-white/90 border border-[#e4d5b8] rounded-xl shadow hover:shadow-lg transition p-3"
            >
              <img
                src={r.image}
                className="w-full rounded-lg mb-3 shadow"
                alt={r.title}
              />

              <h3 className="text-lg font-semibold text-[#4b3b2f] mb-1">
                {r.title}
              </h3>

              <p className="text-sm text-[#5f3c43] mb-2">
                Ready in {r.readyInMinutes} min
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2">
                {buildTags(r).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#faf3e2] text-[#4b3b2f] rounded-full text-xs border border-[#e4d5b8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
