import React from "react";

export default function Printables() {
  const printables = [
    {
      title: "Cups Conversion Chart",
      img: "/printables/printable-cups.jpg",
      pdf: "/printables/printable-cups.pdf",
    },
    {
      title: "Kitchen Basics Chart",
      img: "/printables/printable-kitchen.jpg",
      pdf: "/printables/printable-kitchen.pdf",
    },
    {
      title: "Liquid Conversion Chart",
      img: "/printables/printable-liquid.jpg",
      pdf: "/printables/printable-liquid.pdf",
    },
    {
      title: "Oven Temperature Chart",
      img: "/printables/printable-oven.jpg",
      pdf: "/printables/printable-oven.pdf",
    },
    {
      title: "Substitution Chart",
      img: "/printables/printable-subs.jpg",
      pdf: "/printables/printable-subs.pdf",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f0] p-4 pb-20">
      <h1 className="text-3xl font-bold text-center text-[#5f3c43] mb-6">
        Printables
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {printables.map((p) => (
          <div
            key={p.title}
            className="bg-white rounded-xl overflow-hidden shadow-md border border-[#a77a72]/40"
          >
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-[#3c6150]">
                {p.title}
              </h2>

              <a
                href={p.pdf}
                download
                className="inline-block text-center bg-[#b8d3d5] text-[#1b302c] px-4 py-2 rounded-lg font-medium hover:bg-[#9bc1c3] transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
