import React from "react";
import Accordion from "../components/Accordion";
import FloralDivider from "../components/FloralDivider";
import BgGuide from "../assets/backgrounds/bg-guide.jpg";

export default function ConversionsGuide() {
  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgGuide})` }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Kitchen Conversions Guide
            </h1>
            <p className="text-white/90 mt-2">
              Quick reference for all your cooking needs
            </p>
          </div>

          <FloralDivider variant="vine" />

          {/* Your existing accordion content stays exactly the same */}
          <div className="mt-8 space-y-4">
            {/* Volume, Weight, Temperature, Baking, Substitutions, etc. */}
            {/* Content unchanged */}
          </div>
        </div>
      </div>
    </div>
  );
}
