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
    <div className="overlay">
      <div className="spinner" />
      <div style={{ fontSize: "1.15rem", fontWeight: 600, animation: "pulse 2s ease infinite" }}>
        Creating your recipe…
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.85rem", color: "var(--muted-2)" }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ color: i <= generationStep ? "var(--accent)" : undefined, transition: "color 0.3s" }}>
            {i <= generationStep ? "✅" : "⏳"} {step}
          </div>
        ))}
      </div>
    </div>
  );
}
