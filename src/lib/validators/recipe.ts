import { z } from "zod";

// ═══════════════════════════════════════════
// GENERATE RECIPE
// ═══════════════════════════════════════════

export const generateRecipeSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one ingredient is required")
    .max(30, "Maximum 30 ingredients"),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "DESSERT", "SNACK"]),
  dietaryPreferences: z
    .array(z.enum(["vegan", "vegetarian", "gluten-free", "dairy-free", "keto", "low-carb", "paleo"]))
    .optional()
    .default([]),
  servings: z.number().int().min(1).max(20).optional().default(2),
  language: z.string().min(2).max(10).optional().default("en"),
});

export type GenerateRecipeInput = z.infer<typeof generateRecipeSchema>;

// ═══════════════════════════════════════════
// IMPROVE RECIPE
// ═══════════════════════════════════════════

export const improveRecipeSchema = z.object({
  recipeId: z.string().cuid(),
  feedback: z.string().min(3).max(500),
});

// ═══════════════════════════════════════════
// ADAPT RECIPE
// ═══════════════════════════════════════════

export const adaptRecipeSchema = z.object({
  recipeId: z.string().cuid(),
  diet: z.enum(["vegan", "vegetarian", "gluten-free", "dairy-free", "keto", "low-carb", "paleo"]),
});

// ═══════════════════════════════════════════
// SUBSTITUTIONS
// ═══════════════════════════════════════════

export const substitutionsSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1).max(10),
  reason: z.string().max(200).optional(),
});

// ═══════════════════════════════════════════
// CONVERT UNITS
// ═══════════════════════════════════════════

export const convertUnitsSchema = z.object({
  items: z.array(z.string().min(1)).min(1).max(30),
  targetSystem: z.enum(["metric", "imperial"]),
});

// ═══════════════════════════════════════════
// EXPLAIN TECHNIQUE
// ═══════════════════════════════════════════

export const explainTechniqueSchema = z.object({
  technique: z.string().min(2).max(200),
});

// ═══════════════════════════════════════════
// LEFTOVERS
// ═══════════════════════════════════════════

export const leftoversSchema = z.object({
  leftovers: z.array(z.string().min(1)).min(1).max(20),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "DESSERT", "SNACK"]).optional(),
});

// ═══════════════════════════════════════════
// MEAL PLAN
// ═══════════════════════════════════════════

export const generateMealPlanSchema = z.object({
  days: z.number().int().min(1).max(14).default(7),
  preferences: z
    .array(z.string())
    .optional()
    .default([]),
  calorieTarget: z.number().int().min(800).max(5000).optional(),
  language: z.string().min(2).max(10).optional().default("en"),
});

// ═══════════════════════════════════════════
// SHOPPING LIST
// ═══════════════════════════════════════════

export const createShoppingListSchema = z.object({
  name: z.string().min(1).max(100),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      unit: z.string().optional(),
      category: z.string(),
      checked: z.boolean().default(false),
    })
  ),
  mealPlanId: z.string().cuid().optional(),
});

// ═══════════════════════════════════════════
// IMAGE RECOGNITION
// ═══════════════════════════════════════════

export const imageRecognizeSchema = z.object({
  image: z.string().min(1), // base64
  mimeType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]),
});
