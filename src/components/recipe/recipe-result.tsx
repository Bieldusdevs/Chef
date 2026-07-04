"use client";

import { useRecipeStore } from "@/store/recipe-store";
import { useTimer } from "@/hooks/use-timer";
import { useFavorites } from "@/hooks/use-favorites";
import type { RecipeIngredient, RecipeStep } from "@/types";

export function RecipeResult() {
  const {
    currentRecipe: recipe,
    completedSteps,
    checkedIngredients,
    toggleStepCompleted,
    toggleIngredientChecked,
    remaining,
  } = useRecipeStore();

  const timer = useTimer();
  const { toggleFavorite, isToggling } = useFavorites();

  if (!recipe) return null;

  const ingredients = recipe.ingredients as RecipeIngredient[];
  const steps = recipe.steps as RecipeStep[];
  const tips = recipe.tips as string[];
  const substitutions = recipe.substitutions as string[];

  const mealEmoji: Record<string, string> = {
    BREAKFAST: "☀️",
    LUNCH: "🍽️",
    DINNER: "🌙",
    DESSERT: "🍰",
    SNACK: "🥨",
  };

  return (
    <section className="max-w-[1100px] mx-auto px-5 py-8 animate-fade-in-up" id="recipe-result">
      {/* Remaining indicator */}
      {remaining !== null && (
        <div className="text-center mb-6">
          <span className="text-xs text-muted-2 bg-card border border-border rounded-full px-4 py-1.5">
            {remaining} recipes remaining today
          </span>
        </div>
      )}

      {/* Hero image area */}
      <div className="w-full h-[400px] max-md:h-[250px] rounded-3xl overflow-hidden relative mb-8">
        <div className="w-full h-full bg-gradient-to-br from-accent-dim to-[rgba(34,211,238,0.1)] flex items-center justify-center text-[5rem]">
          {mealEmoji[recipe.mealType] || "🍽️"}
        </div>
      </div>

      {/* Meta */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {[
          { icon: "⏱️", label: "Time", value: `${recipe.totalTime} min` },
          { icon: "📊", label: "Difficulty", value: recipe.difficulty },
          { icon: "🔥", label: "Calories", value: `${recipe.calories || "—"} kcal` },
          { icon: "🍽️", label: "Servings", value: String(recipe.servings) },
        ].map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-2xl text-sm"
          >
            <span className="text-lg">{m.icon}</span>
            <div>
              <div className="text-[0.7rem] text-muted-2 uppercase tracking-[0.08em]">
                {m.label}
              </div>
              <div className="font-semibold">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Title & description */}
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] mb-3">
        {recipe.name}
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-8 max-w-[700px]">
        {recipe.description}
      </p>

      {/* Dietary tags */}
      <div className="flex gap-2 flex-wrap mb-8">
        {recipe.isVegan && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/40">🌱 Vegan</span>}
        {recipe.isVegetarian && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/40">🥬 Vegetarian</span>}
        {recipe.isGlutenFree && <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800/40">🌾 Gluten-Free</span>}
        {recipe.isDairyFree && <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/40">🥛 Dairy-Free</span>}
        {recipe.isKeto && <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/40">🥑 Keto</span>}
        {recipe.isLowCarb && <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-900/30 text-orange-400 border border-orange-800/40">🔥 Low Carb</span>}
        {recipe.cuisine && <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-muted">{recipe.cuisine}</span>}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-[340px_1fr] max-md:grid-cols-1 gap-12 mt-8">
        {/* Left: Ingredients */}
        <div className="max-md:static sticky top-[100px] self-start">
          <h3 className="text-base font-bold mb-5 flex items-center gap-2">
            🧾 Ingredients
          </h3>
          <ul>
            {ingredients.map((ing, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 py-3 border-b border-border text-sm transition-all ${
                  checkedIngredients.has(i) ? "opacity-40 line-through" : ""
                }`}
              >
                <button
                  onClick={() => toggleIngredientChecked(i)}
                  className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center text-[0.7rem] flex-shrink-0 transition-all cursor-pointer ${
                    checkedIngredients.has(i)
                      ? "bg-accent border-accent text-black"
                      : "border-border-hover text-transparent"
                  }`}
                >
                  ✓
                </button>
                <span>
                  {ing.quantity} {ing.unit} {ing.name}
                  {ing.notes && (
                    <span className="text-muted-2 text-xs ml-1">
                      ({ing.notes})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Timer */}
          <div className="mt-8 p-6 bg-card border border-border rounded-2xl text-center">
            <div className="text-xs text-muted-2 uppercase tracking-[0.1em]">
              Timer
            </div>
            <div className="text-[2.5rem] font-extrabold tracking-[-0.02em] text-accent my-3 tabular-nums">
              {timer.display}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => timer.addTime(-60)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border text-muted hover:border-accent hover:text-accent transition-all"
              >
                −1m
              </button>
              <button
                onClick={timer.toggle}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  timer.isRunning
                    ? "bg-accent text-black border border-accent"
                    : "border border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {timer.isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => timer.addTime(60)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border text-muted hover:border-accent hover:text-accent transition-all"
              >
                +1m
              </button>
              <button
                onClick={timer.reset}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border text-muted hover:border-accent hover:text-accent transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Cook Mode */}
          <button
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen?.();
              if ("wakeLock" in navigator) {
                (navigator as Navigator & { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request("screen").catch(() => {});
              }
            }}
            className="mt-5 w-full py-3.5 rounded-2xl text-sm font-semibold border border-accent bg-accent-dim text-accent flex items-center justify-center gap-2 transition-all hover:bg-accent hover:text-black"
          >
            👨‍🍳 Cook Mode
          </button>
        </div>

        {/* Right: Steps */}
        <div>
          <h3 className="text-base font-bold mb-5 flex items-center gap-2">
            📝 Instructions
          </h3>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex gap-5 p-6 bg-card border rounded-2xl mb-4 transition-all duration-400 relative overflow-hidden ${
                completedSteps.has(i)
                  ? "border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.03)]"
                  : "border-border hover:border-border-hover hover:bg-card-hover"
              }`}
              style={{
                animation: `fadeInUp 0.6s ${0.1 * i}s cubic-bezier(0.16,1,0.3,1) both`,
              }}
            >
              {completedSteps.has(i) && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  completedSteps.has(i)
                    ? "bg-accent text-black"
                    : "bg-accent-dim text-accent"
                }`}
              >
                {step.stepNumber || i + 1}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm leading-relaxed ${
                    completedSteps.has(i) ? "text-muted-2" : "text-muted"
                  }`}
                >
                  {step.instruction}
                </div>
                {step.duration && (
                  <div className="mt-2 text-xs text-accent">⏱️ {step.duration}</div>
                )}
                {step.tip && (
                  <div className="mt-2 text-xs text-muted-2 italic">
                    💡 {step.tip}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleStepCompleted(i)}
                className={`absolute top-4 right-4 w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center text-xs transition-all ${
                  completedSteps.has(i)
                    ? "bg-accent border-accent text-black"
                    : "border-border text-muted-2 hover:border-accent hover:text-accent"
                }`}
              >
                ✓
              </button>
            </div>
          ))}

          {/* Tips */}
          <div
            className="mt-6 p-6 bg-accent-dim border border-[rgba(74,222,128,0.15)] rounded-2xl"
            style={{
              animation: `fadeInUp 0.6s ${0.1 * steps.length}s cubic-bezier(0.16,1,0.3,1) both`,
            }}
          >
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              💡 Chef&apos;s Tips
            </h4>
            <ul className="text-sm text-muted leading-[1.8] list-none">
              {tips.map((tip, i) => (
                <li key={i}>→ {tip}</li>
              ))}
            </ul>
          </div>

          {/* Substitutions */}
          <div
            className="mt-4 p-6 bg-[rgba(147,51,234,0.05)] border border-[rgba(147,51,234,0.15)] rounded-2xl"
            style={{
              animation: `fadeInUp 0.6s ${0.1 * (steps.length + 1)}s cubic-bezier(0.16,1,0.3,1) both`,
            }}
          >
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              🔄 Possible Substitutions
            </h4>
            <ul className="text-sm text-muted leading-[1.8] list-none">
              {substitutions.map((sub, i) => (
                <li key={i}>→ {sub}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Nutrition */}
      <div className="mt-12 p-8 bg-card border border-border rounded-3xl">
        <h3 className="text-base font-bold mb-6 flex items-center gap-2">
          📊 Nutritional Information{" "}
          <span className="font-normal text-muted-2 text-sm">(per serving)</span>
        </h3>
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
          {[
            { value: recipe.calories || "—", label: "Calories" },
            { value: recipe.protein ? `${recipe.protein}g` : "—", label: "Protein" },
            { value: recipe.carbs ? `${recipe.carbs}g` : "—", label: "Carbs" },
            { value: recipe.fat ? `${recipe.fat}g` : "—", label: "Fat" },
          ].map((n) => (
            <div
              key={n.label}
              className="text-center p-4 bg-glass border border-border rounded-xl"
            >
              <div className="text-2xl font-extrabold text-accent">{n.value}</div>
              <div className="text-[0.7rem] text-muted-2 uppercase tracking-[0.1em] mt-1">
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8 flex-wrap justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-5 py-2.5 rounded-full text-sm font-semibold border border-border text-muted hover:border-border-hover hover:text-foreground transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
        >
          🔄 Generate Another
        </button>
        <button
          onClick={() => toggleFavorite(recipe.id, !!recipe.isFavorited)}
          disabled={isToggling}
          className="px-5 py-2.5 rounded-full text-sm font-semibold border border-border text-muted hover:border-border-hover hover:text-foreground transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
        >
          {recipe.isFavorited ? "❤️ Saved" : "♡ Save Recipe"}
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: recipe.name,
                text: recipe.description,
                url: window.location.href,
              });
            }
          }}
          className="px-5 py-2.5 rounded-full text-sm font-semibold border border-border text-muted hover:border-border-hover hover:text-foreground transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
        >
          ↗ Share
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-full text-sm font-semibold border border-border text-muted hover:border-border-hover hover:text-foreground transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
        >
          🖨 Print
        </button>
      </div>
    </section>
  );
}
