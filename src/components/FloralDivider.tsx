// src/components/FloralDivider.tsx
import React from "react";

// 🔹 Update these imports to match your exact filenames if needed
import vineDivider from "@/assets/dividers/divider-vine.png";
import mushroomDivider from "@/assets/dividers/divider-mushroom.png";
import dotsDivider from "@/assets/dividers/divider-dots.png";
import spoonsDivider from "@/assets/dividers/divider-spoons.png";

export type FloralDividerVariant = "vine" | "mushroom" | "dots" | "spoons";

const VARIANT_MAP: Record<FloralDividerVariant, string> = {
  vine: vineDivider,
  mushroom: mushroomDivider,
  dots: dotsDivider,
  spoons: spoonsDivider,
};

type FloralDividerProps = {
  /** Which artwork to use */
  variant?: FloralDividerVariant;
  /** Visual height of the divider */
  size?: "sm" | "md" | "lg";
  /** Extra Tailwind classes if you want to tweak per page */
  className?: string;
};

export default function FloralDivider({
  variant = "vine",
  size = "md",
  className = "",
}: FloralDividerProps) {
  const src = VARIANT_MAP[variant] ?? VARIANT_MAP.vine;

  const heightClass =
    size === "sm" ? "h-4" : size === "lg" ? "h-10" : "h-6";

  const classes = [
    "max-w-full w-full md:max-w-lg",
    heightClass,
    "opacity-80",
    // 🌙 basic theme-awareness: slightly brighter & more opaque in dark mode
    "dark:opacity-90 dark:brightness-110",
    "select-none pointer-events-none",
    "transition-opacity duration-300",
    "mx-auto",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex justify-center my-4">
      <img src={src} alt="" aria-hidden="true" loading="lazy" className={classes} />
    </div>
  );
}
