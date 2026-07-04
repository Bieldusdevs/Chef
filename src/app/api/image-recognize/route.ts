import { NextRequest, NextResponse } from "next/server";
import { recognizeIngredientsFromImage } from "@/lib/gemini";
import { imageRecognizeSchema } from "@/lib/validators/recipe";
import { requireDbUser, isPremium } from "@/lib/auth";
import { apiRateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const dbUser = await requireDbUser();

    if (!isPremium(dbUser)) {
      return NextResponse.json(
        { error: "Image recognition is a Premium feature." },
        { status: 403 }
      );
    }

    const { success } = await apiRateLimit.limit(dbUser.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = imageRecognizeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await recognizeIngredientsFromImage(
      parsed.data.image,
      parsed.data.mimeType
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[IMAGE_RECOGNIZE]", error);
    return NextResponse.json(
      { error: "Failed to recognize ingredients" },
      { status: 500 }
    );
  }
}
