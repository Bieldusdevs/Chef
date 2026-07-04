"use client";

import { useRecipeStore } from "@/store/recipe-store";
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
    dietaryPreferences,
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

    setIsGenerating(true);
    setError(null);
    setGenerationStep(0);

    // Animate generation steps
    const stepInterval = setInterval(() => {
      setGenerationStep(
        useRecipeStore.getState().generationStep < GENERATION_STEPS.length - 1
          ? useRecipeStore.getState().generationStep + 1
          : useRecipeStore.getState().generationStep
      );
    }, 800);

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          mealType,
          dietaryPreferences,
          servings,
          language,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate recipe");
      }

      const data = await response.json();
      setCurrentRecipe(data.recipe);
      setRemaining(data.remaining);
    } catch (err) {
      clearInterval(stepInterval);
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  }, [
    ingredients,
    mealType,
    dietaryPreferences,
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
