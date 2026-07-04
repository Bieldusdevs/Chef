import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await requireDbUser();
    const { id } = await params;

    const plan = await prisma.mealPlan.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!plan) {
      return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
    }

    // Also fetch associated shopping list
    const shoppingList = await prisma.shoppingList.findFirst({
      where: { mealPlanId: id, userId: dbUser.id },
    });

    return NextResponse.json({ plan, shoppingList });
  } catch (error) {
    console.error("[GET_MEAL_PLAN]", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await requireDbUser();
    const { id } = await params;

    const plan = await prisma.mealPlan.findFirst({
      where: { id, userId: dbUser.id },
    });
    if (!plan) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete associated shopping lists
    await prisma.shoppingList.deleteMany({ where: { mealPlanId: id } });
    await prisma.mealPlan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_MEAL_PLAN]", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}
