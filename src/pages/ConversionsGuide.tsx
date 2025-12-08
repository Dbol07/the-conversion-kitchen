import FloralDivider from "@/components/FloralDivider";
import guideBanner from "@/assets/banners/guide-banner.png";

// Background BELOW the banner
import bgGuide from "@/assets/backgrounds/bg-guide.jpg";

// Section-specific icons
import iconVolume from "@/assets/icons/sections/sec-volume.png";
import iconWeight from "@/assets/icons/sections/sec-weight.png";
import iconTemp from "@/assets/icons/sections/sec-temperature.png";
import iconKitchen from "@/assets/icons/sections/sec-kitchen.png";

export default function ConversionsGuide() {
  return (
    <div className="pb-24">

      {/* ⭐ PAGE BANNER */}
      <div className="w-full h-40 sm:h-48 md:h-56 relative flex items-center justify-center mb-0 rounded-b-2xl overflow-hidden shadow">
        <img
          src={guideBanner}
          alt="Guide Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1b302c]/35" />
        <h1 className="relative z-10 text-3xl sm:text-4xl font-bold text-white drop-shadow-lg text-center">
          Kitchen Conversions Guide
        </h1>
      </div>

      {/* ⭐ BACKGROUND STARTS BELOW BANNER */}
      <div
        className="pt-8"
        style={{
          backgroundImage: `url(${bgGuide})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <FloralDivider variant="vine" size="md" />

        {/* ⭐ PAGE CONTENT */}
        <div className="mt-6 bg-white/90 border border-[#e4d5b8] rounded-xl p-6 shadow leading-relaxed text-[#4b3b2f]">

          {/* ⭐ SECTION 1 */}
          <div className="flex items-center gap-3 bg-[#fff0e6]/70 border border-[#e4d5b8] px-4 py-2 rounded-xl mb-4 mt-2 shadow-sm">
            <img src={iconVolume} className="w-7 h-7 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
              Common Measurement Conversions
            </h2>
          </div>

          <p className="mb-3">
            Use this guide to convert between cups, tablespoons, teaspoons, fluid ounces, grams,
            and milliliters. These values are approximate but work well for everyday baking and cooking.
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>1 tablespoon = 3 teaspoons</li>
            <li>1 cup = 16 tablespoons</li>
            <li>1 cup = 8 fluid ounces</li>
            <li>1 cup = 240 ml (approx.)</li>
            <li>1 tablespoon = 15 ml</li>
            <li>1 teaspoon = 5 ml</li>
          </ul>

          <FloralDivider variant="vine" size="sm" className="my-6" />

          {/* ⭐ SECTION 2 */}
          <div className="flex items-center gap-3 bg-[#fff0e6]/70 border border-[#e4d5b8] px-4 py-2 rounded-xl mb-4 mt-2 shadow-sm">
            <img src={iconWeight} className="w-7 h-7 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
              Ingredient Density Notes
            </h2>
          </div>

          <p className="mb-3">
            Some ingredients weigh more than others, so converting from cups to grams varies.
            Here are common approximations used in most kitchens:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>1 cup all-purpose flour ≈ 120g</li>
            <li>1 cup granulated sugar ≈ 200g</li>
            <li>1 cup brown sugar ≈ 180g (packed)</li>
            <li>1 cup butter ≈ 227g (2 sticks)</li>
            <li>1 cup honey ≈ 340g</li>
            <li>1 cup oats ≈ 90g</li>
          </ul>

          <FloralDivider variant="vine" size="sm" className="my-6" />

          {/* ⭐ SECTION 3 */}
          <div className="flex items-center gap-3 bg-[#fff0e6]/70 border border-[#e4d5b8] px-4 py-2 rounded-xl mb-4 mt-2 shadow-sm">
            <img src={iconTemp} className="w-7 h-7 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
              Quick Oven Temperature Guide
            </h2>
          </div>

          <ul className="list-disc pl-6 space-y-1">
            <li>300°F = 150°C</li>
            <li>325°F = 165°C</li>
            <li>350°F = 180°C</li>
            <li>375°F = 190°C</li>
            <li>400°F = 200°C</li>
          </ul>

          <FloralDivider variant="vine" size="sm" className="my-6" />

          {/* ⭐ SECTION 4 */}
          <div className="flex items-center gap-3 bg-[#fff0e6]/70 border border-[#e4d5b8] px-4 py-2 rounded-xl mb-4 mt-2 shadow-sm">
            <img src={iconKitchen} className="w-7 h-7 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
              Common Substitutions
            </h2>
          </div>

          <ul className="list-disc pl-6 space-y-1">
            <li>1 egg = ¼ cup applesauce or ½ mashed banana</li>
            <li>1 cup buttermilk = 1 tbsp vinegar + milk to make 1 cup</li>
            <li>1 tbsp cornstarch = 2 tbsp flour (thickening)</li>
            <li>1 cup sour cream = 1 cup Greek yogurt</li>
            <li>1 cup heavy cream = ¾ cup milk + ⅓ cup butter</li>
          </ul>

        </div>
      </div>
    </div>
  );
}
