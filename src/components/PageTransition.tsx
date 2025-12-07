import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    setFadeIn(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className={`page-transition ${fadeIn ? "page-in" : "page-out"}`}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}
