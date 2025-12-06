import React, { useState } from "react";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";

// Background
import BgPrintables from "@/assets/backgrounds/bg-printables.jpg";

// PDF files
import pdfCups from "@/assets/printables/printable-cups.pdf";
import pdfKitchen from "@/assets/printables/printable-kitchen.pdf";
import pdfLiquid from "@/assets/printables/printable-liquid.pdf";
import pdfOven from "@/assets/printables/printable-oven.pdf";
import pdfSubs from "@/assets/printables/printable-subs.pdf";

// Updated Preview JPGs
import imgCups from "@/assets/printables/printable-cups.jpg";
import imgKitchen from "@/assets/printables/printable-kitchen.jpg";
import imgLiquid from "@/assets/printables/printable-liquid.jpg";
import imgOven from "@/assets/printables/printable-oven.jpg";
import imgSubs from "@/assets/printables/printable-subs.jpg";

const disableSave = {
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
  WebkitUserDrag: "none",
  userSelect: "none",
};

export default function Printables() {
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const items = [
    { id: "cups", title: "Cups Conversion Chart", pdf: pdfCups, img: imgCups },
    { id: "kitchen", title: "Kitchen Tools Chart", pdf: pdfKitchen, img: imgKitchen },
    { id: "liquid", title: "Liquid Conversion Chart", pdf: pdfLiquid, img: imgLiquid },
    { id: "oven", title: "Oven Temperature Chart", pdf: pdfOven, img: imgOven },
    { id: "subs", title: "Substitutions Chart", pdf: pdfSubs, img: imgSubs },
  ];

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgPrintables})` }}
    >
      <div className="bg-[#1b302c]/35 min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* PAGE HEADER */}
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Free Printables
            </h1>
            <p className="text-white/85 text-md mt-1">
              Beautiful conversion charts to keep handy in your cozy kitchen
            </p>
          </header>

          <FloralDivider variant="floral" />

          {/* GRID OF CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
            {items.map((p) => (
              <div
                key={p.id}
                className="bg-white/90 parchment-card p-4 flex flex-col shadow-lg rounded-xl border border-[#d9cbb3]"
              >
                {/* IMAGE is now STATIC — NOT clickable */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="rounded-lg mb-4 shadow pointer-events-none select-none w-full max-h-[280px] object-contain"
                />

                <h3 className="text-lg font-semibold text-[#1b302c] text-center">
                  {p.title}
                </h3>

                <button
                  className="mt-4 w-full bg-emerald-700 text-white py-2 rounded-xl shadow hover:bg-emerald-800 transition"
                  onClick={() => setActiveItem(p)}
                >
                  Preview
                </button>

                <a
                  href={p.pdf}
                  download
                  className="mt-2 block text-center w-full bg-amber-300 py-2 rounded-xl shadow hover:bg-amber-400 transition font-semibold text-[#4b3b2f]"
                >
                  Download PDF
                </a>
              </div>
            ))}
          </div>

          {/* PREVIEW MODAL */}
          {activeItem && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="relative bg-[#faf6f0] rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden">

                {/* SIDEBAR */}
                <div className="w-32 bg-[#f2e8d8] border-r border-[#d3c1a1] p-3 flex flex-col gap-3 overflow-y-auto">
                  {items.map((p) => (
                    <img
                      key={p.id}
                      src={p.img}
                      alt={p.title}
                      className={`rounded-lg shadow cursor-pointer border-2 ${
                        activeItem.id === p.id
                          ? "border-emerald-600"
                          : "border-transparent opacity-70"
                      } hover:opacity-100 transition`}
                      onClick={() => setActiveItem(p)}
                    />
                  ))}
                </div>

                {/* MAIN LARGE PREVIEW */}
                <div className="flex-1 p-6 flex justify-center items-center">
                  <div className="relative rounded-2xl border-4 border-[#d2bfa3] shadow-xl">
                    <img
                      src={activeItem.img}
                      alt="preview"
                      className="rounded-xl max-h-[80vh] object-contain select-none"
                      style={disableSave}
                      draggable={false}
                    />
                  </div>
                </div>

                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-3 right-3 bg-rose-400 text-white w-10 h-10 rounded-full shadow-lg hover:bg-rose-500 transition text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
