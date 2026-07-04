"use client";

import { useRecipeStore } from "@/store/recipe-store";
import { useSettingsStore } from "@/store/settings-store";
import { useCallback } from "react";

const GENERATION_STEPS = [
  "Analyzing your ingredients…",
  "Selecting recipe style…",
  "Writing detailed instructions…",
  "Calculating nutrition…",
  "Adding chef's tips…",
];

export function useGenerateRecipe() {
  const {
    ingredients,
    mealType,
    servings,
    language,
    isGenerating,
    generationStep,
    setIsGenerating,
    setGenerationStep,
    setCurrentRecipe,
    setError,
    setRemaining,
  } = useRecipeStore();

  const generate = useCallback(async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    // Get API key from settings store
    const apiKey = useSettingsStore.getState().geminiKey;

    if (!apiKey && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      // No key available — open settings
      useSettingsStore.getState().setShowSettings(true);
      setError("Please add your Gemini API key first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep(0);

    // Animate steps
    const stepInterval = setInterval(() => {
      const current = useRecipeStore.getState().generationStep;
      if (current < GENERATION_STEPS.length - 1) {
        setGenerationStep(current + 1);
      }
    }, 800);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          mealType,
          servings,
          language,
          apiKey: apiKey || undefined,
        }),
      });

      clearInterval(stepInterval);

      const data = await response.json();

      if (!response.ok) {
        // Handle specific errors
        if (data.error === "NO_API_KEY") {
          useSettingsStore.getState().setShowSettings(true);
          throw new Error("Please add your Gemini API key in Settings.");
        }
        if (data.error === "INVALID_API_KEY") {
          useSettingsStore.getState().setShowSettings(true);
          throw new Error("Invalid API key. Please check your key in Settings.");
        }
        if (data.error === "QUOTA_EXCEEDED") {
          throw new Error("API quota exceeded. Try again later or use a different key.");
        }
        throw new Error(data.message || data.error || "Failed to generate recipe");
      }

      setCurrentRecipe(data.recipe);
      setRemaining(data.remaining);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  }, [
    ingredients,
    mealType,
    servings,
    language,
    setIsGenerating,
    setGenerationStep,
    setCurrentRecipe,
    setError,
    setRemaining,
  ]);

  return {
    generate,
    isGenerating,
    generationStep,
    generationSteps: GENERATION_STEPS,
  };
}
