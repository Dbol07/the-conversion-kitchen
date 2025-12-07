import React from "react";
import FloralDivider from "../components/FloralDivider";
import DecorativeFrame from "../components/DecorativeFrame";

import BgAbout from "../assets/backgrounds/bg-about.png";
// import linenTexture from "../assets/textures/linen-texture.png";
import { getIcon } from "@/lib/getIcon";

const woodDivider = getIcon("textures/wood-strip.png");
const wheatIcon = getIcon("icons/farm/wheat.png");

const rollingPin = getIcon("icons/farm/rolling-pin.png");
const barnIcon = getIcon("icons/farm/barn.png");
const spoonIcon = getIcon("icons/farm/wooden-spoon.png");

export default function About() {
  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgAbout})` }}
    >
      {/* TRANSLUCENT OVERLAY FOR READABILITY */}
      <div className="bg-[#1b302c]/20 min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto relative">
{/* ⭐ FARMHOUSE DUST MOTES */}
<div className="dust-layer">
  <div className="dust-mote d1"></div>
  <div className="dust-mote d2"></div>
  <div className="dust-mote d3"></div>
  <div className="dust-mote d4"></div>
  <div className="dust-mote d5"></div>
</div>


          {/* ⭐ HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-xl flex items-center justify-center gap-3">
              <img src={barnIcon} className="w-10 h-10 opacity-90" />
              About The Conversion Kitchen
            </h1>
            <p className="text-[#f2ebd7] mt-2 text-lg italic">
              Rustic tools for warm, homemade cooking.
            </p>
          </div>

          <img src={woodDivider} alt="" className="w-full opacity-70 my-6 rounded" />

          {/* ⭐ STORYBOOK CONTAINER */}
          <DecorativeFrame className="mt-8 farm-breeze">
  <div
    className="parchment-card p-8 relative"

              style={{
  backgroundColor: "#fffaf4"
}}

            >
              {/* Little wheat corner embellishment */}
              <img
                src={wheatIcon}
                className="absolute top-3 right-3 w-10 h-10 opacity-60"
              />

              {/* INTRO */}
              <p className="text-[#2f3d37] text-lg leading-relaxed mb-6 flex gap-2">
                <img src={spoonIcon} className="w-6 h-6 opacity-80 mt-1" />
                <span>
                  Welcome to <strong className="text-[#3c6150]">The Conversion Kitchen</strong> — 
                  a warm and inviting digital space inspired by farmhouse baking, slow living, 
                  and handwritten recipe cards passed down through generations.
                </span>
              </p>

              <p className="text-[#2f3d37] text-lg leading-relaxed mb-6">
                This project began with a simple question whispered over a mixing bowl:
                <em> “How many tablespoons are in a cup again?” </em>
                From that small spark, The Conversion Kitchen grew — shaped by the charm of wooden spoons,
                sunlit counters, and the gentle rhythm of homemade cooking.
              </p>

              <img src={woodDivider} alt="" className="w-full opacity-60 my-6 rounded" />

              {/* ⭐ MISSION */}
              <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
                <img src={rollingPin} className="w-7 h-7 opacity-90" />
                Our Mission
              </h2>

              <p className="text-[#2f3d37] text-lg leading-relaxed mb-6">
                To bring clarity and comfort to the kitchen — whether you're baking bread on a rainy morning,
                preparing Sunday dinner, or trying a recipe clipped from a magazine.  
                We aim for a feeling of **calm usefulness**, the way a well-loved farmhouse cookbook feels.
              </p>

              <FloralDivider variant="vine" className="my-8" />

              {/* ⭐ WHAT YOU’LL FIND */}
              <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
                <img src={wheatIcon} className="w-8 h-8 opacity-90" />
                In This Farm Kitchen
              </h2>

              <ul className="list-disc pl-6 text-[#2f3d37] text-lg space-y-3 mb-6">
                <li>Simple, accurate <strong>ingredient & recipe converters</strong>.</li>
                <li>A growing collection of <strong>cozy recipes</strong> with rustic charm.</li>
                <li><strong>Printable farmhouse charts</strong> for your binder or pantry wall.</li>
                <li>A friendly <strong>Kitchen Conversions Guide</strong> for everyday reference.</li>
                <li>An ad-free, clutter-free place designed for slow, happy cooking.</li>
              </ul>

              <FloralDivider variant="mushroom" className="my-8" />

              {/* ⭐ MEET THE CREATOR */}
              <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
                <img src={spoonIcon} className="w-7 h-7 opacity-90" />
                Meet the Creator
              </h2>

              <div className="bg-[#fff4e0]/80 border border-[#e4d5b8] p-6 rounded-xl shadow mb-6">
                <p className="text-[#2f3d37] text-lg leading-relaxed mb-3">
                  The Conversion Kitchen was created by someone who loves:
                </p>

                <ul className="list-disc pl-6 text-[#2f3d37] text-lg space-y-2">
                  <li>Farmhouse aesthetics & slow living</li>
                  <li>The smell of warm bread and vanilla</li>
                  <li>Organizing recipes into beautiful systems</li>
                  <li>Tools that make home cooking feel peaceful</li>
                </ul>

                <p className="text-[#2f3d37] text-lg leading-relaxed mt-4">
                  This app is a heartfelt project — built with the intention of making cooking
                  feel more grounded, confident, and enjoyable.
                </p>
              </div>

              <FloralDivider variant="vine" className="my-8" />

              {/* ⭐ FUTURE PLANS */}
              <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
                🐓 What's Ahead for This Farm Kitchen
              </h2>

              <p className="text-[#2f3d37] text-lg leading-relaxed mb-6">
                More printables, more cozy recipes, pantry organization tools, seasonal cooking
                guides, and eventually a meal planner.  
                Everything added will keep the same soft, rustic personality you see now.
              </p>

              <img src={woodDivider} alt="" className="w-full opacity-50 my-6 rounded" />

              {/* ⭐ SIGNATURE BLOCK */}
              <div className="bg-[#dfece5]/70 p-6 rounded-xl mt-8 shadow">
                <p className="text-[#2f3d37] text-lg leading-relaxed text-center italic">
                  “Thank you for visiting this little farmhouse kitchen.  
                  May your home always smell like something warm cooling on the counter.”  
                </p>
                <p className="text-center text-[#4b3b2f] font-semibold mt-4">
                  – Made with care by Nicole 🤍
                </p>
              </div>

            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
