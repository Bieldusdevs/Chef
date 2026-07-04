import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateRecipe } from "@/lib/gemini";
import { generateRecipeSchema } from "@/lib/validators/recipe";
import { freeRateLimit, premiumRateLimit } from "@/lib/redis";
import { getDbUser, isPremium } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ── Rate Limit ──
    const premium = isPremium(dbUser);
    const limiter = premium ? premiumRateLimit : freeRateLimit;
    const { success, remaining, reset } = await limiter.limit(dbUser.id);

    if (!success) {
      return NextResponse.json(
        {
          error: premium
            ? "Daily limit reached. Try again tomorrow."
            : "Free daily limit reached. Upgrade to Premium for unlimited recipes.",
          remaining: 0,
          resetAt: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    // ── Validate Input ──
    const body = await req.json();
    const parsed = generateRecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { ingredients, mealType, dietaryPreferences, servings, language } =
      parsed.data;

    // ── Generate with Gemini 2.5 Flash ──
    const recipeData = await generateRecipe({
      ingredients,
      mealType,
      dietaryPreferences,
      servings,
      language,
    });

    // ── Save to DB ──
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
        sugar: recipeData.sugar ?? null,
        sodium: recipeData.sodium ?? null,
        isVegan: recipeData.isVegan,
        isVegetarian: recipeData.isVegetarian,
        isGlutenFree: recipeData.isGlutenFree,
        isDairyFree: recipeData.isDairyFree,
        isKeto: recipeData.isKeto,
        isLowCarb: recipeData.isLowCarb,
        tags: recipeData.tags,
        cuisine: recipeData.cuisine,
        sourceIngredients: ingredients,
      },
    });

    // ── Save to History ──
    await prisma.history.create({
      data: {
        userId: dbUser.id,
        recipeId: recipe.id,
        query: ingredients.join(", "),
        mealType: recipeData.mealType,
      },
    });

    return NextResponse.json(
      {
        recipe,
        remaining,
        isPremium: premium,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[GENERATE_RECIPE]", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
