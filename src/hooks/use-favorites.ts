"use client";

import { useState, useCallback } from "react";

export function useFavorites() {
  const [isToggling, setIsToggling] = useState(false);

  const addFavorite = useCallback(async (recipeId: string) => {
    setIsToggling(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      if (!res.ok) throw new Error("Failed to add favorite");
      return true;
    } catch {
      return false;
    } finally {
      setIsToggling(false);
    }
  }, []);

  const removeFavorite = useCallback(async (recipeId: string) => {
    setIsToggling(true);
    try {
      const res = await fetch(`/api/favorites/${recipeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      return true;
    } catch {
      return false;
    } finally {
      setIsToggling(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (recipeId: string, isFavorited: boolean) => {
      if (isFavorited) return removeFavorite(recipeId);
      return addFavorite(recipeId);
    },
    [addFavorite, removeFavorite]
  );

  return { toggleFavorite, addFavorite, removeFavorite, isToggling };
}
