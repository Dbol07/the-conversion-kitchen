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
  dishTypes: string[];
  summary?: string;
}

/* ---------------------------
   COZY HELPER
---------------------------- */

function isCozyRecipe(r: Recipe) {
  const cozyDishTypes = [
    "dessert",
    "breakfast",
    "brunch",
    "bread",
    "snack",
    "teatime",
  ];

  const lowerTypes = (r.dishTypes || []).map((t) => t.toLowerCase());
  if (cozyDishTypes.some((w) => lowerTypes.includes(w))) return true;

  const title = r.title.toLowerCase();
  const cozyWords = [
    "soup",
    "stew",
    "casserole",
    "cookie",
    "cake",
    "muffin",
    "cinnamon",
    "cozy",
    "warm",
    "spice",
  ];
  if (cozyWords.some((w) => title.includes(w))) return true;

  return false;
}

/* ---------------------------
   TAG GENERATION
---------------------------- */

function buildTags(r: Recipe) {
  const tags: string[] = [];

  // diets
  r.diets?.forEach((d) => tags.push(d));

  // cuisines
  r.cuisines?.forEach((c) => tags.push(c));

  // dishTypes (a few cozy-friendly ones)
  (r.dishTypes || [])
    .filter((t) =>
      ["dessert", "breakfast", "bread", "snack", "soup"].includes(
        t.toLowerCase()
      )
    )
    .forEach((t) => tags.push(t));

  // quick / weeknight
  if (r.readyInMinutes <= 20) tags.push("quick");
  else if (r.readyInMinutes <= 35) tags.push("weeknight");

  // healthy
  if (r.veryHealthy) tags.push("healthy");

  // veg flag
  if (r.vegetarian && !r.vegan) tags.push("vegetarian");
  if (r.vegan) tags.push("vegan");

  // cozy marker
  if (isCozyRecipe(r)) tags.push("cozy");

  return tags.slice(0, 6);
}

/* ---------------------------
   MAIN COMPONENT
---------------------------- */

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [cozyPreferred, setCozyPreferred] = useState(false);

  const cacheKey = "recipesCache_v2";

  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);

      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed: Recipe[] = JSON.parse(cached);
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
        const list: Recipe[] = data.results || [];

        sessionStorage.setItem(cacheKey, JSON.stringify(list));
        setRecipes(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error loading recipes:", err);
        setRecipes([]);
        setFiltered([]);
      }

      setLoading(false);
    }

    loadRecipes();
  }, []);

  /* ---------------------------
     HYBRID FILTERING (Option C)
  ---------------------------- */

  function applyFilters() {
    let out = [...recipes];

    const searchTerm = search.trim().toLowerCase();

    // 1) SEARCH: strict
    if (searchTerm) {
      out = out.filter((r) => {
        const title = r.title?.toLowerCase() || "";
        const summary = r.summary?.toLowerCase() || "";
        return (
          title.includes(searchTerm) ||
          summary.includes(searchTerm)
        );
      });
    }

    // 2) Cuisine: strict, case-insensitive
    if (selectedCuisine) {
      const chosen = selectedCuisine.toLowerCase();
      out = out.filter((r) =>
        (r.cuisines || [])
          .map((c) => c.toLowerCase())
          .includes(chosen)
      );
    }

    // 3) Diet: strict, case-insensitive
    if (selectedDiet) {
      const chosen = selectedDiet.toLowerCase();
      out = out.filter((r) =>
        (r.diets || [])
          .map((d) => d.toLowerCase())
          .includes(chosen)
      );
    }

    // 4) Max time: strict
    if (maxTime) {
      out = out.filter((r) => r.readyInMinutes <= maxTime);
    }

    // 5) Cozy preference: SOFT BOOST (not a filter)
    if (cozyPreferred) {
      out = out
        .slice()
        .sort((a, b) => Number(isCozyRecipe(b)) - Number(isCozyRecipe(a)));
    }

    setFiltered(out);
  }

  function resetFilters() {
    setSearch("");
    setMaxTime(null);
    setSelectedCuisine("");
    setSelectedDiet("");
    setCozyPreferred(false);
    setFiltered(recipes);
  }

  /* ---------------------------
     RENDER
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
          Find Something Cozy to Cook
        </h2>

        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#4b3b2f] mb-1">
            Search by name
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. cinnamon, soup, cake..."
            className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
          />
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Max time */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Max Time
            </label>
            <select
              value={maxTime || ""}
              onChange={(e) =>
                setMaxTime(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
            >
              <option value="">Any</option>
              <option value="20">≤ 20 minutes</option>
              <option value="30">≤ 30 minutes</option>
              <option value="45">≤ 45 minutes</option>
            </select>
          </div>

          {/* Cuisine */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cuisine
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4]"
            >
              <option value="">Any</option>
              <option value="italian">Italian</option>
              <option value="american">American</option>
              <option value="french">French</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="asian">Asian</option>
            </select>
          </div>

          {/* Diet */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Diet
            </label>
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

        {/* Cozy toggle */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={cozyPreferred}
            onChange={(e) => setCozyPreferred(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm text-[#5f3c43]">
            Prefer cozy bakes (desserts, breakfast, warm & comforting dishes)
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
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
        <div className="text-center mt-10 text-[#4b3b2f]">
          Loading recipes…
        </div>
      )}

      {/* RESULTS GRID */}
      {!loading && (
        <>
          {filtered.length === 0 && (
            <div className="text-center mt-10 text-[#5f3c43]">
              No recipes found. Try loosening your filters or clearing search.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                className="bg-white/90 border border-[#e4d5b8] rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col"
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

                <div className="flex flex-wrap gap-2 mt-auto">
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
        </>
      )}
    </div>
  );
}
