import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f2ebd7] flex flex-col">
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1">
        <Outlet />   {/* ⭐ THIS IS WHAT WAS MISSING ⭐ */}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="w-full mt-4">
        {/* keep your bottom nav here */}
      </div>
    </div>
  );
}
