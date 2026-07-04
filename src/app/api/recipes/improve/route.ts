import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { improveRecipe } from "@/lib/gemini";
import { improveRecipeSchema } from "@/lib/validators/recipe";
import { requireDbUser, isPremium } from "@/lib/auth";
import { apiRateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    if (!isPremium(dbUser)) {
      return NextResponse.json(
        { error: "Premium feature. Please upgrade." },
        { status: 403 }
      );
    }

    const { success } = await apiRateLimit.limit(dbUser.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = improveRecipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { recipeId, feedback } = parsed.data;

    // Fetch original recipe
    const original = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!original) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Improve with Gemini
    const improved = await improveRecipe(
      original as unknown as Record<string, unknown>,
      feedback
    );

    // Save as new recipe
    const recipe = await prisma.recipe.create({
      data: {
        userId: dbUser.id,
        name: improved.name,
        description: improved.description,
        mealType: improved.mealType,
        difficulty: improved.difficulty,
        prepTime: improved.prepTime,
        cookTime: improved.cookTime,
        totalTime: improved.totalTime,
        servings: improved.servings,
        ingredients: improved.ingredients,
        steps: improved.steps,
        tips: improved.tips,
        substitutions: improved.substitutions,
        calories: improved.calories,
        protein: improved.protein,
        carbs: improved.carbs,
        fat: improved.fat,
        fiber: improved.fiber,
        sugar: improved.sugar ?? null,
        sodium: improved.sodium ?? null,
        isVegan: improved.isVegan,
        isVegetarian: improved.isVegetarian,
        isGlutenFree: improved.isGlutenFree,
        isDairyFree: improved.isDairyFree,
        isKeto: improved.isKeto,
        isLowCarb: improved.isLowCarb,
        tags: improved.tags,
        cuisine: improved.cuisine,
        sourceIngredients: original.sourceIngredients,
      },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("[IMPROVE_RECIPE]", error);
    return NextResponse.json(
      { error: "Failed to improve recipe" },
      { status: 500 }
    );
  }
}
