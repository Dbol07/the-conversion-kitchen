import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import whiskIcon from "@/assets/icons/ui/icon-back-to-top.svg";

/* -------------------------------------------------------
   TYPES
-------------------------------------------------------- */
type BackToTopProps = {
  variant?: "fixed" | "inline";
};

/* -------------------------------------------------------
   COMPONENT
-------------------------------------------------------- */
export default function BackToTop({ variant = "fixed" }: BackToTopProps) {
  const [visible, setVisible] = useState(false);
const [showLabel, setShowLabel] = useState(false);


  /* --------------------------------------------------
     SHOW / HIDE ON SCROLL
  --------------------------------------------------- */
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 280);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  /* --------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <motion.div
      /* Entrance animation only — no layout shift */
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}

      /* Fixed size container prevents page shake */
      className={
        variant === "fixed"
          ? "fixed bottom-7 right-7 z-50 flex items-center justify-center"
          : "relative flex items-center justify-center"
      }
      style={{
        width: 72,
        height: 72,
      }}
    >
      <motion.button
        /* Hover uses translate only — no scale reflow */
        whileHover={{ y: -3, rotate: -3 }}
        whileTap={{ scale: 0.95 }}

onMouseEnter={() => setShowLabel(true)}
onMouseLeave={() => setShowLabel(false)}
onFocus={() => setShowLabel(true)}
onBlur={() => setShowLabel(false)}
aria-label="Back to top"

        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }

        /* Border reserved to avoid hover jump */
      className={[
  "relative",
  "w-14 h-14",
  "rounded-full",
  "bg-[#fff8ed]/90",
  "border-2 border-transparent",
  "shadow-lg",
  "flex items-center justify-center",
].join(" ")}

      >
{showLabel && (
  <div
    className="
      absolute
      -top-10
      px-3 py-1
      rounded-full
      bg-[#fff8ed]
      border border-[#e4d5b8]
      text-sm
      text-[#4b3b2f]
      shadow-md
      whitespace-nowrap
      pointer-events-none
    "
  >
    ✨ Back To Top! ✨
  </div>
)}

        {/* Soft glow ring (purely visual, no layout impact) */}
        <span
          className="
            absolute inset-0
            rounded-full
            bg-amber-200/20
            blur-xl
            pointer-events-none
          "
        />

        {/* Whisk icon — larger & stable */}
<img
  src={whiskIcon}
  alt="Back to top"
  className="w-12 h-12" // 48x48 (ideal tap target)
 />

      </motion.button>
    </motion.div>
  );
}
