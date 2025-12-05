import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f1ed] flex flex-col">
      
      {/* Main content with padding to avoid nav overlap */}
      <div className="flex-grow pb-24">
        <Outlet />
      </div>

      <InstallPrompt />
      <BottomNav />
    </div>
  );
}
