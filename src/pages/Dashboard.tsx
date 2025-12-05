import { Link } from "react-router-dom";
import cookieThumb from "@/assets/templates/cookie-template-thumb.png";
import cakeThumb from "@/assets/templates/cake-template-thumb.png";
import breadThumb from "@/assets/templates/bread-template-thumb.png";


export default function Dashboard() {
  return (
    <div className="dashboard-page p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        The Conversion Kitchen
      </h1>

      {/* QUICK TOOLS (Recipes stays here!) */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <Link to="/calculator" className="tool-btn">Calculator</Link>
        <Link to="/guide" className="tool-btn">Guide</Link>
        <Link to="/recipes" className="tool-btn">Recipes</Link>
        <Link to="/printables" className="tool-btn">Printables</Link>
        <Link to="/about" className="tool-btn">About</Link>
        <Link to="/faq" className="tool-btn">FAQ</Link>
      </div>

      {/* COZY INSPIRATION BOX — recipes removed, templates added */}
      <div className="bg-white/80 p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Cozy Recipe Inspiration
        </h2>

        <p className="text-center mb-6 text-gray-700">
          Start cooking with one of our beginner-friendly templates.
        </p>

        {/* TEMPLATE THUMBNAIL GRID */}
        <div className="grid grid-cols-3 gap-6">
          {/* COOKIE TEMPLATE */}
          <Link
            to="/calculator?template=cookie"
            className="template-card flex flex-col items-center"
          >
            <img
              src={cookieThumb}
              alt="Cookie Template"
              className="w-full rounded-lg shadow"
            />
            <p className="mt-2 text-lg font-medium">Cookie</p>
          </Link>

          {/* CAKE TEMPLATE */}
          <Link
            to="/calculator?template=cake"
            className="template-card flex flex-col items-center"
          >
            <img
              src={cakeThumb}
              alt="Cake Template"
              className="w-full rounded-lg shadow"
            />
            <p className="mt-2 text-lg font-medium">Cake</p>
          </Link>

          {/* BREAD TEMPLATE */}
          <Link
            to="/calculator?template=bread"
            className="template-card flex flex-col items-center"
          >
            <img
              src={breadThumb}
              alt="Bread Template"
              className="w-full rounded-lg shadow"
            />
            <p className="mt-2 text-lg font-medium">Bread</p>
          </Link>
        </div>
      </div>

      {/* (Optional) your bottom navigation bar */}
      <div className="bottom-nav mt-10">
        {/* reuse your existing footer/nav here */}
      </div>
    </div>
  );
}
