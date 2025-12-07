import { useState } from "react";
import FloralDivider from "@/components/FloralDivider";
import printablesBanner from "@/assets/banners/printables-banner.png";

interface Printable {
  id: string;
  title: string;
  thumb: string;
  full: string;
  pdf: string;
}

const printables: Printable[] = [
  {
    id: "cups",
    title: "Cups to Grams Chart",
    thumb: "/printables/printable-cups.jpg",
    full: "/printables/printable-cups.jpg",
    pdf: "/printables/printable-cups.pdf",
  },
  {
    id: "kitchen",
    title: "Kitchen Tools Chart",
    thumb: "/printables/printable-kitchen.jpg",
    full: "/printables/printable-kitchen.jpg",
    pdf: "/printables/printable-kitchen.pdf",
  },
  {
    id: "liquid",
    title: "Liquid Conversions",
    thumb: "/printables/printable-liquid.jpg",
    full: "/printables/printable-liquid.jpg",
    pdf: "/printables/printable-liquid.pdf",
  },
  {
    id: "oven",
    title: "Oven Temperature Chart",
    thumb: "/printables/printable-oven.jpg",
    full: "/printables/printable-oven.jpg",
    pdf: "/printables/printable-oven.pdf",
  },
  {
    id: "subs",
    title: "Ingredient Substitutions Chart",
    thumb: "/printables/printable-subs.jpg",
    full: "/printables/printable-subs.jpg",
    pdf: "/printables/printable-subs.pdf",
  },
];

export default function Printables() {
  const [active, setActive] = useState<Printable | null>(null);

  return (
    <div className="max-w-5xl mx-auto p-0 pb-24">

      {/* ⭐ PAGE BANNER */}
      <div className="w-full h-40 sm:h-48 md:h-56 relative flex items-center justify-center mb-6 rounded-b-2xl overflow-hidden shadow">
        <img
          src={printablesBanner}
          alt="Printable Charts Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1b302c]/35" />
        <h1 className="relative z-10 text-3xl sm:text-4xl font-bold text-white drop-shadow-lg text-center">
          Printable Charts
        </h1>
      </div>

      <FloralDivider variant="vine" size="md" />

      <p className="text-center text-[#4b3b2f] mt-4 mb-8">
        Cozy kitchen helpers — download & print to keep handy.
      </p>

      {/* ⭐ GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {printables.map((p) => (
          <div
            key={p.id}
            className="bg-white/90 border border-[#e4d5b8] rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <img
              src={p.thumb}
              alt={p.title}
              className="rounded-lg w-full mb-3 shadow cursor-pointer"
              onClick={() => setActive(p)}
            />
            <h3 className="text-[#4b3b2f] font-semibold mb-3">{p.title}</h3>

            <button
              onClick={() => setActive(p)}
              className="bg-[#3c6150] text-white px-4 py-2 rounded-lg w-full mb-2 hover:bg-[#2c493c]"
            >
              Preview
            </button>

            <a
              href={p.pdf}
              target="_blank"
              className="bg-[#f7d774] text-[#4b3b2f] font-semibold px-4 py-2 rounded-lg w-full text-center shadow hover:bg-[#f2c94c]"
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>

      {/* ⭐ MODAL */}
      {active && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-4 relative">

            <button
              onClick={() => setActive(null)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg hover:bg-red-600"
            >
              ✕
            </button>

            <img
              src={active.full}
              alt={active.title}
              className="rounded-lg w-full max-h-[80vh] object-contain"
            />

            <div className="flex gap-3 mt-4 justify-end">
              <a
                href={active.pdf}
                target="_blank"
                className="bg-[#f7d774] text-[#4b3b2f] px-4 py-2 rounded-lg font-semibold hover:bg-[#f2c94c]"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
