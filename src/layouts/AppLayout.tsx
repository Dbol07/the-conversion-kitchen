import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f2ebd7] flex flex-col">

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full mx-auto max-w-5xl px-4 pb-24">
        <Outlet />
      </main>

      {/* BOTTOM NAVIGATION */}
      <footer className="w-full fixed bottom-0 left-0 bg-white shadow-lg z-50">
        <BottomNav />
      </footer>
    </div>
  );
}
