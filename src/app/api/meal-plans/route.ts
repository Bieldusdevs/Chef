import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      prisma.mealPlan.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.mealPlan.count({ where: { userId: dbUser.id } }),
    ]);

    return NextResponse.json({
      plans,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET_MEAL_PLANS]", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}
