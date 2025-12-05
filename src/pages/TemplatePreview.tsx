import { useParams, useNavigate, Link } from "react-router-dom";
import cookieFull from "@/assets/templates/cookie-template-full.png";
import cakeFull from "@/assets/templates/cake-template-full.png";
import breadFull from "@/assets/templates/bread-template-full.png";

// Background
import floralParchment from "@/assets/backgrounds/parchment-floral.jpg";

const TEMPLATE_MAP: Record<
  string,
  { title: string; img: string; templateKey: string }
> = {
  cookie: {
    title: "Cookie Recipe Template",
    img: cookieFull,
    templateKey: "cookie",
  },
  cake: {
    title: "Cake Recipe Template",
    img: cakeFull,
    templateKey: "cake",
  },
  bread: {
    title: "Bread Recipe Template",
    img: breadFull,
    templateKey: "bread",
  },
};

export default function TemplatePreview() {
  const { name } = useParams();
  const navigate = useNavigate();

  const selected = name ? TEMPLATE_MAP[name] : null;

  if (!selected) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl">Template not found.</p>
        <Link
          to="/"
          className="inline-block mt-4 px-4 py-2 bg-amber-200 rounded shadow"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4 flex justify-center"
      style={{
        backgroundImage: `url(${floralParchment})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm max-w-3xl w-full p-6 rounded-2xl shadow-2xl border border-[#d2bfa3]">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#4b3b2f] drop-shadow">
          {selected.title}
        </h1>

        <div className="w-full mb-6">
          <img
            src={selected.img}
            alt={selected.title}
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-rose-200 hover:bg-rose-300 text-[#4b3b2f] rounded-xl shadow-md transition font-medium"
          >
            ← Back
          </button>

          <Link
            to={`/calculator?template=${selected.templateKey}&prefill=true`}
            className="px-6 py-3 bg-emerald-200 hover:bg-emerald-300 text-[#4b3b2f] rounded-xl shadow-md transition font-semibold"
          >
            Use This Template →
          </Link>
        </div>
      </div>
    </div>
  );
}
