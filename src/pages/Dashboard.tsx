import { Link } from "react-router-dom";
import FloralDivider from "../components/FloralDivider";
import { getAllTemplates } from "@/lib/templateLoader";

// Background
import bgMain from "@/assets/backgrounds/bg-main.jpg";

// Banner
import dashboardBanner from "@/assets/banners/dashboard-banner.png";

// Icons
import iconCalc from "@/assets/icons/nav/nav-calculator.png";
import iconGuide from "@/assets/icons/nav/nav-guide.png";
import iconRecipes from "@/assets/icons/nav/nav-recipes.png";
import iconPrint from "@/assets/icons/nav/nav-printables.png";

const templates = getAllTemplates();

export default function Dashboard() {
  return (
    <div
      className="min-h-screen pb-24"
      style={{
        backgroundImage: `url(${bgMain})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ⭐ PAGE BANNER */}
      <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-b-2xl overflow-hidden shadow-xl">
        <img
          src={dashboardBanner}
          alt="Dashboard Banner"
          className="w-full h-52 sm:h-64 md:h-72 object-cover"
        />

        {/* Soft dark overlay */}
        <div className="absolute inset-0 bg-[#1b302c]/35" />

        <h1 className="absolute inset-0 flex items-center justify-center text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-xl">
          The Conversion Kitchen
        </h1>
      </div>

      <FloralDivider variant="vine" size="md" />

      {/* ⭐ QUICK TOOLS */}
      <div className="max-w-4xl mx-auto parchment-card p-6 mt-6 shadow-xl border border-[#e4d5b8] rounded-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#4b3b2f]">
          Quick Tools
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* Calculator */}
          <Link to="/calculator" className="quicktool-item">
            <img src={iconCalc} className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <span>Calculator</span>
          </Link>

          {/* Guide */}
          <Link to="/guide" className="quicktool-item">
            <img src={iconGuide} className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <span>Guide</span>
          </Link>

          {/* Recipes */}
          <Link to="/recipes" className="quicktool-item">
            <img src={iconRecipes} className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <span>Recipes</span>
          </Link>

          {/* Printables */}
          <Link to="/printables" className="quicktool-item">
            <img src={iconPrint} className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <span>Printables</span>
          </Link>
        </div>
      </div>

      {/* ⭐ RECIPE PREVIEW SECTION */}
      <div className="max-w-4xl mx-auto bg-white/90 p-6 rounded-2xl shadow-xl border border-[#e4d5b8] mt-10">
        <h2 className="text-2xl font-semibold mb-2 text-center text-[#4b3b2f]">
          Cozy Recipe Inspiration
        </h2>

        <p className="text-center mb-6 text-[#5f3c43]">
          Explore a few sample recipes crafted for cozy baking days.
        </p>

        <FloralDivider variant="floral" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex flex-col items-center bg-white/95 p-4 rounded-xl shadow-lg border border-[#e4d5b8] hover:shadow-2xl transition"
            >
              <img
                src={t.thumb}
                alt={t.name}
                className="w-full rounded-lg shadow mb-3"
                loading="lazy"
              />

              <p className="text-lg font-medium text-[#4b3b2f] mb-3">
                {t.name}
              </p>

              <Link
                to={`/template/${t.id}`}
                className="w-full py-2 text-center rounded-xl bg-amber-200 hover:bg-amber-300 transition shadow font-semibold text-[#4b3b2f]"
              >
                View Recipe
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
