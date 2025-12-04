import React from 'react';
import DecorativeFrame from '../components/DecorativeFrame';
import FloralDivider from '../components/FloralDivider';

import BgPrintables from '../assets/backgrounds/bg-printables.jpg';

// Thumbnails (JPGs)
import CupsImg from '../assets/printables/printable-cups.jpg';
import KitchenImg from '../assets/printables/printable-kitchen.jpg';
import LiquidImg from '../assets/printables/printable-liquid.jpg';
import OvenImg from '../assets/printables/printable-oven.jpg';
import SubsImg from '../assets/printables/printable-subs.jpg';

// PDFs
import CupsPDF from '../assets/printables/printable-cups.pdf';
import KitchenPDF from '../assets/printables/printable-kitchen.pdf';
import LiquidPDF from '../assets/printables/printable-liquid.pdf';
import OvenPDF from '../assets/printables/printable-oven.pdf';
import SubsPDF from '../assets/printables/printable-subs.pdf';

export default function Printables() {
  const files = [
    { title: 'Cups Conversion Chart', img: CupsImg, pdf: CupsPDF },
    { title: 'Kitchen Tools Chart', img: KitchenImg, pdf: KitchenPDF },
    { title: 'Liquid Conversion Chart', img: LiquidImg, pdf: LiquidPDF },
    { title: 'Oven Temperature Chart', img: OvenImg, pdf: OvenPDF },
    { title: 'Substitutions Chart', img: SubsImg, pdf: SubsPDF }
  ];

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgPrintables})` }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Printables</h1>
            <p className="text-white/90 mt-2">
              Cute and helpful charts to keep in your kitchen
            </p>
          </div>

          <FloralDivider variant="mushroom" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {files.map((f, idx) => (
              <DecorativeFrame key={idx}>
                <div className="parchment-card p-4 flex flex-col items-center">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full rounded-xl shadow-lg mb-4"
                  />

                  <h2 className="text-xl font-bold text-[#1b302c] mb-2">
                    {f.title}
                  </h2>

                  <a
                    href={f.pdf}
                    download
                    className="w-full text-center py-3 bg-[#3c6150] text-white rounded-xl hover:bg-[#5f3c43] transition-all"
                  >
                    Download PDF
                  </a>
                </div>
              </DecorativeFrame>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
