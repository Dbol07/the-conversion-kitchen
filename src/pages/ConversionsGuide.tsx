import React from "react";
import Accordion from "@/components/Accordion";
import FloralDivider from "@/components/FloralDivider";
import bgGuide from "@/assets/backgrounds/bg-guide.jpg";

export default function ConversionsGuide() {
  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{
        backgroundImage: `url(${bgGuide})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* soft overlay */}
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Kitchen Conversions Guide
            </h1>
            <p className="text-white/90 mt-2">
              Quick reference for all your cozy cooking & baking needs
            </p>
          </div>

          <FloralDivider variant="vine" size="sm" />

          {/* MAIN GUIDE ACCORDIONS */}
          <div className="mt-8 space-y-4">

            <Accordion title="Volume Conversions" icon="teacup" defaultOpen>
              <div className="space-y-2 text-[#1b302c]">
                <p><strong className="text-[#3c6150]">1 tablespoon</strong> = 3 teaspoons</p>
                <p><strong className="text-[#3c6150]">1 fluid ounce</strong> = 2 tablespoons</p>
                <p><strong className="text-[#3c6150]">1 cup</strong> = 16 tablespoons = 8 fl oz</p>
                <p><strong className="text-[#3c6150]">1 pint</strong> = 2 cups</p>
                <p><strong className="text-[#3c6150]">1 quart</strong> = 2 pints = 4 cups</p>
                <p><strong className="text-[#3c6150]">1 gallon</strong> = 4 quarts = 16 cups</p>
              </div>
            </Accordion>

            <Accordion title="Weight Conversions" icon="leaf">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong className="text-[#3c6150]">1 pound</strong> = 16 ounces</p>
                <p><strong className="text-[#3c6150]">1 ounce</strong> = 28.35 grams</p>
                <p><strong className="text-[#3c6150]">1 pound</strong> = 453.6 grams</p>
                <p><strong className="text-[#3c6150]">1 kilogram</strong> = 2.2 pounds</p>
              </div>
            </Accordion>

            <Accordion title="Temperature" icon="mushroom">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong className="text-[#3c6150]">250°F</strong> = 120°C (Low)</p>
                <p><strong className="text-[#3c6150]">350°F</strong> = 175°C (Moderate)</p>
                <p><strong className="text-[#3c6150]">400°F</strong> = 200°C (Hot)</p>
                <p><strong className="text-[#3c6150]">450°F</strong> = 230°C (Very Hot)</p>
              </div>
            </Accordion>

            <Accordion title="Baking Measurements" icon="teacup">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong className="text-[#3c6150]">1 cup flour</strong> = 120–125g</p>
                <p><strong className="text-[#3c6150]">1 cup sugar</strong> = 200g</p>
                <p><strong className="text-[#3c6150]">1 cup butter</strong> = 227g (2 sticks)</p>
                <p><strong className="text-[#3c6150]">1 cup milk</strong> = 240ml</p>
              </div>
            </Accordion>

            <Accordion title="Common Substitutions" icon="leaf">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong className="text-[#3c6150]">1 cup buttermilk</strong> = 1 cup milk + 1 tbsp lemon juice</p>
                <p><strong className="text-[#3c6150]">1 cup cake flour</strong> = 1 cup AP flour - 2 tbsp + 2 tbsp cornstarch</p>
              </div>
            </Accordion>

            <Accordion title="Metric Quick Reference" icon="mushroom">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong className="text-[#3c6150]">30ml</strong> = 1 fl oz = 2 tbsp</p>
                <p><strong className="text-[#3c6150]">240ml</strong> = 8 fl oz = 1 cup</p>
                <p><strong className="text-[#3c6150]">1 liter</strong> = 4 cups = 1 quart</p>
              </div>
            </Accordion>

          </div>

          <FloralDivider variant="vine" size="sm" />

          {/* BOTTOM CARD */}
          <div className="parchment-card p-6 text-center mt-8 rounded-2xl shadow-md bg-[#fffaf4]/95 border border-[#e4d5b8]">
            <h2 className="text-xl font-bold text-[#1b302c] mb-3">
              Want more help?
            </h2>
            <p className="text-[#5f3c43]">
              Visit the Calculator for instant conversions, or explore our printable charts for easy kitchen reference.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
