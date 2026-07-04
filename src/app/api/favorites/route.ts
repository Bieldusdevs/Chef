import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";
import { z } from "zod";

// ── GET user favorites ──
export async function GET(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: dbUser.id },
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              description: true,
              mealType: true,
              difficulty: true,
              totalTime: true,
              calories: true,
              imageUrl: true,
              cuisine: true,
              tags: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.favorite.count({ where: { userId: dbUser.id } }),
    ]);

    const mapped = favorites.map((f: typeof favorites[number]) => ({
      ...f.recipe,
      favoritedAt: f.createdAt,
    }));

    return NextResponse.json({
      favorites: mapped,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET_FAVORITES]", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// ── ADD to favorites ──
export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const body = await req.json();
    const { recipeId } = z.object({ recipeId: z.string().cuid() }).parse(body);

    // Check recipe exists
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Upsert to avoid duplicates
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_recipeId: { userId: dbUser.id, recipeId },
      },
      create: { userId: dbUser.id, recipeId },
      update: {},
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("[ADD_FAVORITE]", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}
