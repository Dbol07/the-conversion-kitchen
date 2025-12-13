import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import whiskIcon from "@/assets/fallback/whisk-icon.png";

type BackToTopProps = {
  variant?: "fixed" | "inline";
};

export default function BackToTop({
  variant = "fixed",
}: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 280);
    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
className={
  variant === "fixed"
    ? "fixed bottom-7 right-7 z-50 flex flex-col items-center"
    : "relative flex flex-col items-center"
}
    >
      {/* Tooltip */}
      {showTip && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          className="
            mb-2 px-3 py-1 
            text-xs font-medium 
            text-[#4b3b2f]
            bg-[#fffaf4]/95 
            border border-[#e5d4b5]
            rounded-xl shadow-md 
            backdrop-blur-sm
          "
        >
          Back to top ✨
        </motion.div>
      )}

      <motion.button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setShowTip(true);
          setTimeout(() => setShowTip(false), 1200);
        }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        whileHover={{ scale: 1.1, rotate: -3 }}
        whileTap={{ scale: 0.9 }}
        className="
          relative w-16 h-16 
          rounded-full 
          bg-[#fff8ed]/90 
          border border-[#e7d8bc] 
          shadow-lg
          flex items-center justify-center
          hover:bg-[#f4e9d3]
          transition duration-200
        "
      >
        {/* Glow ring */}
        <span
          className="
            absolute inset-0 
            rounded-full 
            bg-amber-200/20 
            blur-xl
            pointer-events-none
          "
        ></span>

        {/* Sparkles */}
        <motion.span
          className="absolute -top-1 left-1 text-amber-400 text-xs"
          animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.span>

        {/* Whisk icon */}
        <img
          src={whiskIcon}
          alt="Back to top whisk"
className="w-24 h-24 relative z-10 opacity-95"
        />
      </motion.button>
    </motion.div>
  );
}
