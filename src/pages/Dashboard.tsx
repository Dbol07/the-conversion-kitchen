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
      className="min-h-screen pb-24 page-transition"
      style={{
        backgroundImage: `url(${bgMain})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* ⭐ Top Banner */}
      <div className="relative w-full max-w-4xl mx-auto pt-6 mb-6">
        <img
          src={dashboardBanner}
          alt="Dashboard Banner"
          className="w-full rounded-xl shadow-xl"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#4b3b2f] drop-shadow-lg">
          The Conversion Kitchen
        </h1>
      </div>

      <FloralDivider variant="vine" size="md" />

      {/* ⭐ QUICK TOOLS */}
      <div className="max-w-4xl mx-auto parchment-card p-6 mt-6 shadow-xl border border-[#e4d5b8]">
        <h2 className="text-xl font-semibold text-center mb-4 text-[#4b3b2f]">
          Quick Tools
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

          <Link to="/calculator" className="quicktool-btn">
            <img src={iconCalc} className="w-10 h-10 mx-auto mb-1" />
            <span>Calculator</span>
          </Link>

          <Link to="/guide" className="quicktool-btn">
            <img src={iconGuide} className="w-10 h-10 mx-auto mb-1" />
            <span>Guide</span>
          </Link>

          <Link to="/recipes" className="quicktool-btn">
            <img src={iconRecipes} className="w-10 h-10 mx-auto mb-1" />
            <span>Recipes</span>
          </Link>

          <Link to="/printables" className="quicktool-btn">
            <img src={iconPrint} className="w-10 h-10 mx-auto mb-1" />
            <span>Printables</span>
          </Link>

        </div>
      </div>

      {/* ⭐ TEMPLATE PREVIEW SECTION */}
      <div className="max-w-4xl mx-auto bg-white/85 p-6 rounded-xl shadow-md border border-[#e4d5b8] mt-10">
        <h2 className="text-2xl font-semibold mb-2 text-center text-[#4b3b2f]">
          Cozy Recipe Inspiration
        </h2>

        <p className="text-center mb-6 text-gray-700">
          Explore a few sample recipes crafted for cozy baking days.
        </p>

        <FloralDivider variant="floral" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">

          {templates.map((t) => (
            <div
              key={t.id}
              className="flex flex-col items-center bg-white/90 p-4 rounded-xl shadow-lg border border-[#e4d5b8]"
            >
              <img
                src={t.thumb}
                alt={t.name}
                className="w-full rounded-lg shadow mb-3"
                loading="lazy"
              />

              <p className="text-lg font-medium text-[#4b3b2f] mb-2">{t.name}</p>

              <div className="flex flex-col w-full gap-2">

                {/* View full template page */}
                <Link
                  to={`/template/${t.id}`}
                  className="w-full py-2 text-center rounded-xl bg-amber-200 hover:bg-amber-300 transition shadow font-semibold text-[#4b3b2f]"
                >
                  View Recipe
                </Link>

                {/* Open in Calculator */}
                <Link
                  to={`/calculator?template=${t.id}`}
                  className="w-full py-2 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow font-semibold"
                >
                  Open in Calculator
                </Link>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
