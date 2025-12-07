import { useState } from "react";
import FloralDivider from "@/components/FloralDivider";

/* IMPORT EXACT ASSETS FROM YOUR FOLDER */
import imgCups from "@/assets/printables/printable-cups.jpg";
import pdfCups from "@/assets/printables/printable-cups.pdf";

import imgKitchen from "@/assets/printables/printable-kitchen.jpg";
import pdfKitchen from "@/assets/printables/printable-kitchen.pdf";

import imgLiquid from "@/assets/printables/printable-liquid.jpg";
import pdfLiquid from "@/assets/printables/printable-liquid.pdf";

import imgOven from "@/assets/printables/printable-oven.jpg";
import pdfOven from "@/assets/printables/printable-oven.pdf";

import imgSubs from "@/assets/printables/printable-subs.jpg";
import pdfSubs from "@/assets/printables/printable-subs.pdf";

interface PrintableItem {
  id: string;
  title: string;
  image: string;
  pdf: string;
}

const PRINTABLES: PrintableItem[] = [
  {
    id: "cups",
    title: "Cups to Grams Chart",
    image: imgCups,
    pdf: pdfCups,
  },
  {
    id: "kitchen",
    title: "Kitchen Tools Chart",
    image: imgKitchen,
    pdf: pdfKitchen,
  },
  {
    id: "liquid",
    title: "Liquid Conversions",
    image: imgLiquid,
    pdf: pdfLiquid,
  },
  {
    id: "oven",
    title: "Oven Temperature Chart",
    image: imgOven,
    pdf: pdfOven,
  },
  {
    id: "subs",
    title: "Ingredient Substitutions Chart",
    image: imgSubs,
    pdf: pdfSubs,
  },
];

export default function Printables() {
  const [modal, setModal] = useState<PrintableItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24">
      <h1 className="text-3xl font-bold text-center text-[#4b3b2f]">
        Printable Charts
      </h1>

      <FloralDivider variant="vine" size="md" />

      <p className="text-center text-[#5f3c43] mt-2 mb-8">
        Cozy kitchen helpers — download & print to keep handy.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {PRINTABLES.map((p) => (
          <div
            key={p.id}
            className="bg-white/90 border border-[#e4d5b8] rounded-xl shadow p-4 flex flex-col items-center card-hover"
          >
            <img
              src={p.image}
              className="w-full rounded-lg shadow cursor-pointer hover:opacity-90"
              onClick={() => setModal(p)}
              alt={`${p.title} preview`}
            />

            <p className="text-lg font-medium text-[#4b3b2f] mt-3 text-center">
              {p.title}
            </p>

            <button
              className="mt-3 w-full py-2 rounded-xl bg-[#2f6e4f] text-white font-semibold hover:bg-[#26593f]"
              onClick={() => setModal(p)}
            >
              Preview
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 border border-[#e4d5b8] rounded-xl max-w-4xl w-full shadow-2xl p-6 relative">
            
            {/* CLOSE BUTTON */}
            <button
              className="absolute top-3 right-3 text-xl font-bold text-[#5f3c43]"
              onClick={() => setModal(null)}
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold text-[#4b3b2f] mb-4 text-center">
              {modal.title}
            </h2>

            <img
              src={modal.image}
              className="w-full rounded-lg shadow mb-4"
              alt={`${modal.title} full preview`}
            />

            <a
              href={modal.pdf}
              download
              className="block w-full py-3 rounded-xl text-center bg-amber-200 text-[#4b3b2f] font-semibold hover:bg-amber-300 shadow"
            >
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
