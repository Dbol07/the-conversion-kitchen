import React, { useEffect, useMemo, useState } from "react";
import DecorativeFrame from "../components/DecorativeFrame";
import FloralDivider from "../components/FloralDivider";

import BgMain from "../assets/backgrounds/bg-main.jpg";
import DashboardIcon from "../assets/icons/sections/sec-dashboard.png";

import IconCalc from "../assets/icons/nav/nav-calculator.png";
import IconGuide from "../assets/icons/nav/nav-guide.png";
import IconPrint from "../assets/icons/nav/nav-printables.png";
import IconFAQ from "../assets/icons/nav/nav-faq.png";

import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // ---- Featured Recipe Picker --------------------------------------------
  const recipes = useMemo(
    () => [
      {
        title: "Cinnamon Swirl Coffee Cake",
        description: "Perfect with a cozy mug of tea — use the Converter to halve or double it.",
      },
      {
        title: "Herbed Buttermilk Biscuits",
        description: "Great for testing your oven temp conversions and butter measurements.",
      },
      {
        title: "One-Bowl Brownies",
        description: "Experiment with metric vs US cups using the weight conversions.",
      },
      {
        title: "Creamy Mushroom Pasta",
        description: "Use the liquid conversions to adjust cream and stock measurements.",
      },
    ],
    []
  );

  const featuredRecipe = useMemo(() => {
    const idx = Math.floor(Math.random() * recipes.length);
    return recipes[idx];
  }, [recipes]);

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgMain})` }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* ---------------------------------------------------- */}
          {/* BEAUTIFUL CENTERED HEADER */}
          {/* ---------------------------------------------------- */}

          <header className="flex flex-col items-center text-center mb-10 mt-4">
            <img
              src={DashboardIcon}
              alt="The Conversion Kitchen"
              className="
                drop-shadow-lg
                w-12 h-12
                sm:w-16 sm:h-16
                lg:w-20 lg:h-20
                mb-3
              "
            />

            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              The Conversion Kitchen
            </h1>

            <p className="text-white/85 text-sm sm:text-base mt-1">
              Your cozy hub for all things kitchen math
            </p>
          </header>

          <FloralDivider variant="vine" />

          {/* ---------------------------------------------------- */}
          {/* QUICK TOOLS */}
          {/* ---------------------------------------------------- */}

          <DecorativeFrame className="mt-6">
            <div className="parchment-card p-6">
              <h2 className="text-xl font-bold text-[#1b302c] mb-3 text-center">
                Quick Tools
              </h2>
              <p className="text-[#5f3c43] text-sm text-center mb-5">
                Jump straight into the tool you need right now.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/calculator"
                  className="flex flex-col items-center bg-[#b8d3d5]/20 hover:bg-[#b8d3d5]/40 p-4 rounded-xl transition-all shadow-md"
                >
                  <img src={IconCalc} className="w-10 h-10 mb-2" />
                  <span className="text-sm font-semibold text-[#1b302c]">Calculator</span>
                </Link>

                <Link
                  to="/guide"
                  className="flex flex-col items-center bg-[#b8d3d5]/20 hover:bg-[#b8d3d5]/40 p-4 rounded-xl transition-all shadow-md"
                >
                  <img src={IconGuide} className="w-10 h-10 mb-2" />
                  <span className="text-sm font-semibold text-[#1b302c]">Guide</span>
                </Link>

                <Link
                  to="/printables"
                  className="flex flex-col items-center bg-[#b8d3d5]/20 hover:bg-[#b8d3d5]/40 p-4 rounded-xl transition-all shadow-md"
                >
                  <img src={IconPrint} className="w-10 h-10 mb-2" />
                  <span className="text-sm font-semibold text-[#1b302c]">Printables</span>
                </Link>

                <Link
                  to="/faq"
                  className="flex flex-col items-center bg-[#b8d3d5]/20 hover:bg-[#b8d3d5]/40 p-4 rounded-xl transition-all shadow-md"
                >
                  <img src={IconFAQ} className="w-10 h-10 mb-2" />
                  <span className="text-sm font-semibold text-[#1b302c]">FAQ</span>
                </Link>
              </div>
            </div>
          </DecorativeFrame>

          {/* ---------------------------------------------------- */}
          {/* RECENT CONVERSIONS (Placeholder) */}
          {/* ---------------------------------------------------- */}

          <FloralDivider variant="vine" />

          <DecorativeFrame className="mt-6">
            <div className="parchment-card p-6">
              <h2 className="text-xl font-bold text-[#1b302c] mb-3">Recent Conversions</h2>
              <p className="text-[#5f3c43] text-sm mb-2">
                Soon this will show your latest conversions from the Calculator.
              </p>

              <p className="italic text-[#5f3c43]">
                No saved history yet — try a few conversions and we’ll hook this up next.
              </p>
            </div>
          </DecorativeFrame>

          {/* ---------------------------------------------------- */}
          {/* RECIPE INSPIRATION — NOW CLICKABLE */}
          {/* ---------------------------------------------------- */}

          <FloralDivider variant="mushroom" />

          <DecorativeFrame className="mt-6 mb-10">
            <div
              className="parchment-card p-6 cursor-pointer hover:bg-[#b8d3d5]/30 transition-all rounded-xl"
              onClick={() => navigate("/guide")}
            >
              <h2 className="text-xl font-bold text-[#1b302c] mb-2">
                Cozy Recipe Inspiration
              </h2>

              <p className="text-[#5f3c43] text-sm mb-4">
                A little nudge for your next kitchen adventure.
              </p>

              <div className="bg-[#b8d3d5]/40 p-4 rounded-xl shadow-inner">
                <h3 className="text-lg font-semibold text-[#1b302c] mb-1">
                  {featuredRecipe.title}
                </h3>
                <p className="text-[#5f3c43] text-sm">{featuredRecipe.description}</p>
              </div>
            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
