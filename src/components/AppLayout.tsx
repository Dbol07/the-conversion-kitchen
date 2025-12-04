import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      <Outlet />
      <InstallPrompt />
      <BottomNav />
    </div>
  );
}
