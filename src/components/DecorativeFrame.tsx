import React from "react";

interface DecorativeFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Fixed version:
 * - Adds visible border spacing
 * - Prevents zero-height collapse
 * - Ensures children always appear above background layers
 * - Keeps SVG farmhouse corner ornaments
 */
export default function DecorativeFrame({
  children,
  className = "",
  style,
}: DecorativeFrameProps) {
  return (
    <div
      className={`relative rounded-xl p-6 bg-[#fffaf4] shadow-md border border-[#d9c7a3] ${className}`}
      style={{ position: "relative", ...style }}
    >
      {/* TOP LEFT */}
      <svg
        className="absolute -top-3 -left-3 w-8 h-8 text-[#3c6150] z-20"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path
          d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="8" r="3" fill="#a77a72" />
      </svg>

      {/* TOP RIGHT */}
      <svg
        className="absolute -top-3 -right-3 w-8 h-8 text-[#3c6150] rotate-90 z-20"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path
          d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="8" r="3" fill="#a77a72" />
      </svg>

      {/* BOTTOM LEFT */}
      <svg
        className="absolute -bottom-3 -left-3 w-8 h-8 text-[#3c6150] -rotate-90 z-20"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path
          d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="8" r="3" fill="#a77a72" />
      </svg>

      {/* BOTTOM RIGHT */}
      <svg
        className="absolute -bottom-3 -right-3 w-8 h-8 text-[#3c6150] rotate-180 z-20"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path
          d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="8" r="3" fill="#a77a72" />
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
