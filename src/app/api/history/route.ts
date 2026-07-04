import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

// ── GET user history ──
export async function GET(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "30");
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.history.findMany({
        where: { userId: dbUser.id },
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              mealType: true,
              difficulty: true,
              totalTime: true,
              calories: true,
              imageUrl: true,
              cuisine: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.history.count({ where: { userId: dbUser.id } }),
    ]);

    return NextResponse.json({
      history,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET_HISTORY]", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// ── CLEAR history ──
export async function DELETE() {
  try {
    const dbUser = await requireDbUser();

    await prisma.history.deleteMany({
      where: { userId: dbUser.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLEAR_HISTORY]", error);
    return NextResponse.json(
      { error: "Failed to clear history" },
      { status: 500 }
    );
  }
}
