import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/auth";

// ── GET single recipe ──
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        favorites: { select: { userId: true } },
        _count: { select: { favorites: true } },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const dbUser = await getDbUser();
    const isFavorited = dbUser
      ? recipe.favorites.some((f) => f.userId === dbUser.id)
      : false;

    return NextResponse.json({
      ...recipe,
      isFavorited,
      favoriteCount: recipe._count.favorites,
    });
  } catch (error) {
    console.error("[GET_RECIPE]", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// ── DELETE recipe ──
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await getDbUser();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    if (recipe.userId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.recipe.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_RECIPE]", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
