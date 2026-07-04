import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { suggestLeftoverRecipes } from "@/lib/gemini";
import { leftoversSchema } from "@/lib/validators/recipe";
import { requireDbUser } from "@/lib/auth";
import { apiRateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const { success } = await apiRateLimit.limit(dbUser.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = leftoversSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const recipeData = await suggestLeftoverRecipes(parsed.data.leftovers);

    const recipe = await prisma.recipe.create({
      data: {
        userId: dbUser.id,
        name: recipeData.name,
        description: recipeData.description,
        mealType: recipeData.mealType,
        difficulty: recipeData.difficulty,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        totalTime: recipeData.totalTime,
        servings: recipeData.servings,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        tips: recipeData.tips,
        substitutions: recipeData.substitutions,
        calories: recipeData.calories,
        protein: recipeData.protein,
        carbs: recipeData.carbs,
        fat: recipeData.fat,
        fiber: recipeData.fiber,
        isVegan: recipeData.isVegan,
        isVegetarian: recipeData.isVegetarian,
        isGlutenFree: recipeData.isGlutenFree,
        isDairyFree: recipeData.isDairyFree,
        isKeto: recipeData.isKeto,
        isLowCarb: recipeData.isLowCarb,
        tags: [...(recipeData.tags || []), "leftover-makeover"],
        cuisine: recipeData.cuisine,
        sourceIngredients: parsed.data.leftovers,
      },
    });

    await prisma.history.create({
      data: {
        userId: dbUser.id,
        recipeId: recipe.id,
        query: `Leftovers: ${parsed.data.leftovers.join(", ")}`,
        mealType: recipeData.mealType,
      },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("[LEFTOVERS]", error);
    return NextResponse.json(
      { error: "Failed to generate leftover recipe" },
      { status: 500 }
    );
  }
}
