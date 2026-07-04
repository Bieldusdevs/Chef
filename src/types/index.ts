// ═══════════════════════════════════════════
// SHARED TYPES
// ═══════════════════════════════════════════

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "DESSERT" | "SNACK";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type DietaryPreference =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "low-carb"
  | "paleo";

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  duration?: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  mealType: MealType;
  difficulty: Difficulty;
  imageUrl?: string | null;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tips: string[];
  substitutions: string[];
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
  tags: string[];
  cuisine?: string | null;
  sourceIngredients: string[];
  isFavorited?: boolean;
  favoriteCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
  mealType: MealType;
  dietaryPreferences?: DietaryPreference[];
  servings?: number;
  language?: string;
}

export interface GenerateRecipeResponse {
  recipe: Recipe;
  remaining: number;
  isPremium: boolean;
}

export interface UserStats {
  totalRecipes: number;
  totalFavorites: number;
  totalMealPlans: number;
  recentHistory: Array<{
    id: string;
    createdAt: string;
    recipe: {
      id: string;
      name: string;
      mealType: MealType;
      totalTime: number;
      calories?: number | null;
    };
  }>;
  mealTypeBreakdown: Array<{
    mealType: MealType;
    count: number;
  }>;
  avgNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface MealPlanDay {
  day: string;
  breakfast: { name: string; calories: number; quickDescription: string };
  lunch: { name: string; calories: number; quickDescription: string };
  dinner: { name: string; calories: number; quickDescription: string };
  snack?: { name: string; calories: number; quickDescription: string };
}

export interface MealPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: MealPlanDay[];
  avgCalories?: number | null;
  avgProtein?: number | null;
  avgCarbs?: number | null;
  avgFat?: number | null;
}

export interface ShoppingListItem {
  name: string;
  quantity: string;
  unit?: string;
  category: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  mealPlanId?: string | null;
  createdAt: string;
}

export interface SubstitutionResult {
  original: string;
  substitute: string;
  notes: string;
  impactOnFlavor?: string;
}

export interface TechniqueExplanation {
  technique: string;
  description: string;
  steps: string[];
  commonMistakes: string[];
  proTips: string[];
}

export interface UnitConversion {
  original: string;
  converted: string;
  notes?: string;
}

export interface RecognizedIngredient {
  name: string;
  confidence: "high" | "medium" | "low";
  notes?: string;
}
