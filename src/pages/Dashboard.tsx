import { Link } from "react-router-dom";

// Template thumbnails
import cookieThumb from "@/assets/templates/cookie-template-thumb.png";
import cakeThumb from "@/assets/templates/cake-template-thumb.png";
import breadThumb from "@/assets/templates/bread-template-thumb.png";

// Icons
import iconHome from "@/assets/icons/nav-home.png";
import iconCalc from "@/assets/icons/nav-calculator.png";
import iconGuide from "@/assets/icons/nav-guide.png";
import iconRecipes from "@/assets/icons/nav-recipes.png";
import iconPrint from "@/assets/icons/nav-printables.png";
import iconAbout from "@/assets/icons/nav-about.png";
import iconFaq from "@/assets/icons/nav-faq.png";

// Divider image
import divider from "@/assets/dividers/vine-divider.png";

export default function Dashboard() {
  return (
    <div className="dashboard-page p-6 max-w-5xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4 text-center text-[#4b3b2f]">
        The Conversion Kitchen
      </h1>

      {/* Divider */}
      <div className="flex justify-center mb-6">
        <img 
          src={divider} 
          alt="Decorative divider" 
          className="h-6 opacity-80 max-w-xs"
        />
      </div>

      {/* ⭐ QUICK TOOLS BOX */}
      <div className="bg-[#fffdf7]/90 border border-[#e4d5b8] rounded-2xl shadow-xl p-5 mb-10">
        <h2 className="text-xl font-semibold text-center mb-4 text-[#4b3b2f]">
          Quick Tools
        </h2>

        <div className="grid grid-cols-3 gap-4 text-center">

          <Link to="/" className="quicktool-btn">
            <img src={iconHome} alt="Home icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>Home</span>
          </Link>

          <Link to="/calculator" className="quicktool-btn">
            <img src={iconCalc} alt="Calculator icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>Calculator</span>
          </Link>

          <Link to="/guide" className="quicktool-btn">
            <img src={iconGuide} alt="Guide icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>Guide</span>
          </Link>

          <Link to="/recipes" className="quicktool-btn">
            <img src={iconRecipes} alt="Recipes icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>Recipes</span>
          </Link>

          <Link to="/printables" className="quicktool-btn">
            <img src={iconPrint} alt="Printables icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>Printables</span>
          </Link>

          <Link to="/about" className="quicktool-btn">
            <img src={iconAbout} alt="About icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>About</span>
          </Link>

          {/* FAQ (full width on mobile only) */}
          <Link
            to="/faq"
            className="quicktool-btn col-span-3 sm:col-span-1"
          >
            <img src={iconFaq} alt="FAQ icon" className="w-10 h-10 mx-auto mb-1 opacity-90" />
            <span>FAQ</span>
          </Link>
        </div>
      </div>

      {/* ⭐ TEMPLATE INSPIRATION BOX */}
      <div className="bg-white/80 p-6 rounded-xl shadow-md border border-[#e4d5b8]">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#4b3b2f]">
          Cozy Recipe Inspiration
        </h2>

        <p className="text-center mb-6 text-gray-700">
          Start cooking with one of our beginner-friendly templates.
        </p>

        {/* TEMPLATE GRID */}
        <div className="grid grid-cols-3 gap-6">

          <Link
            to="/template/cookie"
            className="template-card flex flex-col items-center hover:-translate-y-1 transition"
          >
            <img 
              src={cookieThumb} 
              alt="Cookie template preview" 
              loading="lazy"
              className="w-full rounded-lg shadow" 
            />
            <p className="mt-2 text-lg font-medium text-[#4b3b2f]">Cookie</p>
          </Link>

          <Link
            to="/template/cake"
            className="template-card flex flex-col items-center hover:-translate-y-1 transition"
          >
            <img 
              src={cakeThumb} 
              alt="Cake template preview"
              loading="lazy"
              className="w-full rounded-lg shadow" 
            />
            <p className="mt-2 text-lg font-medium text-[#4b3b2f]">Cake</p>
          </Link>

          <Link
            to="/template/bread"
            className="template-card flex flex-col items-center hover:-translate-y-1 transition"
          >
            <img 
              src={breadThumb} 
              alt="Bread template preview"
              loading="lazy"
              className="w-full rounded-lg shadow" 
            />
            <p className="mt-2 text-lg font-medium text-[#4b3b2f]">Bread</p>
          </Link>

        </div>
      </div>
    </div>
  );
}
