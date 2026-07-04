import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

// ═══════════════════════════════════════════
// PUBLIC RECIPE GENERATION ENDPOINT
// Works with just GEMINI_API_KEY — no DB, no auth, no Redis
// ═══════════════════════════════════════════

const inputSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one ingredient is required")
    .max(30),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "DESSERT", "SNACK"]),
  servings: z.number().int().min(1).max(20).optional().default(2),
  language: z.string().min(2).max(10).optional().default("en"),
  apiKey: z.string().min(1).optional(),
});

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    mealType: { type: Type.STRING, enum: ["BREAKFAST", "LUNCH", "DINNER", "DESSERT", "SNACK"] },
    difficulty: { type: Type.STRING, enum: ["EASY", "MEDIUM", "HARD"] },
    prepTime: { type: Type.INTEGER },
    cookTime: { type: Type.INTEGER },
    totalTime: { type: Type.INTEGER },
    servings: { type: Type.INTEGER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quantity: { type: Type.STRING },
          unit: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["name", "quantity", "unit"],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
          duration: { type: Type.STRING },
          tip: { type: Type.STRING },
        },
        required: ["stepNumber", "instruction"],
      },
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    substitutions: { type: Type.ARRAY, items: { type: Type.STRING } },
    calories: { type: Type.INTEGER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fat: { type: Type.NUMBER },
    fiber: { type: Type.NUMBER },
    isVegan: { type: Type.BOOLEAN },
    isVegetarian: { type: Type.BOOLEAN },
    isGlutenFree: { type: Type.BOOLEAN },
    isDairyFree: { type: Type.BOOLEAN },
    isKeto: { type: Type.BOOLEAN },
    isLowCarb: { type: Type.BOOLEAN },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    cuisine: { type: Type.STRING },
  },
  required: [
    "name", "description", "mealType", "difficulty", "prepTime", "cookTime",
    "totalTime", "servings", "ingredients", "steps", "tips", "substitutions",
    "calories", "protein", "carbs", "fat", "fiber", "isVegan", "isVegetarian",
    "isGlutenFree", "isDairyFree", "isKeto", "isLowCarb", "tags", "cuisine",
  ],
} as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { ingredients, mealType, servings, language, apiKey } = parsed.data;

    // Resolve API key: client-sent > env var
    const key = apiKey || process.env.GEMINI_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "NO_API_KEY", message: "Gemini API key is required. Add it in Settings or set GEMINI_API_KEY env var." },
        { status: 400 }
      );
    }

    // Create Gemini client with the resolved key
    const ai = new GoogleGenAI({ apiKey: key });

    const langNote = language !== "en" ? `\nRespond entirely in language code: ${language}.` : "";

    const prompt = `You are ChefAI, a world-class chef. Create ONE creative, delicious recipe.

Available ingredients: ${ingredients.join(", ")}
Meal type: ${mealType}
Servings: ${servings}${langNote}

Rules:
- MUST primarily use the provided ingredients. May add common pantry staples (salt, pepper, oil, spices).
- Creative, appetizing recipe name.
- Magazine-quality description (2-3 sentences).
- Each step: detailed (2-3 sentences), practical.
- Accurate nutritional estimates per serving.
- 3-5 useful chef tips.
- 3-5 realistic ingredient substitutions.
- Accurate dietary flags.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.85,
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    const recipe = JSON.parse(text);

    // Add an ID so the frontend can work with it
    recipe.id = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    recipe.createdAt = new Date().toISOString();
    recipe.sourceIngredients = ingredients;

    return NextResponse.json({ recipe, remaining: null, isPremium: false }, { status: 200 });
  } catch (error: unknown) {
    console.error("[PUBLIC_GENERATE]", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    // Handle specific Gemini API errors
    if (message.includes("API key")) {
      return NextResponse.json(
        { error: "INVALID_API_KEY", message: "Invalid Gemini API key. Please check your key in Settings." },
        { status: 401 }
      );
    }

    if (message.includes("quota") || message.includes("429")) {
      return NextResponse.json(
        { error: "QUOTA_EXCEEDED", message: "Gemini API quota exceeded. Try again later or use a different key." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "GENERATION_FAILED", message: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
}
