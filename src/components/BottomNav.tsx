import React from "react";
import { NavLink } from "react-router-dom";

import HomeIcon from "../assets/icons/nav/nav-home.png";
import GuideIcon from "../assets/icons/nav/nav-guide.png";
import CalculatorIcon from "../assets/icons/nav/nav-calculator.png";
import PrintIcon from "../assets/icons/nav/nav-printables.png";
import FAQIcon from "../assets/icons/nav/nav-faq.png";
import AboutIcon from "../assets/icons/nav/nav-about.png";
import RecipesIcon from "../assets/icons/nav/nav-recipes.png";


const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon, path: "/" },
  { id: "guide", label: "Guide", icon: GuideIcon, path: "/guide" },
  { id: "calculator", label: "Calc", icon: CalculatorIcon, path: "/calculator" },
{ id: "recipes", label: "Recipes", icon: RecipesIcon, path: "/recipes" },
  { id: "printables", label: "Print", icon: PrintIcon, path: "/printables" },
  { id: "faq", label: "FAQ", icon: FAQIcon, path: "/faq" },
  { id: "about", label: "About", icon: AboutIcon, path: "/about" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[#faf6f0] border-t-2 border-[#a77a72] shadow-[0_-4px_20px_rgba(95,60,67,0.15)] rounded-t-3xl mx-2 mb-0">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? "scale-110 bg-[#b8d3d5]/30" : "hover:bg-[#b8d3d5]/20"
                }`
              }
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="text-xs font-medium text-[#3c6150]">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
