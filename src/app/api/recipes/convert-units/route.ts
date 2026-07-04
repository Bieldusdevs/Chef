import { NextRequest, NextResponse } from "next/server";
import { convertUnits } from "@/lib/gemini";
import { convertUnitsSchema } from "@/lib/validators/recipe";
import { requireDbUser } from "@/lib/auth";
import { apiRateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const { success } = await apiRateLimit.limit(dbUser.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = convertUnitsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await convertUnits(parsed.data.items, parsed.data.targetSystem);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CONVERT_UNITS]", error);
    return NextResponse.json(
      { error: "Failed to convert units" },
      { status: 500 }
    );
  }
}
