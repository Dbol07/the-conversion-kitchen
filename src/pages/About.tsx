import React from "react";
import FloralDivider from "@/components/FloralDivider";
import DecorativeFrame from "@/components/DecorativeFrame";

// Background image
import aboutBg from "@/assets/backgrounds/bg-about.png";

export default function About() {
  return (
    <div
      className="min-h-screen w-full pb-28"
      style={{
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ⭐ Lightened overlay */}
      <div className="bg-[#1b302c]/15 min-h-screen px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-4">
            About Us
          </h1>

          <FloralDivider variant="mushroom" />

          <DecorativeFrame className="mt-8">
            <div className="p-6 space-y-6">

              {/* ⭐ Expanded cottagecore bio text */}
              <p className="text-[#1b302c] text-lg leading-relaxed">
                Welcome to <strong className="text-[#3c6150]">The Conversion Kitchen</strong> —
                your cozy corner of the internet where warm cottagecore charm meets practical,
                everyday kitchen magic.
              </p>

              <p className="text-[#1b302c] text-lg leading-relaxed">
                We built this app for home bakers, recipe explorers, and curious cooks — the kind of
                people who love handwritten recipe cards, vintage cookware, and the comforting ritual
                of stirring something delicious on the stove.
              </p>

              <p className="text-[#1b302c] text-lg leading-relaxed">
                Whether you're scaling a favorite family recipe, converting cups to grams,
                or printing a quick kitchen chart for your fridge, our goal is to make cooking
                feel simple, stress-free, and a little bit magical.
              </p>

              <p className="text-[#1b302c] text-lg leading-relaxed">
                Every page, graphic, and tool in this app is crafted to blend gentle cottage vibes
                with practical functionality — the perfect companion for anyone who loves cozy
                aesthetics as much as they love good food.
              </p>

              {/* ⭐ Matching site aesthetic gradient box */}
              <div className="bg-gradient-to-r from-[#f7e6c4] via-[#f5d6b1] to-[#f2c9a0] p-6 rounded-xl shadow-md">
                <p className="text-[#5f3c43] text-lg leading-relaxed text-center italic font-medium">
                  Thank you for being here — let’s make something beautiful and delicious together. 🧡
                </p>
              </div>

            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
