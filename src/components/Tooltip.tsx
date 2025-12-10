import { useState, useEffect, useRef } from "react";

export default function Tooltip({
  label,
  children,
  fan = false, // NEW: allows special styling for convection/fan oven tips
}: {
  label: string;
  children: React.ReactNode;
  fan?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Close tooltip when tapping outside (mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => {
        if (!isMobile) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setOpen(false);
      }}
      onClick={() => {
        if (isMobile) setOpen((o) => !o);
      }}
    >
      {/* The pill shown inline */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm
          ${
            fan
              ? "bg-[#e9f7ff] text-[#2b4c66] border border-[#bcdff5]" // Fan-specific blue pill
              : "bg-[#f3ecfa] text-[#4a375e] border border-[#d6c3ef]"
          }`}
        style={{
          transition: isMobile ? "none" : "all 0.15s ease",
          transform: !isMobile && open ? "scale(1.03)" : "scale(1)",
        }}
      >
        {children}
      </span>

      {/* Tooltip bubble */}
      {open && (
        <span
          className={`absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded-xl text-xs shadow-xl whitespace-nowrap z-50
            ${
              fan
                ? "bg-[#e9f7ff] border border-[#bcdff5] text-[#2b4c66]"
                : "bg-[#fffaf4] border border-[#e4d5b8] text-[#5f3c43]"
            }`}
          style={{
            transition: isMobile ? "none" : "opacity 0.15s ease",
            opacity: open ? 1 : 0,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
