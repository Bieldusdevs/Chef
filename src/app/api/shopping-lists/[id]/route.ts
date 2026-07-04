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

    const list = await prisma.shoppingList.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!list) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error("[GET_SHOPPING_LIST]", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping list" },
      { status: 500 }
    );
  }
}

// Update items (check/uncheck)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUser = await requireDbUser();
    const { id } = await params;

    const list = await prisma.shoppingList.findFirst({
      where: { id, userId: dbUser.id },
    });
    if (!list) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();

    const updated = await prisma.shoppingList.update({
      where: { id },
      data: {
        items: body.items ?? list.items,
        name: body.name ?? list.name,
      },
    });

    return NextResponse.json({ list: updated });
  } catch (error) {
    console.error("[UPDATE_SHOPPING_LIST]", error);
    return NextResponse.json(
      { error: "Failed to update shopping list" },
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

    await prisma.shoppingList.deleteMany({
      where: { id, userId: dbUser.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_SHOPPING_LIST]", error);
    return NextResponse.json(
      { error: "Failed to delete shopping list" },
      { status: 500 }
    );
  }
}
