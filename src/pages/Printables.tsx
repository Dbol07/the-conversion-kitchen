import { useState } from "react";
import FloralDivider from "@/components/FloralDivider";

interface PrintableItem {
  id: string;
  title: string;
  image: string;   // preview JPG
  pdf: string;     // pdf link
}

const PRINTABLES: PrintableItem[] = [
  {
    id: "liquid",
    title: "Liquid Conversions",
    image: "/src/assets/printables/printable-liquid.jpg",
    pdf: "/src/assets/printables/printable-liquid.pdf"
  },
  {
    id: "dry",
    title: "Dry Goods Conversions",
    image: "/src/assets/printables/printable-dry.jpg",
    pdf: "/src/assets/printables/printable-dry.pdf"
  },
  {
    id: "oven",
    title: "Oven Temperature Chart",
    image: "/src/assets/printables/printable-oven.jpg",
    pdf: "/src/assets/printables/printable-oven.pdf"
  }
];

export default function Printables() {
  const [modal, setModal] = useState<PrintableItem | null>(null);

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <h1 className="text-3xl font-bold text-center text-[#4b3b2f]">
        Printable Charts
      </h1>

      <FloralDivider variant="vine" size="md" />

      <p className="text-center text-[#5f3c43] mt-2 mb-8">
        Cozy kitchen helpers — download & print to keep handy.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {PRINTABLES.map((p) => (
          <div
            key={p.id}
            className="bg-white/90 border border-[#e4d5b8] rounded-xl shadow p-4 flex flex-col items-center"
          >
            <img
              src={p.image}
              className="w-full rounded-lg shadow cursor-pointer hover:opacity-90"
              onClick={() => setModal(p)}
            />

            <p className="text-lg font-medium text-[#4b3b2f] mt-3">
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

            <h2 className="text-2xl font-semibold text-[#4b3b2f] mb-4">
              {modal.title}
            </h2>

            <img
              src={modal.image}
              className="w-full rounded-lg shadow mb-4"
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
