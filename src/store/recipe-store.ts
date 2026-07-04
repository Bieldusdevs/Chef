import { create } from "zustand";

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "DESSERT" | "SNACK";

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
  difficulty: "EASY" | "MEDIUM" | "HARD";
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tips: string[];
  substitutions: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
  tags: string[];
  cuisine?: string;
  sourceIngredients: string[];
  isFavorited?: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════

interface RecipeState {
  // Input state
  ingredients: string[];
  mealType: MealType;
  dietaryPreferences: DietaryPreference[];
  servings: number;
  language: string;

  // Generation state
  isGenerating: boolean;
  generationStep: number;
  currentRecipe: Recipe | null;
  error: string | null;
  remaining: number | null;

  // UI state
  completedSteps: Set<number>;
  checkedIngredients: Set<number>;
  cookMode: boolean;
  theme: "dark" | "light";

  // Actions
  setIngredients: (ingredients: string[]) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (index: number) => void;
  setMealType: (mealType: MealType) => void;
  setDietaryPreferences: (prefs: DietaryPreference[]) => void;
  toggleDietaryPreference: (pref: DietaryPreference) => void;
  setServings: (servings: number) => void;
  setLanguage: (language: string) => void;

  setIsGenerating: (val: boolean) => void;
  setGenerationStep: (step: number) => void;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  setError: (error: string | null) => void;
  setRemaining: (remaining: number | null) => void;

  toggleStepCompleted: (stepIndex: number) => void;
  toggleIngredientChecked: (index: number) => void;
  setCookMode: (val: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;

  reset: () => void;
}

// ═══════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════

export const useRecipeStore = create<RecipeState>((set) => ({
  // Initial state
  ingredients: [],
  mealType: "LUNCH",
  dietaryPreferences: [],
  servings: 2,
  language: "en",

  isGenerating: false,
  generationStep: 0,
  currentRecipe: null,
  error: null,
  remaining: null,

  completedSteps: new Set(),
  checkedIngredients: new Set(),
  cookMode: false,
  theme: "dark",

  // Actions
  setIngredients: (ingredients) => set({ ingredients }),
  addIngredient: (ingredient) =>
    set((state) => ({
      ingredients: [...new Set([...state.ingredients, ingredient.trim()])],
    })),
  removeIngredient: (index) =>
    set((state) => ({
      ingredients: state.ingredients.filter((_, i) => i !== index),
    })),
  setMealType: (mealType) => set({ mealType }),
  setDietaryPreferences: (dietaryPreferences) => set({ dietaryPreferences }),
  toggleDietaryPreference: (pref) =>
    set((state) => ({
      dietaryPreferences: state.dietaryPreferences.includes(pref)
        ? state.dietaryPreferences.filter((p) => p !== pref)
        : [...state.dietaryPreferences, pref],
    })),
  setServings: (servings) => set({ servings }),
  setLanguage: (language) => set({ language }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationStep: (generationStep) => set({ generationStep }),
  setCurrentRecipe: (currentRecipe) =>
    set({ currentRecipe, completedSteps: new Set(), checkedIngredients: new Set() }),
  setError: (error) => set({ error }),
  setRemaining: (remaining) => set({ remaining }),

  toggleStepCompleted: (stepIndex) =>
    set((state) => {
      const next = new Set(state.completedSteps);
      if (next.has(stepIndex)) next.delete(stepIndex);
      else next.add(stepIndex);
      return { completedSteps: next };
    }),
  toggleIngredientChecked: (index) =>
    set((state) => {
      const next = new Set(state.checkedIngredients);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { checkedIngredients: next };
    }),
  setCookMode: (cookMode) => set({ cookMode }),
  setTheme: (theme) => set({ theme }),

  reset: () =>
    set({
      ingredients: [],
      mealType: "LUNCH",
      dietaryPreferences: [],
      servings: 2,
      isGenerating: false,
      generationStep: 0,
      currentRecipe: null,
      error: null,
      completedSteps: new Set(),
      checkedIngredients: new Set(),
      cookMode: false,
    }),
}));
