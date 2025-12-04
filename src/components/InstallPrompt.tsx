import React, { useState, useEffect } from "react";
import AppIcon from "../assets/icons/icon-512.png";

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 parchment-card p-4 animate-slide-up max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <img
          src={AppIcon}
          alt="App Icon"
          className="w-12 h-12 rounded-xl"
        />
        <div className="flex-1">
          <h3 className="font-bold text-[#1b302c]">Install The Conversion Kitchen</h3>
          <p className="text-sm text-[#5f3c43]">Add to home screen for quick access</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 py-2 text-[#5f3c43] hover:bg-[#b8d3d5]/20 rounded-lg transition-all"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 py-2 bg-[#3c6150] text-white rounded-lg hover:bg-[#5f3c43] transition-all"
        >
          Install
        </button>
      </div>
    </div>
  );
}
