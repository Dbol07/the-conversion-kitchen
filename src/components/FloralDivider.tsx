import React from "react";

// Import your divider images
import vine1 from "@/assets/dividers/divider-vine.png";
import vine2 from "@/assets/dividers/divider-vine-light.png";
import vine3 from "@/assets/dividers/divider-vine-dark.png";

import floral1 from "@/assets/dividers/divider-floral.png";
import floral2 from "@/assets/dividers/divider-floral-thin.png";

import mushroom1 from "@/assets/dividers/divider-mushroom.png";
import mushroom2 from "@/assets/dividers/divider-mushroom-thin.png";
import mushroom3 from "@/assets/dividers/divider-mushroom-wide.png";

// Allowed variants
export type DividerVariant = "vine" | "floral" | "mushroom";

// Divider groups
const dividerGroups: Record<DividerVariant, string[]> = {
  vine: [vine1, vine2, vine3],
  floral: [floral1, floral2],
  mushroom: [mushroom1, mushroom2, mushroom3],
};

interface FloralDividerProps {
  variant?: DividerVariant | string; // allow incorrect values safely
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FloralDivider({
  variant = "vine",
  className = "",
  size = "md",
}: FloralDividerProps) {
  // SAFETY FALLBACK: If invalid variant is passed, warn & fall back.
  let chosenVariant: DividerVariant = "vine";

  if (variant in dividerGroups) {
    chosenVariant = variant as DividerVariant;
  } else {
    console.warn(
      `%c[FloralDivider] Invalid variant "${variant}" — using fallback "vine".`,
      "color: #d97706; font-weight: bold"
    );
  }

  const options = dividerGroups[chosenVariant];
  const selectedDivider =
    options[Math.floor(Math.random() * options.length)];

  // Optional sizing support
  const sizeClass =
    size === "sm"
      ? "max-w-[120px]"
      : size === "lg"
      ? "max-w-[260px]"
      : "max-w-[180px]";

  return (
    <img
      src={selectedDivider}
      alt="decorative divider"
      draggable="false"
      className={`mx-auto my-6 opacity-90 ${sizeClass} ${className}`}
    />
  );
}
