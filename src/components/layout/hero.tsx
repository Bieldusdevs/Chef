"use client";

import { useRecipeStore } from "@/store/recipe-store";
import { useGenerateRecipe } from "@/hooks/use-generate-recipe";
import type { MealType } from "@/types";

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: "BREAKFAST", label: "Breakfast", emoji: "☀️" },
  { value: "LUNCH", label: "Lunch", emoji: "🍽️" },
  { value: "DINNER", label: "Dinner", emoji: "🌙" },
  { value: "DESSERT", label: "Dessert", emoji: "🍰" },
  { value: "SNACK", label: "Snack", emoji: "🥨" },
];

const QUICK_COMBOS = [
  { label: "🍗 Chicken + Rice", ingredients: ["chicken", "rice", "garlic", "soy sauce"] },
  { label: "🍝 Italian Classic", ingredients: ["pasta", "tomato", "basil", "mozzarella"] },
  { label: "🧁 Baking Basics", ingredients: ["eggs", "flour", "sugar", "butter", "vanilla"] },
  { label: "🐟 Healthy Salmon", ingredients: ["salmon", "lemon", "dill", "asparagus"] },
  { label: "🥑 Avocado Toast", ingredients: ["avocado", "eggs", "bread", "lime", "chili"] },
];

const FLOATING_ITEMS = [
  { emoji: "🥚", left: "5%", duration: "18s", delay: "0s" },
  { emoji: "🧀", left: "15%", duration: "22s", delay: "2s" },
  { emoji: "🍅", left: "25%", duration: "16s", delay: "4s" },
  { emoji: "🥔", left: "38%", duration: "20s", delay: "1s" },
  { emoji: "🧅", left: "52%", duration: "19s", delay: "3s" },
  { emoji: "🌿", left: "65%", duration: "21s", delay: "5s" },
  { emoji: "🍋", left: "78%", duration: "17s", delay: "2s" },
  { emoji: "🫑", left: "88%", duration: "23s", delay: "4s" },
  { emoji: "🧄", left: "42%", duration: "25s", delay: "6s" },
  { emoji: "🥕", left: "72%", duration: "20s", delay: "0s" },
];

export function Hero() {
  const {
    ingredients,
    mealType,
    setIngredients,
    setMealType,
    error,
  } = useRecipeStore();
  const { generate, isGenerating } = useGenerateRecipe();

  const handleTextChange = (text: string) => {
    const items = text
      .split(/[\n,;]+/)
      .map((s) => s.replace(/^[-•*]\s*/, "").trim())
      .filter((s) => s.length > 0);
    setIngredients([...new Set(items)]);
  };

  const removeIngredient = (index: number) => {
    const next = [...ingredients];
    next.splice(index, 1);
    setIngredients(next);
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-5 pt-32 pb-16 relative overflow-hidden">
      {/* BG gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-gradient"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(74,222,128,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(74,222,128,0.05) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      {/* Orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-30 bg-accent top-[10%] left-[15%] animate-float" />
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-15 bg-cyan-400 bottom-[20%] right-[15%] animate-float" style={{ animationDelay: "-7s" }} />

      {/* Floating ingredients */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden>
        {FLOATING_ITEMS.map((item, i) => (
          <div
            key={i}
            className="absolute text-[2.5rem] opacity-15"
            style={{
              left: item.left,
              animation: `floatIngredient ${item.duration} ${item.delay} ease-in-out infinite`,
            }}
          >
            {item.emoji}
          </div>
        ))}
        <style>{`
          @keyframes floatIngredient {
            0% { transform: translateY(100vh) rotate(0deg) scale(0.5); opacity: 0; }
            10% { opacity: 0.15; }
            90% { opacity: 0.15; }
            100% { transform: translateY(-100px) rotate(360deg) scale(1.2); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Content */}
      <div className="relative z-[2] max-w-[900px] w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card border border-border rounded-full text-sm font-medium text-muted mb-8 backdrop-blur-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
          AI-Powered Recipe Generation
        </div>

        {/* Heading */}
        <h1
          className="text-[clamp(3rem,7vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[1.05] mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          What can you
          <br />
          <span className="bg-gradient-to-br from-accent to-cyan-400 bg-clip-text text-transparent">
            cook today?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[clamp(1rem,2vw,1.25rem)] text-muted max-w-[600px] mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          Tell us what&apos;s in your kitchen and let AI create the perfect recipe — personalized, nutritious, and delicious.
        </p>

        {/* Input Card */}
        <div className="max-w-[680px] mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="bg-glass backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-400 focus-within:border-accent focus-within:shadow-[0_0_60px_rgba(74,222,128,0.15),0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-[10px] bg-accent-dim flex items-center justify-center text-xl">
                🧑‍🍳
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold">Your Ingredients</h3>
                <p className="text-xs text-muted-2">Type or paste what you have available</p>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none text-foreground text-base leading-[1.8] placeholder:text-muted-2"
              placeholder={"eggs\npotatoes\ncheese\ntomato\nonions..."}
              value={ingredients.join("\n")}
              onChange={(e) => handleTextChange(e.target.value)}
              aria-label="Enter your ingredients"
              rows={4}
            />

            {/* Tags */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                {ingredients.map((ing, i) => (
                  <span
                    key={`${ing}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-dim border border-[rgba(74,222,128,0.2)] rounded-full text-sm font-medium text-accent"
                    style={{ animation: "fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                  >
                    {ing}
                    <button
                      onClick={() => removeIngredient(i)}
                      className="opacity-60 hover:opacity-100 transition-opacity text-base leading-none"
                      aria-label={`Remove ${ing}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Meal type */}
            <div className="flex gap-2 mt-5 flex-wrap" role="radiogroup" aria-label="Meal type">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  onClick={() => setMealType(mt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 flex items-center gap-1.5 hover:-translate-y-0.5 ${
                    mealType === mt.value
                      ? "bg-accent text-black border-accent shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                      : "bg-transparent text-muted border-border hover:border-border-hover hover:text-foreground"
                  }`}
                >
                  {mt.emoji} {mt.label}
                </button>
              ))}
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={ingredients.length === 0 || isGenerating}
              className="w-full mt-6 py-4 rounded-2xl text-base font-bold border-none bg-gradient-to-br from-accent to-accent-2 text-black relative overflow-hidden transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(74,222,128,0.3)] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span className="inline-block" style={{ animation: "spin 3s linear infinite" }}>
                ✨
              </span>
              Generate Recipe
            </button>

            {/* Error */}
            {error && (
              <div className="mt-3 text-sm text-red-400 text-center animate-fade-in-up">
                {error}
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-2 uppercase tracking-[0.1em] mb-3">
              Try these combos
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_COMBOS.map((combo) => (
                <button
                  key={combo.label}
                  onClick={() => setIngredients(combo.ingredients)}
                  className="px-3 py-1.5 rounded-full text-xs border border-border bg-transparent text-muted transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent-dim hover:-translate-y-0.5"
                >
                  {combo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
