// src/components/RecipeCard.tsx
// Unified card for MealDB + Spoonacular recipes

import { Link } from "react-router-dom";
import "@/index.css"; // ensures source-badge + recipe-thumb styles apply

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  source: "mealdb" | "spoonacular";
}

export default function RecipeCard({ id, title, image, source }: RecipeCardProps) {
  return (
    <Link
      to={`/recipes/${id}?source=${source}`}
      className="recipe-card block bg-white/70 rounded-xl shadow 
                 hover:shadow-md overflow-hidden transition border 
                 border-[#d9c7a3]"
    >
      {/* Thumbnail */}
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover recipe-thumb"
      />

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-[#1b302c] text-lg leading-snug">{title}</h3>

        <span className={`source-badge ${source} mt-2 inline-block`}>
          {source === "mealdb" ? "MealDB" : "Spoonacular"}
        </span>
      </div>
    </Link>
  );
}
