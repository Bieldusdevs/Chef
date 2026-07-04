import { GoogleGenAI, Type } from "@google/genai";

// ═══════════════════════════════════════════
// GEMINI CLIENT — Lazy, Gemini 2.5 Flash
// ═══════════════════════════════════════════

let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!_ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

// Gemini 2.5 Flash — fast, capable, structured output
const MODEL = "gemini-2.5-flash";

// ═══════════════════════════════════════════
// RECIPE SCHEMA (structured output)
// ═══════════════════════════════════════════

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Creative recipe name" },
    description: {
      type: Type.STRING,
      description:
        "Appetizing 2-3 sentence description of the dish, magazine-quality",
    },
    mealType: {
      type: Type.STRING,
      enum: ["BREAKFAST", "LUNCH", "DINNER", "DESSERT", "SNACK"],
    },
    difficulty: {
      type: Type.STRING,
      enum: ["EASY", "MEDIUM", "HARD"],
    },
    prepTime: { type: Type.INTEGER, description: "Prep time in minutes" },
    cookTime: { type: Type.INTEGER, description: "Cook time in minutes" },
    totalTime: { type: Type.INTEGER, description: "Total time in minutes" },
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
          instruction: {
            type: Type.STRING,
            description: "Detailed instruction, 2-3 sentences",
          },
          duration: {
            type: Type.STRING,
            description: "Optional time for this step",
          },
          tip: { type: Type.STRING, description: "Optional pro tip" },
        },
        required: ["stepNumber", "instruction"],
      },
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 chef pro tips",
    },
    substitutions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 possible ingredient substitutions",
    },
    calories: { type: Type.INTEGER, description: "Calories per serving" },
    protein: { type: Type.NUMBER, description: "Grams of protein per serving" },
    carbs: { type: Type.NUMBER, description: "Grams of carbs per serving" },
    fat: { type: Type.NUMBER, description: "Grams of fat per serving" },
    fiber: { type: Type.NUMBER, description: "Grams of fiber per serving" },
    sugar: { type: Type.NUMBER, description: "Grams of sugar per serving" },
    sodium: { type: Type.NUMBER, description: "mg of sodium per serving" },
    isVegan: { type: Type.BOOLEAN },
    isVegetarian: { type: Type.BOOLEAN },
    isGlutenFree: { type: Type.BOOLEAN },
    isDairyFree: { type: Type.BOOLEAN },
    isKeto: { type: Type.BOOLEAN },
    isLowCarb: { type: Type.BOOLEAN },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant tags like 'quick', 'comfort-food', 'healthy'",
    },
    cuisine: { type: Type.STRING, description: "Cuisine type e.g. Italian" },
  },
  required: [
    "name",
    "description",
    "mealType",
    "difficulty",
    "prepTime",
    "cookTime",
    "totalTime",
    "servings",
    "ingredients",
    "steps",
    "tips",
    "substitutions",
    "calories",
    "protein",
    "carbs",
    "fat",
    "fiber",
    "isVegan",
    "isVegetarian",
    "isGlutenFree",
    "isDairyFree",
    "isKeto",
    "isLowCarb",
    "tags",
    "cuisine",
  ],
} as const;

// ═══════════════════════════════════════════
// SHARED GEMINI CALL HELPER
// ═══════════════════════════════════════════

async function callGemini<T>(
  prompt: string,
  schema: object,
  temperature: number = 0.8
): Promise<T> {
  const response = await getAI().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature,
      thinkingConfig: { thinkingBudget: 1024 },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty response");

  return JSON.parse(text) as T;
}

async function callGeminiMultimodal<T>(
  parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  >,
  schema: object,
  temperature: number = 0.3
): Promise<T> {
  const response = await getAI().models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature,
      thinkingConfig: { thinkingBudget: 1024 },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty response");

  return JSON.parse(text) as T;
}

// ═══════════════════════════════════════════
// RESPONSE TYPES
// ═══════════════════════════════════════════

export interface RecipeResponse {
  name: string;
  description: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "DESSERT" | "SNACK";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
    notes?: string;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
    duration?: string;
    tip?: string;
  }>;
  tips: string[];
  substitutions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
  tags: string[];
  cuisine: string;
}

export interface SubstitutionsResponse {
  substitutions: Array<{
    original: string;
    substitute: string;
    notes: string;
    impactOnFlavor?: string;
  }>;
}

export interface ConversionsResponse {
  conversions: Array<{
    original: string;
    converted: string;
    notes?: string;
  }>;
}

export interface TechniqueResponse {
  technique: string;
  description: string;
  steps: string[];
  commonMistakes: string[];
  proTips: string[];
}

export interface MealPlanResponse {
  name: string;
  days: Array<{
    day: string;
    breakfast: { name: string; calories: number; quickDescription: string };
    lunch: { name: string; calories: number; quickDescription: string };
    dinner: { name: string; calories: number; quickDescription: string };
    snack?: { name: string; calories: number; quickDescription: string };
  }>;
  shoppingList: Array<{ name: string; quantity: string; category: string }>;
  avgCalories: number;
  avgProtein?: number;
  avgCarbs?: number;
  avgFat?: number;
}

export interface RecognitionResponse {
  ingredients: Array<{
    name: string;
    confidence: "high" | "medium" | "low";
    notes?: string;
  }>;
}

// ═══════════════════════════════════════════
// GENERATE RECIPE
// ═══════════════════════════════════════════

export interface GenerateRecipeInput {
  ingredients: string[];
  mealType: string;
  dietaryPreferences?: string[];
  servings?: number;
  language?: string;
}

export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<RecipeResponse> {
  const {
    ingredients,
    mealType,
    dietaryPreferences = [],
    servings = 2,
    language = "en",
  } = input;

  const dietInfo =
    dietaryPreferences.length > 0
      ? `\nDietary requirements: ${dietaryPreferences.join(", ")}.`
      : "";

  const langInfo =
    language !== "en"
      ? `\nRespond entirely in language code: ${language}.`
      : "";

  const prompt = `You are ChefAI, a world-class chef and recipe creator. Create ONE creative, delicious, and practical recipe.

Available ingredients: ${ingredients.join(", ")}
Meal type: ${mealType}
Servings: ${servings}${dietInfo}${langInfo}

Rules:
- The recipe MUST primarily use the provided ingredients. You may add common pantry staples (salt, pepper, oil, basic spices).
- Be creative with the recipe name — make it sound appetizing and premium.
- Write a magazine-quality description that makes the reader hungry.
- Each step should be detailed (2-3 sentences) and practical.
- Provide accurate nutritional estimates per serving.
- Include 3-5 genuinely useful chef tips.
- Include 3-5 realistic ingredient substitutions.
- Tag dietary flags accurately.`;

  return callGemini<RecipeResponse>(prompt, recipeSchema, 0.85);
}

// ═══════════════════════════════════════════
// IMPROVE RECIPE
// ═══════════════════════════════════════════

export async function improveRecipe(
  recipe: Record<string, unknown>,
  feedback: string
): Promise<RecipeResponse> {
  const prompt = `You are ChefAI. The user has this recipe and wants it improved.

Current recipe:
${JSON.stringify(recipe, null, 2)}

User feedback: "${feedback}"

Improve the recipe based on the feedback. Return the complete improved recipe.`;

  return callGemini<RecipeResponse>(prompt, recipeSchema, 0.8);
}

// ═══════════════════════════════════════════
// ADAPT RECIPE BY DIET
// ═══════════════════════════════════════════

export async function adaptRecipeByDiet(
  recipe: Record<string, unknown>,
  diet: string
): Promise<RecipeResponse> {
  const prompt = `You are ChefAI. Adapt this recipe to be ${diet}-friendly while keeping it delicious.

Current recipe:
${JSON.stringify(recipe, null, 2)}

Target diet: ${diet}

Replace ingredients as needed, adjust steps, recalculate nutrition. Return the complete adapted recipe.`;

  return callGemini<RecipeResponse>(prompt, recipeSchema, 0.7);
}

// ═══════════════════════════════════════════
// SUGGEST SUBSTITUTIONS
// ═══════════════════════════════════════════

const substitutionsSchema = {
  type: Type.OBJECT,
  properties: {
    substitutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          substitute: { type: Type.STRING },
          notes: { type: Type.STRING },
          impactOnFlavor: { type: Type.STRING },
        },
        required: ["original", "substitute", "notes"],
      },
    },
  },
  required: ["substitutions"],
} as const;

export async function suggestSubstitutions(
  ingredients: string[],
  reason?: string
): Promise<SubstitutionsResponse> {
  const reasonText = reason ? `\nReason for substitution: ${reason}` : "";

  const prompt = `You are ChefAI. Suggest substitutions for these ingredients.

Ingredients: ${ingredients.join(", ")}${reasonText}

For each ingredient, provide 1-2 possible substitutes with notes on how they affect the dish.`;

  return callGemini<SubstitutionsResponse>(prompt, substitutionsSchema, 0.7);
}

// ═══════════════════════════════════════════
// CONVERT UNITS
// ═══════════════════════════════════════════

const unitConversionSchema = {
  type: Type.OBJECT,
  properties: {
    conversions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          converted: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["original", "converted"],
      },
    },
  },
  required: ["conversions"],
} as const;

export async function convertUnits(
  items: string[],
  targetSystem: "metric" | "imperial"
): Promise<ConversionsResponse> {
  const prompt = `Convert these cooking measurements to ${targetSystem} units:

${items.join("\n")}

Be precise. Include notes where volume-to-weight conversions depend on the ingredient.`;

  return callGemini<ConversionsResponse>(prompt, unitConversionSchema, 0.3);
}

// ═══════════════════════════════════════════
// EXPLAIN COOKING TECHNIQUE
// ═══════════════════════════════════════════

const techniqueSchema = {
  type: Type.OBJECT,
  properties: {
    technique: { type: Type.STRING },
    description: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    commonMistakes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    proTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["technique", "description", "steps", "commonMistakes", "proTips"],
} as const;

export async function explainTechnique(
  technique: string
): Promise<TechniqueResponse> {
  const prompt = `You are ChefAI, a world-class culinary instructor. Explain this cooking technique in detail:

Technique: "${technique}"

Be thorough but accessible. Include common mistakes beginners make and pro tips.`;

  return callGemini<TechniqueResponse>(prompt, techniqueSchema, 0.7);
}

// ═══════════════════════════════════════════
// USE LEFTOVERS
// ═══════════════════════════════════════════

export async function suggestLeftoverRecipes(
  leftovers: string[]
): Promise<RecipeResponse> {
  const prompt = `You are ChefAI. The user wants to use up these leftovers creatively:

Leftovers: ${leftovers.join(", ")}

Create a creative recipe that transforms these leftovers into something delicious. Think "leftover makeover".`;

  return callGemini<RecipeResponse>(prompt, recipeSchema, 0.9);
}

// ═══════════════════════════════════════════
// GENERATE MEAL PLAN
// ═══════════════════════════════════════════

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          breakfast: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.INTEGER },
              quickDescription: { type: Type.STRING },
            },
            required: ["name", "calories", "quickDescription"],
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.INTEGER },
              quickDescription: { type: Type.STRING },
            },
            required: ["name", "calories", "quickDescription"],
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.INTEGER },
              quickDescription: { type: Type.STRING },
            },
            required: ["name", "calories", "quickDescription"],
          },
          snack: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.INTEGER },
              quickDescription: { type: Type.STRING },
            },
            required: ["name", "calories", "quickDescription"],
          },
        },
        required: ["day", "breakfast", "lunch", "dinner"],
      },
    },
    shoppingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quantity: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["name", "quantity", "category"],
      },
    },
    avgCalories: { type: Type.INTEGER },
    avgProtein: { type: Type.NUMBER },
    avgCarbs: { type: Type.NUMBER },
    avgFat: { type: Type.NUMBER },
  },
  required: ["name", "days", "shoppingList", "avgCalories"],
} as const;

export interface GenerateMealPlanInput {
  days: number;
  preferences?: string[];
  calorieTarget?: number;
  language?: string;
}

export async function generateMealPlan(
  input: GenerateMealPlanInput
): Promise<MealPlanResponse> {
  const { days, preferences = [], calorieTarget, language = "en" } = input;

  const prefInfo =
    preferences.length > 0
      ? `\nDietary preferences: ${preferences.join(", ")}`
      : "";
  const calInfo = calorieTarget
    ? `\nTarget: ~${calorieTarget} calories per day.`
    : "";
  const langInfo =
    language !== "en"
      ? `\nRespond entirely in language code: ${language}.`
      : "";

  const prompt = `You are ChefAI, a nutrition-focused meal planner. Create a ${days}-day meal plan.${prefInfo}${calInfo}${langInfo}

Include breakfast, lunch, dinner, and an optional snack for each day.
Ensure variety across days — avoid repeating the same meals.
Generate a consolidated shopping list grouped by category (Produce, Protein, Dairy, Pantry, etc.).
Calculate average daily nutrition.`;

  return callGemini<MealPlanResponse>(prompt, mealPlanSchema, 0.85);
}

// ═══════════════════════════════════════════
// IMAGE RECOGNITION (Gemini 2.5 Flash Vision)
// ═══════════════════════════════════════════

const ingredientRecognitionSchema = {
  type: Type.OBJECT,
  properties: {
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
          notes: { type: Type.STRING },
        },
        required: ["name", "confidence"],
      },
    },
  },
  required: ["ingredients"],
} as const;

export async function recognizeIngredientsFromImage(
  imageBase64: string,
  mimeType: string
): Promise<RecognitionResponse> {
  return callGeminiMultimodal<RecognitionResponse>(
    [
      {
        text: "You are ChefAI. Identify all visible food ingredients in this image. Be specific (e.g., 'red bell pepper' not just 'vegetable'). Include estimated quantity if possible.",
      },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ],
    ingredientRecognitionSchema,
    0.3
  );
}
