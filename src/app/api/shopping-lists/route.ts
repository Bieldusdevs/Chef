import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser, isPremium } from "@/lib/auth";
import { createShoppingListSchema } from "@/lib/validators/recipe";

export async function GET() {
  try {
    const dbUser = await requireDbUser();

    const lists = await prisma.shoppingList.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ lists });
  } catch (error) {
    console.error("[GET_SHOPPING_LISTS]", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping lists" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    if (!isPremium(dbUser)) {
      return NextResponse.json(
        { error: "Shopping lists are a Premium feature." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createShoppingListSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const list = await prisma.shoppingList.create({
      data: {
        userId: dbUser.id,
        name: parsed.data.name,
        items: parsed.data.items,
        mealPlanId: parsed.data.mealPlanId,
      },
    });

    return NextResponse.json({ list }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_SHOPPING_LIST]", error);
    return NextResponse.json(
      { error: "Failed to create shopping list" },
      { status: 500 }
    );
  }
}
