import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMealPlan } from "@/lib/gemini";
import { generateMealPlanSchema } from "@/lib/validators/recipe";
import { requireDbUser, isPremium } from "@/lib/auth";
import { apiRateLimit } from "@/lib/redis";
import { sendMealPlanEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    if (!isPremium(dbUser)) {
      return NextResponse.json(
        { error: "Meal planning is a Premium feature." },
        { status: 403 }
      );
    }

    const { success } = await apiRateLimit.limit(dbUser.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = generateMealPlanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { days, preferences, calorieTarget, language } = parsed.data;

    // Generate with Gemini
    const planData = await generateMealPlan({
      days,
      preferences,
      calorieTarget,
      language,
    });

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days - 1);

    // Save to DB
    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: dbUser.id,
        name: planData.name || `${days}-Day Meal Plan`,
        startDate,
        endDate,
        days: planData.days,
        avgCalories: planData.avgCalories,
        avgProtein: planData.avgProtein,
        avgCarbs: planData.avgCarbs,
        avgFat: planData.avgFat,
      },
    });

    // Auto-create shopping list
    if (planData.shoppingList?.length > 0) {
      await prisma.shoppingList.create({
        data: {
          userId: dbUser.id,
          name: `Shopping List — ${planData.name || "Meal Plan"}`,
          items: planData.shoppingList.map(
            (item: { name: string; quantity: string; category: string }) => ({
              ...item,
              checked: false,
            })
          ),
          mealPlanId: mealPlan.id,
        },
      });
    }

    // Send email notification
    try {
      await sendMealPlanEmail(
        dbUser.email,
        dbUser.name || "Chef",
        mealPlan.name
      );
    } catch {
      // Don't fail if email fails
      console.warn("Failed to send meal plan email");
    }

    return NextResponse.json({ mealPlan, shoppingList: planData.shoppingList }, { status: 201 });
  } catch (error) {
    console.error("[GENERATE_MEAL_PLAN]", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
