import { Link } from "react-router-dom";
import FloralDivider from "../components/FloralDivider";
import { getAllTemplates } from "@/lib/templateLoader";


// Banner
import dashboardBanner from "@/assets/banners/dashboard-banner.png";

// Template thumbnails
const templates = getAllTemplates();

// Icons
import iconHome from "@/assets/icons/nav/nav-home.png";
import iconCalc from "@/assets/icons/nav/nav-calculator.png";
import iconGuide from "@/assets/icons/nav/nav-guide.png";
import iconRecipes from "@/assets/icons/nav/nav-recipes.png";
import iconPrint from "@/assets/icons/nav/nav-printables.png";
import iconAbout from "@/assets/icons/nav/nav-about.png";
import iconFaq from "@/assets/icons/nav/nav-faq.png";

export default function Dashboard() {
  return (
    <div className="dashboard-page p-6 max-w-5xl mx-auto">

      {/* ⭐ Top Banner with Overlaid Title */}
      <div className="relative w-full max-w-4xl mx-auto mb-6 mt-2">
        <img
          src={dashboardBanner}
          alt="Dashboard Banner"
          className="w-full rounded-xl shadow-xl object-cover"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#4b3b2f] drop-shadow-lg">
          The Conversion Kitchen
        </h1>
      </div>

      <FloralDivider variant="vine" size="md" />

      {/* ⭐ QUICK TOOLS BOX */}
      <div className="parchment-card p-6 mb-10 border border-[#e4d5b8] shadow-xl">
        <h2 className="text-xl font-semibold text-center mb-4 text-[#4b3b2f]">
          Quick Tools
        </h2>

        <div className="grid grid-cols-3 gap-4 text-center">

          <Link to="/" className="quicktool-btn">
            <img src={iconHome} className="w-10 h-10 mx-auto mb-1" />
            <span>Home</span>
          </Link>

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

          <Link to="/about" className="quicktool-btn">
            <img src={iconAbout} className="w-10 h-10 mx-auto mb-1" />
            <span>About</span>
          </Link>

          <Link to="/faq" className="quicktool-btn col-span-3">
            <img src={iconFaq} className="w-10 h-10 mx-auto mb-1" />
            <span>FAQ</span>
          </Link>
        </div>
      </div>

      {/* ⭐ TEMPLATE INSPIRATION */}
      <div className="bg-white/80 p-6 rounded-xl shadow-md border border-[#e4d5b8]">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#4b3b2f]">
          Cozy Recipe Inspiration
        </h2>

        <p className="text-center mb-6 text-gray-700">
          Start cooking with one of our beginner-friendly templates.
        </p>

        <FloralDivider variant="floral" />

        {/* TEMPLATE GRID */}
       <div className="grid grid-cols-3 gap-6 mt-6">
  {templates.map(t => (
    <Link
      key={t.id}
      to={`/calculator?template=${t.id}&prefill=true`}
      className="template-card flex flex-col items-center hover:-translate-y-1 transition"
    >
      <img
        src={t.thumb}
        alt={`${t.name} template preview`}
        loading="lazy"
        className="w-full rounded-lg shadow"
      />
      <p className="mt-2 text-lg font-medium text-[#4b3b2f]">{t.name}</p>
    </Link>
  ))}
</div>

      </div>
    </div>
  );
}
