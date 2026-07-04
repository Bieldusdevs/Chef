"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / totalHeight) * 100;
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[10000]"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #4ade80, #22c55e)",
        boxShadow: "0 0 10px rgba(74,222,128,0.3)",
        transition: "width 0.1s linear",
      }}
    />
  );
}
