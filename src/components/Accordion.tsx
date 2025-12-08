import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: "leaf" | "teacup" | "mushroom";
  className?: string; // ⭐ NEW: allow external styling
}

const LeafIcon = () => (
  <svg className="w-5 h-5 text-[#3c6150]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
  </svg>
);

const TeacupIcon = () => (
  <svg className="w-5 h-5 text-[#a77a72]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 19h16v2H4v-2zm14-9h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v1c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8h14v2zm0 4h2v-2h-2v2zM6 8V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2H6z" />
  </svg>
);

const MushroomIcon = () => (
  <svg className="w-5 h-5 text-[#5f3c43]" viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="12" cy="8" rx="8" ry="5" />
    <rect x="10" y="12" width="4" height="8" rx="1" fill="#faf6f0" stroke="#5f3c43" strokeWidth="1" />
    <circle cx="9" cy="7" r="1.5" fill="#faf6f0" />
    <circle cx="14" cy="6" r="1" fill="#faf6f0" />
  </svg>
);

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  icon = "leaf",
  className = "", // ⭐ NEW
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const IconComponent =
    icon === "teacup" ? TeacupIcon : icon === "mushroom" ? MushroomIcon : LeafIcon;

  return (
    <div className="mb-4 parchment-card overflow-hidden animate-slide-up shadow-lg hover:shadow-xl transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-6 py-4 flex items-center gap-3 text-left
          bg-gradient-to-r from-[#b8d3d5]/80 to-[#a77a72]/60
          hover:from-[#b8d3d5] hover:to-[#a77a72]/80
          transition-all
          ${className}  /* ⭐ allows overriding */
        `}
      >
        <IconComponent />
        <h3 className="flex-1 text-lg font-semibold text-[#1b302c] font-serif">
          {title}
        </h3>

        <svg
          className={`w-5 h-5 text-[#5f3c43] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 text-[#1b302c] border-t-2 border-[#a77a72]/50 bg-[#faf6f0]/90">
          {children}
        </div>
      </div>
    </div>
  );
}
