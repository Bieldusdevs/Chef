import { NextRequest, NextResponse } from "next/server";
import { explainTechnique } from "@/lib/gemini";
import { explainTechniqueSchema } from "@/lib/validators/recipe";
import { requireDbUser } from "@/lib/auth";
import { apiRateLimit, getCached, setCache } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    const { success } = await apiRateLimit.limit(dbUser.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = explainTechniqueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const cacheKey = `technique:${parsed.data.technique.toLowerCase().trim()}`;
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const result = await explainTechnique(parsed.data.technique);

    // Cache for 24 hours — techniques don't change
    await setCache(cacheKey, result, 86400);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[EXPLAIN_TECHNIQUE]", error);
    return NextResponse.json(
      { error: "Failed to explain technique" },
      { status: 500 }
    );
  }
}
