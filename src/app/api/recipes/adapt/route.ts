import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adaptRecipeByDiet } from "@/lib/gemini";
import { adaptRecipeSchema } from "@/lib/validators/recipe";
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
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = adaptRecipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { recipeId, diet } = parsed.data;

    const original = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!original) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const adapted = await adaptRecipeByDiet(
      original as unknown as Record<string, unknown>,
      diet
    );

    const recipe = await prisma.recipe.create({
      data: {
        userId: dbUser.id,
        name: adapted.name,
        description: adapted.description,
        mealType: adapted.mealType,
        difficulty: adapted.difficulty,
        prepTime: adapted.prepTime,
        cookTime: adapted.cookTime,
        totalTime: adapted.totalTime,
        servings: adapted.servings,
        ingredients: adapted.ingredients,
        steps: adapted.steps,
        tips: adapted.tips,
        substitutions: adapted.substitutions,
        calories: adapted.calories,
        protein: adapted.protein,
        carbs: adapted.carbs,
        fat: adapted.fat,
        fiber: adapted.fiber,
        sugar: adapted.sugar ?? null,
        sodium: adapted.sodium ?? null,
        isVegan: adapted.isVegan,
        isVegetarian: adapted.isVegetarian,
        isGlutenFree: adapted.isGlutenFree,
        isDairyFree: adapted.isDairyFree,
        isKeto: adapted.isKeto,
        isLowCarb: adapted.isLowCarb,
        tags: adapted.tags,
        cuisine: adapted.cuisine,
        sourceIngredients: original.sourceIngredients,
      },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("[ADAPT_RECIPE]", error);
    return NextResponse.json(
      { error: "Failed to adapt recipe" },
      { status: 500 }
    );
  }
}
