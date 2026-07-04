import { NextRequest, NextResponse } from "next/server";
import { suggestSubstitutions } from "@/lib/gemini";
import { substitutionsSchema } from "@/lib/validators/recipe";
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
    const parsed = substitutionsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await suggestSubstitutions(
      parsed.data.ingredients,
      parsed.data.reason
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[SUGGEST_SUBSTITUTIONS]", error);
    return NextResponse.json(
      { error: "Failed to suggest substitutions" },
      { status: 500 }
    );
  }
}
