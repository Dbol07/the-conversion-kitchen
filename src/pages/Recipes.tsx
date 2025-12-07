import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FloralDivider from "@/components/FloralDivider";
import recipesBanner from "@/assets/banners/recipes-banner.png";
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY as string;

/* ------------ Recipe Result Type ------------ */
interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  cuisines: string[];
  diets: string[];
  dishTypes: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  veryHealthy?: boolean;
}

/* ------------ Tag Formatter ------------ */
function buildTags(r: Recipe): string[] {
  const tags: string[] = [];

  r.cuisines?.forEach((c) => tags.push(c));
  r.diets?.forEach((d) => tags.push(d));

  if (r.vegetarian) tags.push("Vegetarian");
  if (r.vegan) tags.push("Vegan");
  if (r.veryHealthy) tags.push("Healthy");

  return tags.slice(0, 6);
}

/* ------------ Cozy Filter ------------ */
function applyCozyFilter(list: Recipe[], cozy: boolean): Recipe[] {
  if (!cozy) return list;

  const cozyWords = [
    "cookie", "cookies", "cake", "brownie", "pie", "bread", "loaf",
    "cinnamon", "sweet", "warm", "breakfast", "dessert", "bake"
  ];

  return list.filter((r) => {
    const t = r.title.toLowerCase();
    return cozyWords.some((w) => t.includes(w));
  });
}

export default function Recipes() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get("search") ?? "";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Filters ---------- */
  const [search, setSearch] = useState(initialSearch);
  const [maxTime, setMaxTime] = useState<number | null>(null);

  const cuisines = ["Italian", "American", "Asian", "French", "Mediterranean"];
  const diets = ["Vegan", "Vegetarian", "Keto", "Gluten Free"];

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [cozyOnly, setCozyOnly] = useState(false);

  /* ---------- Scroll to top ---------- */
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const listener = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Fetch Function ---------- */
  async function fetchRecipes(opts?: {
    q?: string;
    maxTime?: number | null;
    cuisines?: string[];
    diets?: string[];
    cozy?: boolean;
  }) {
    const { q = "", maxTime, cuisines = [], diets = [], cozy = false } = opts || {};

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("apiKey", API_KEY);
      params.set("number", "60");
      params.set("addRecipeInformation", "true");
      params.set("instructionsRequired", "true");

      if (q.trim()) params.set("query", q.trim());
      if (maxTime) params.set("maxReadyTime", String(maxTime));
      if (cuisines.length > 0) params.set("cuisine", cuisines.join(","));
      if (diets.length > 0) params.set("diet", diets.join(","));

      const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      let results: Recipe[] = data.results || [];

      /* Apply cozy filter */
      results = applyCozyFilter(results, cozy);

      setRecipes(results);
      setFiltered(results);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Sorry, we couldn't load recipes right now. Please try again.");
      setRecipes([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Initial Load (Hybrid Mode) ---------- */
  useEffect(() => {
    fetchRecipes({
      q: initialSearch,
      maxTime,
      cuisines: selectedCuisines,
      diets: selectedDiets,
      cozy: cozyOnly,
    });
  }, []); // eslint-disable-line

  /* ---------- Apply Filters ---------- */
  function applyFilters() {
    fetchRecipes({
      q: search,
      maxTime,
      cuisines: selectedCuisines,
      diets: selectedDiets,
      cozy: cozyOnly,
    });
  }

  function resetFilters() {
    setSearch("");
    setMaxTime(null);
    setSelectedCuisines([]);
    setSelectedDiets([]);
    setCozyOnly(false);

    fetchRecipes({
      q: "",
      maxTime: null,
      cuisines: [],
      diets: [],
      cozy: false,
    });
  }

  /* ---------- Toggle Functions ---------- */
  function toggleCuisine(c: string) {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function toggleDiet(d: string) {
    setSelectedDiets((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="max-w-5xl mx-auto p-0 pb-24">

      {/* ⭐ PAGE BANNER */}
      <div
        className="w-full h-40 sm:h-48 md:h-56 relative flex items-center justify-center mb-4 rounded-b-2xl overflow-hidden shadow"
      >
        <img
          src={recipesBanner}
          alt="Recipes Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1b302c]/35" />

        <h1 className="relative z-10 text-3xl sm:text-4xl font-bold text-white drop-shadow-lg text-center">
          Recipe Collections
        </h1>
      </div>

      <FloralDivider variant="vine" size="md" />

      {/* FILTER PANEL */}
      <div className="mt-6 bg-white/90 border border-[#e4d5b8] rounded-xl p-5 shadow">

        {/* Header */}
        <h2 className="text-xl font-semibold text-center text-[#4b3b2f] mb-2">
          Find Something Cozy to Cook
        </h2>

        {/* ⭐ SEARCH BAR WITH GO BUTTON */}
        <div className="relative w-full">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full p-3 pr-16 rounded-xl border border-[#e4d5b8] bg-[#fffaf4] text-[#4b3b2f]"
            placeholder="e.g. cinnamon cake"
          />
          <button
            onClick={applyFilters}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 rounded-lg bg-[#3c6150] text-white font-semibold shadow hover:bg-[#2c493c] transition"
          >
            Go →
          </button>
        </div>

        {/* (KEEP the rest of filter panel here: maxTime, pills, cozy toggle, buttons) */}

        {/* MAX TIME */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Max Time</label>
          <select
            value={maxTime ?? ""}
            onChange={(e) =>
              setMaxTime(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2 rounded-xl border bg-[#fffaf4] border-[#e4d5b8]"
          >
            <option value="">Any</option>
            <option value="15">≤ 15 minutes</option>
            <option value="30">≤ 30 minutes</option>
            <option value="45">≤ 45 minutes</option>
          </select>
        </div>

        {/* CUISINE PILLS */}
        <p className="font-medium text-sm text-[#4b3b2f]">Cuisine</p>
        <div className="flex flex-wrap gap-2 mt-1 mb-4">
          {cuisines.map((c) => {
            const active = selectedCuisines.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
               className={`px-4 py-1.5 rounded-full border text-sm shadow-sm transition-transform
  ${
    active
      ? "bg-[#3c6150] text-white border-[#3c6150] scale-[1.03] shadow-md"
      : "bg-[#f7f1e3] text-[#4b3b2f] border-[#d9c7a3] hover:bg-[#f0e6cf] shadow"
  }`}

              >
                {c}
              </button>
            );
          })}
        </div>

        {/* DIET PILLS */}
        <p className="font-medium text-sm text-[#4b3b2f]">Diet</p>
        <div className="flex flex-wrap gap-2 mt-1 mb-4">
          {diets.map((d) => {
            const active = selectedDiets.includes(d);
            return (
              <button
  key={d}
  type="button"
  onClick={() => toggleDiet(d)}
  className={`px-4 py-1.5 rounded-full border text-sm shadow-sm transition-transform
    ${
      active
        ? "bg-[#3c6150] text-white border-[#3c6150] scale-[1.03] shadow-md"
        : "bg-[#f7f1e3] text-[#4b3b2f] border-[#d9c7a3] hover:bg-[#f0e6cf] shadow"
    }`}
>
  {d}
</button>

            );
          })}
        </div>

        {/* COZY TOGGLE */}
        <label className="flex items-center gap-2 text-[#5f3c43] mt-2">
          <input
            type="checkbox"
            checked={cozyOnly}
            onChange={(e) => setCozyOnly(e.target.checked)}
          />
          Prefer cozy bakes only ✨
        </label>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={applyFilters}
            className="flex-1 bg-[#3c6150] text-white py-2 rounded-xl shadow hover:bg-[#2c493c]"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="flex-1 bg-[#f2ebd7] text-[#4b3b2f] border border-[#d9c7a3] py-2 rounded-xl shadow"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ERROR */}
      {!loading && error && (
        <div className="text-center text-[#8b3c3c] bg-[#fde2e2] border border-[#f5c2c2] mt-6 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* RESULTS GRID */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="text-center text-[#5f3c43] mt-10">
              No recipes found. Try adjusting your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {filtered.map((r) => (
                <Link
                  to={`/recipes/${r.id}`}
                  key={r.id}
                  className="bg-white/90 border border-[#e4d5b8] rounded-xl shadow hover:shadow-lg transition p-3"
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="rounded-lg w-full mb-3 shadow"
                  />
                  <h3 className="text-lg font-semibold text-[#4b3b2f]">
                    {r.title}
                  </h3>
                  <p className="text-[#5f3c43] text-sm mb-2">
                    {r.readyInMinutes} min
                  </p>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1">
                    {buildTags(r).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-[#faf3e2] border border-[#e4d5b8] rounded-full text-[#4b3b2f]"
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

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-24 right-4 bg-[#3c6150] text-white rounded-full w-12 h-12 shadow-xl text-xl hover:bg-[#2c493c]"
        >
          ↑
        </button>
      )}

      {loading && (
        <p className="text-center text-[#4b3b2f] mt-10">Loading recipes…</p>
      )}
    </div>
  );
}
