import React, { useEffect, useState } from "react";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";
import BgMain from "../assets/backgrounds/bg-main.jpg";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

// Spoonacular “random recipes” endpoint
const API_URL = `https://api.spoonacular.com/recipes/random?number=12&apiKey=${API_KEY}`;

export default function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch random recipes on load
  async function fetchRecipes() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);

      if (!res.ok) throw new Error("Failed to fetch recipes");

      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError("Unable to load recipes at the moment.");
    } finally {
      setLoading(false);
    }
  }

  // Filter recipes by title
  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

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

          {/* SEARCH BAR */}
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

          {/* CONTENT */}
          {loading && (
            <p className="text-white text-center text-lg mt-10">Loading recipes…</p>
          )}

          {error && (
            <p className="text-red-200 text-center text-lg mt-10">{error}</p>
          )}

          {!loading && !error && (
            <DecorativeFrame className="mt-4">
              <div className="parchment-card p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                  {filtered.map((recipe) => (
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

                {filtered.length === 0 && (
                  <p className="text-center text-[#5f3c43] mt-6 text-sm">
                    No recipes found. Try searching differently!
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
