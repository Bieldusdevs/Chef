import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

// ── REMOVE from favorites ──
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await requireDbUser();
    const { id: recipeId } = await params;

    await prisma.favorite.deleteMany({
      where: { userId: dbUser.id, recipeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_FAVORITE]", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
