"use client";

import { useRecipeStore } from "@/store/recipe-store";

const STEPS = [
  "Analyzing your ingredients…",
  "Selecting recipe style…",
  "Writing detailed instructions…",
  "Calculating nutrition…",
  "Adding chef's tips…",
];

export function GeneratingOverlay() {
  const { isGenerating, generationStep } = useRecipeStore();

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-xl z-[50000] flex items-center justify-center flex-col gap-8 animate-fade-in-up">
      {/* Spinner */}
      <div className="w-20 h-20 relative">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-r-[rgba(74,222,128,0.3)]"
          style={{ animation: "spin 1.5s linear infinite reverse" }}
        />
      </div>

      {/* Text */}
      <div className="text-lg font-semibold animate-pulse-slow">
        Creating your recipe…
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2.5 text-sm text-muted-2">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`transition-colors duration-300 ${
              i <= generationStep ? "text-accent" : ""
            }`}
          >
            {i <= generationStep ? "✅" : "⏳"} {step}
          </div>
        ))}
      </div>
    </div>
  );
}
