import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

export async function GET() {
  try {
    const dbUser = await requireDbUser();

    const [
      totalRecipes,
      totalFavorites,
      totalMealPlans,
      recentHistory,
      mealTypeBreakdown,
      avgNutrition,
    ] = await Promise.all([
      // Total recipes generated
      prisma.recipe.count({ where: { userId: dbUser.id } }),

      // Total favorites
      prisma.favorite.count({ where: { userId: dbUser.id } }),

      // Total meal plans
      prisma.mealPlan.count({ where: { userId: dbUser.id } }),

      // Last 5 history entries
      prisma.history.findMany({
        where: { userId: dbUser.id },
        include: {
          recipe: {
            select: { id: true, name: true, mealType: true, totalTime: true, calories: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Meal type breakdown
      prisma.recipe.groupBy({
        by: ["mealType"],
        where: { userId: dbUser.id },
        _count: true,
      }),

      // Average nutrition across all user recipes
      prisma.recipe.aggregate({
        where: { userId: dbUser.id },
        _avg: {
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
          fiber: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalRecipes,
      totalFavorites,
      totalMealPlans,
      recentHistory,
      mealTypeBreakdown: mealTypeBreakdown.map((m) => ({
        mealType: m.mealType,
        count: m._count,
      })),
      avgNutrition: {
        calories: Math.round(avgNutrition._avg.calories || 0),
        protein: Math.round((avgNutrition._avg.protein || 0) * 10) / 10,
        carbs: Math.round((avgNutrition._avg.carbs || 0) * 10) / 10,
        fat: Math.round((avgNutrition._avg.fat || 0) * 10) / 10,
        fiber: Math.round((avgNutrition._avg.fiber || 0) * 10) / 10,
      },
    });
  } catch (error) {
    console.error("[USER_STATS]", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
