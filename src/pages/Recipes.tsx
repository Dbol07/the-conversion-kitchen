import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FloralDivider from "@/components/FloralDivider";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY as string;

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
}

/** Build small set of tags for the cards */
function buildTags(r: Recipe): string[] {
  const tags: string[] = [];

  r.diets?.forEach((d) => tags.push(d));
  r.cuisines?.forEach((c) => tags.push(c));

  if (r.veryHealthy) tags.push("healthy");
  if (r.vegetarian) tags.push("vegetarian");
  if (r.vegan) tags.push("vegan");

  return tags.slice(0, 6);
}

/** Apply cozy filter client-side */
function applyCozyFilter(list: Recipe[], cozyOnly: boolean): Recipe[] {
  if (!cozyOnly) return list;

  const cozyKeywords = [
    "dessert",
    "cookie",
    "cake",
    "brownie",
    "pie",
    "cinnamon",
    "muffin",
    "bread",
    "loaf",
    "pancake",
    "waffle",
    "breakfast",
    "sweet",
    "warm",
    "cozy",
  ];

  return list.filter((r) => {
    const title = r.title?.toLowerCase() || "";
    const dishTypes = (r.dishTypes || []).join(" ").toLowerCase();

    return cozyKeywords.some(
      (word) => title.includes(word) || dishTypes.includes(word)
    );
  });
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // search + filters
  const [search, setSearch] = useState("");
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [cozyOnly, setCozyOnly] = useState(false);

  /** Core fetch helper — used for initial load and Apply Filters */
  async function fetchRecipesFromApi(options?: {
    search?: string;
    maxTime?: number | null;
    cuisine?: string;
    diet?: string;
    cozy?: boolean;
  }) {
    const {
      search: s = "",
      maxTime: mt = null,
      cuisine = "",
      diet = "",
      cozy = false,
    } = options || {};

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("apiKey", API_KEY);
      params.set("number", "60"); // Option B – better variety
      params.set("addRecipeInformation", "true");
      params.set("instructionsRequired", "true");

      if (s.trim()) {
        params.set("query", s.trim());
      }
      if (mt) {
        params.set("maxReadyTime", String(mt));
      }
      if (cuisine) {
        params.set("cuisine", cuisine);
      }
      if (diet) {
        params.set("diet", diet);
      }

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const results: Recipe[] = data.results || [];

      setRecipes(results);

      // Apply cozy filter client-side
      const finalList = applyCozyFilter(results, cozy);
      setFiltered(finalList);
    } catch (err) {
      console.error("Error loading recipes:", err);
      setError("Sorry, we couldn't load recipes right now. Please try again.");
      setRecipes([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  // Initial load – no filters, no search
  useEffect(() => {
    fetchRecipesFromApi({ cozy: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply Filters / Search (Hybrid mode)
  async function handleApplyFilters() {
    await fetchRecipesFromApi({
      search,
      maxTime,
      cuisine: selectedCuisine,
      diet: selectedDiet,
      cozy: cozyOnly,
    });
  }

  function handleReset() {
    setSearch("");
    setMaxTime(null);
    setSelectedCuisine("");
    setSelectedDiet("");
    setCozyOnly(false);
    fetchRecipesFromApi({
      search: "",
      maxTime: null,
      cuisine: "",
      diet: "",
      cozy: false,
    });
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <h1 className="text-3xl font-bold text-center text-[#4b3b2f]">
        Recipe Collections
      </h1>

      <FloralDivider variant="vine" size="md" />

      {/* FILTER PANEL */}
      <div className="mt-6 bg-white/90 border border-[#e4d5b8] rounded-xl p-5 shadow">
        <h2 className="text-xl font-semibold text-[#4b3b2f] mb-1 text-center">
          Find Something Cozy to Cook
        </h2>
        <p className="text-sm text-center text-[#5f3c43] mb-4">
          Search by name, then narrow things down by time, cuisine, diet, or
          cozy-bakes only.
        </p>

        {/* Search by name */}
        <label className="block text-sm font-medium mb-1 text-[#4b3b2f]">
          Search by name
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApplyFilters();
            }
          }}
          placeholder="e.g. cinnamon cake"
          className="w-full p-2 rounded-xl border border-[#e4d5b8] bg-[#fffaf4] mb-4"
        />

        {/* Row of selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Max time */}
          <div>
            <label className="text-sm font-medium mb-1 block">Max Time</label>
            <select
              value={maxTime ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setMaxTime(val ? Number(val) : null);
              }}
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

        {/* Cozy toggle */}
        <div className="mt-4 flex items-center gap-2">
          <input
            id="cozy-only"
            type="checkbox"
            checked={cozyOnly}
            onChange={(e) => setCozyOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="cozy-only" className="text-sm text-[#5f3c43]">
            Prefer cozy bakes (desserts, breakfast, warm & comforting dishes)
          </label>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="flex-1 min-w-[140px] px-4 py-2 rounded-xl bg-[#3c6150] text-white font-semibold shadow hover:bg-[#2c493c] transition"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 min-w-[140px] px-4 py-2 rounded-xl bg-[#f2ebd7] text-[#4b3b2f] font-semibold border border-[#e4d5b8] hover:bg-[#e6dcc5] transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center mt-10 text-[#4b3b2f]">
          Loading recipes…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center mt-8 text-[#8b3c3c] bg-[#fde2e2] border border-[#f5c2c2] rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-[#5f3c43]">
              No recipes found. Try loosening your filters or clearing search.
            </p>
          ) : (
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
                    {r.readyInMinutes} min
                    {r.vegetarian && " • vegetarian"}
                    {r.vegan && " • vegan"}
                  </p>

                  <div className="flex flex-wrap gap-1 text-xs text-[#5f3c43]">
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
        </>
      )}
    </div>
  );
}
