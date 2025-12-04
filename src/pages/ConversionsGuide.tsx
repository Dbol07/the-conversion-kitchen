import React from 'react';
import Accordion from '../components/Accordion';
import FloralDivider from '../components/FloralDivider';

import BgGuide from '../assets/backgrounds/bg-guide.jpg';

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

          <div className="mt-8 space-y-4">
            <Accordion title="Volume Conversions" icon="teacup" defaultOpen>
              <div className="space-y-2 text-[#1b302c]">
                <p><strong>1 tablespoon</strong> = 3 teaspoons</p>
                <p><strong>1 fluid ounce</strong> = 2 tablespoons</p>
                <p><strong>1 cup</strong> = 16 tablespoons = 8 fl oz</p>
                <p><strong>1 pint</strong> = 2 cups</p>
                <p><strong>1 quart</strong> = 2 pints = 4 cups</p>
                <p><strong>1 gallon</strong> = 4 quarts = 16 cups</p>
              </div>
            </Accordion>

            <Accordion title="Weight Conversions" icon="leaf">
              <div className="space-y-2 text-[#1b302c]">
                <p><strong>1 pound</strong> = 16 ounces</p>
                <p><strong>1 ounce</strong> = 28.35 grams</p>
                <p><strong>1 pound</strong> = 453.6 grams</p>
                <p><strong>1 kilogram</strong> = 2.2 pounds</p>
              </div>
            </Accordion>

            <Accordion title="Temperature" icon="mushroom">
              <div className="space-y-2 text-[#1b302c]">
                <p>250°F = 120°C (Low)</p>
                <p>350°F = 175°C (Moderate)</p>
                <p>400°F = 200°C (Hot)</p>
                <p>450°F = 230°C (Very Hot)</p>
              </div>
            </Accordion>

            <Accordion title="Baking Measurements" icon="teacup">
              <div className="space-y-2 text-[#1b302c]">
                <p>1 cup flour = 120–125g</p>
                <p>1 cup sugar = 200g</p>
                <p>1 cup butter = 227g (2 sticks)</p>
                <p>1 cup milk = 240ml</p>
              </div>
            </Accordion>

            <Accordion title="Common Substitutions" icon="leaf">
              <div className="space-y-2 text-[#1b302c]">
                <p>1 cup buttermilk = 1 cup milk + 1 tbsp lemon juice</p>
                <p>1 cup cake flour = 1 cup AP flour – 2 tbsp + 2 tbsp cornstarch</p>
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
