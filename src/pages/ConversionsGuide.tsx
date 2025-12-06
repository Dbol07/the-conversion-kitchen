// ⭐ UPDATED ConversionsGuide.tsx WITH EXPANDED CONTENT

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

          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Kitchen Conversions Guide
            </h1>
            <p className="text-white/90 mt-2">
              A cozy reference to help you measure, mix, and bake with confidence.
            </p>
          </div>

          <FloralDivider variant="vine" />

          {/* BODY */}
          <p className="text-white/95 text-lg leading-relaxed mt-6 mb-8">
            Whether you're baking pastries, perfecting a family recipe, or converting
            international measurements, this guide helps you understand the essentials —
            from volume and weight conversions to ingredient-specific tips. Keep it open
            as your friendly kitchen companion.
          </p>

          <div className="mt-8 space-y-4">
            <Accordion title="Volume Conversions" icon="teacup" defaultOpen>
              <div className="space-y-2 text-[#1b302c]">
                <p><strong>1 tablespoon</strong> = 3 teaspoons</p>
                <p><strong>1 fluid ounce</strong> = 2 tablespoons</p>
                <p><strong>1 cup</strong> = 16 tbsp = 8 fl oz</p>
                <p><strong>1 pint</strong> = 2 cups</p>
                <p><strong>1 quart</strong> = 4 cups</p>
                <p><strong>1 gallon</strong> = 16 cups</p>

                <p className="mt-3 italic text-[#5f3c43]">
                  Tip: Dry and liquid measuring cups are calibrated differently.
                  Always measure liquids in a transparent liquid cup on a flat surface.
                </p>
              </div>
            </Accordion>

            <Accordion title="Weight Conversions" icon="leaf">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong>1 pound</strong> = 16 ounces</p>
                <p><strong>1 ounce</strong> = 28.35 grams</p>
                <p><strong>1 pound</strong> = 453.6 grams</p>
                <p><strong>1 kilogram</strong> = 2.2 pounds</p>
                <p className="italic text-[#5f3c43]">
                  Tip: When in doubt, weigh your ingredients. A scale is every baker’s secret weapon.
                </p>
              </div>
            </Accordion>

            <Accordion title="Oven Temperature Guide" icon="mushroom">
              <div className="space-y-2 text-[#1b302c]">
                <p>250°F = 120°C (Very Low)</p>
                <p>300°F = 150°C (Low)</p>
                <p>350°F = 175°C (Moderate)</p>
                <p>400°F = 200°C (Hot)</p>
                <p>450°F = 230°C (Very Hot)</p>

                <p className="italic text-[#5f3c43]">
                  Tip: Oven temperatures vary — consider an oven thermometer for accuracy.
                </p>
              </div>
            </Accordion>

            <Accordion title="Baking Ingredient Weights" icon="teacup">
              <div className="space-y-2 text-[#1b302c]">
                <p>1 cup flour = 120–125g</p>
                <p>1 cup sugar = 200g</p>
                <p>1 cup butter = 227g</p>
                <p>1 cup milk = 240ml</p>

                <p className="italic text-[#5f3c43]">
                  Note: Different flour brands settle differently. Spoon-and-level for consistency.
                </p>
              </div>
            </Accordion>

            <Accordion title="Common Substitutions" icon="leaf">
              <div className="space-y-2 text-[#1b302c]">
                <p>1 cup buttermilk → 1 cup milk + 1 tbsp lemon juice</p>
                <p>1 cup cake flour → 1 cup AP flour – 2 tbsp + 2 tbsp cornstarch</p>
                <p>1 egg → 3 tbsp beaten egg</p>
                <p>1 tsp baking powder → ¼ tsp baking soda + ½ tsp cream of tartar</p>
              </div>
            </Accordion>

            <Accordion title="Metric Quick Reference" icon="mushroom">
              <div className="space-y-2 text-[#1b302c]">
                <p>30ml = 1 fl oz = 2 tbsp</p>
                <p>240ml = 8 fl oz = 1 cup</p>
                <p>1 liter = 4 cups = 1 quart</p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
