import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import upIcon from "@/assets/icons/mushroom-up.png"; // replace with your cute icon

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 bg-[#f2ebd7] border border-[#e4d5b8] shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
    >
      <img src={upIcon} className="w-8 opacity-80" />
    </motion.button>
  );
}
