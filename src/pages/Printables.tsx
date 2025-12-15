import { useState, useEffect } from "react";
import FloralDivider from "@/components/FloralDivider";
import printablesBanner from "@/assets/banners/printables-banner.png";
import { loadPrintables } from "@/utils/loadPrintables";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "@/components/BackToTop";
import bgPrintables from "@/assets/backgrounds/bg-printables.jpg";


interface Printable {
  id: string;
  title: string;
  thumb: string;
  full: string;
  pdf: string;
}


export default function Printables() {
  const [active, setActive] = useState<Printable | null>(null);
const [activeIndex, setActiveIndex] = useState<number | null>(null);
const printables = loadPrintables();
/* --------------------------------------------------
   MODAL CONTROLS (keyboard + navigation)
--------------------------------------------------- */

// Close on ESC
useEffect(() => {
  if (activeIndex === null) return;

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setActiveIndex(null);
    if (e.key === "ArrowRight")
      setActiveIndex((i) =>
        i === null ? i : (i + 1) % printables.length
      );
    if (e.key === "ArrowLeft")
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + printables.length) % printables.length
      );
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [activeIndex, printables.length]);

  return (
    <div className="max-w-5xl mx-auto p-0 pb-24">

{/* ⭐ PAGE BANNER (Guide-style) */}
<div
  className="w-full rounded-b-2xl overflow-hidden shadow mb-8"
  style={{
    backgroundImage: `url(${bgPrintables})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="bg-black/15 px-6 py-10 text-center">
    <h1 className="text-3xl font-bold text-white drop-shadow">
      Printable Charts
    </h1>

    <FloralDivider variant="vine" size="sm" />

    <p className="mt-2 text-white/90 italic max-w-xl mx-auto">
      Cozy kitchen helpers — download &amp; print to keep handy.
    </p>
  </div>
</div>


{/* ⭐ GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
  {printables.map((item, index) => (
    <div
      key={item.id}
className="bg-white/85 border border-[#e4d5b8] rounded-xl p-1.5 shadow-sm hover:shadow-md transition flex flex-col items-center"
    >
      {/* Thumbnail */}
   
<img
  src={item.thumb}
  alt={item.title}
className="rounded-md w-full h-40 object-contain mb-2 shadow-sm bg-[#faf5eb]"
/>

      {/* Hidden title for accessibility */}
      <h3 className="sr-only">{item.title}</h3>

      {/* Preview button */}
      <button
onClick={() => setActiveIndex(index)}
className="w-full bg-[#3C6150] hover:bg-[#63AB8D] transition-colors text-white py-1.5 rounded-lg text-sm mb-1.5"
      >
        Preview
      </button>

      {/* Download */}
      <a
        href={item.pdf}
        download
className="bg-[#f7d774] text-[#4b3b2f] font-semibold px-3 py-1.5 rounded-lg w-full text-center shadow-sm hover:bg-[#f2c94c] text-sm"
      >
        Download PDF
      </a>
    </div>
  ))}
</div>

{/* ⭐ MODAL */}
<AnimatePresence>
  {activeIndex !== null && (
    <motion.div
      /* Backdrop */
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setActiveIndex(null)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        /* Modal panel */
        className="relative bg-white/90 rounded-2xl shadow-xl border border-[#e4d5b8] max-w-3xl w-full p-5"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -120) {
            setActiveIndex((i) =>
              i === null ? i : (i + 1) % printables.length
            );
          }
          if (info.offset.x > 120) {
            setActiveIndex((i) =>
              i === null
                ? i
                : (i - 1 + printables.length) % printables.length
            );
          }
        }}
      >
        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={() => setActiveIndex(null)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg z-50"
          aria-label="Close preview"
        >
          ✕
        </button>

        {/* IMAGE */}
        <img
src={printables[activeIndex].full}
          alt={printables[activeIndex].title}
          className="w-full max-h-[60vh] object-contain rounded-lg"
        />

        {/* CONTROLS */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() =>
              setActiveIndex(
                (activeIndex - 1 + printables.length) % printables.length
              )
            }
            className="bg-[#3C6150] text-white px-4 py-2 rounded-lg"
          >
            ◀
          </button>

          <a
            href={printables[activeIndex].pdf}
            download
            className="bg-[#F6D97A] text-[#4b3b2f] px-6 py-2 rounded-lg font-semibold shadow-sm"
          >
            Download PDF
          </a>

          <button
            onClick={() =>
              setActiveIndex((activeIndex + 1) % printables.length)
            }
            className="bg-[#3C6150] text-white px-4 py-2 rounded-lg"
          >
            ▶
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<div className="mt-20 flex justify-end px-6">
  <BackToTop />
</div>

    </div>
  );
}
