"use client";

import { useRecipeStore } from "@/store/recipe-store";
import { useGenerateRecipe } from "@/hooks/use-generate-recipe";
import type { MealType } from "@/types";

const MEALS: { value: MealType; label: string; emoji: string }[] = [
  { value: "BREAKFAST", label: "Breakfast", emoji: "☀️" },
  { value: "LUNCH", label: "Lunch", emoji: "🍽️" },
  { value: "DINNER", label: "Dinner", emoji: "🌙" },
  { value: "DESSERT", label: "Dessert", emoji: "🍰" },
  { value: "SNACK", label: "Snack", emoji: "🥨" },
];

const COMBOS = [
  { label: "🍗 Chicken + Rice", items: ["chicken", "rice", "garlic", "soy sauce"] },
  { label: "🍝 Italian Classic", items: ["pasta", "tomato", "basil", "mozzarella"] },
  { label: "🧁 Baking Basics", items: ["eggs", "flour", "sugar", "butter"] },
  { label: "🐟 Healthy Salmon", items: ["salmon", "lemon", "dill", "asparagus"] },
  { label: "🥑 Avocado Toast", items: ["avocado", "eggs", "bread", "lime"] },
];

const FLOATS = [
  { e: "🥚", l: "6%",  d: "18s", dl: "0s" },
  { e: "🧀", l: "16%", d: "23s", dl: "2s" },
  { e: "🍅", l: "28%", d: "17s", dl: "4s" },
  { e: "🥔", l: "40%", d: "21s", dl: "1s" },
  { e: "🧅", l: "54%", d: "19s", dl: "3s" },
  { e: "🌿", l: "66%", d: "22s", dl: "5s" },
  { e: "🍋", l: "78%", d: "18s", dl: "2s" },
  { e: "🧄", l: "44%", d: "25s", dl: "6s" },
  { e: "🥕", l: "88%", d: "20s", dl: "0s" },
];

export function Hero() {
  const { ingredients, mealType, setIngredients, setMealType, error } = useRecipeStore();
  const { generate, isGenerating } = useGenerateRecipe();

  const handleText = (text: string) => {
    const items = text.split(/[\n,;]+/).map((s) => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
    setIngredients([...new Set(items)]);
  };

  const removeTag = (i: number) => {
    const next = [...ingredients];
    next.splice(i, 1);
    setIngredients(next);
  };

  return (
    <section className="hero" id="hero">
      {/* BG Gradient Orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute", top: "-40%", left: "-40%", width: "180%", height: "180%",
            background: "radial-gradient(ellipse at 35% 50%, rgba(74,222,128,0.12) 0%, transparent 55%), radial-gradient(ellipse at 65% 45%, rgba(34,211,238,0.06) 0%, transparent 50%)",
            animation: "gradientMove 18s ease infinite",
          }}
        />
        <div
          style={{
            position: "absolute", width: 420, height: 420, borderRadius: "50%",
            background: "var(--accent)", filter: "blur(100px)", opacity: 0.18,
            top: "8%", left: "12%", animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "#22d3ee", filter: "blur(90px)", opacity: 0.08,
            bottom: "15%", right: "12%", animation: "float 10s ease-in-out infinite",
            animationDelay: "-5s",
          }}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
        }}
      />

      {/* Floating emojis */}
      {FLOATS.map((f, i) => (
        <div
          key={i}
          className="float-item"
          style={{ left: f.l, ["--dur" as string]: f.d, ["--delay" as string]: f.dl } as React.CSSProperties}
        >
          {f.e}
        </div>
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 920, width: "100%" }}>
        {/* Badge */}
        <div
          className="glass"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 20px", borderRadius: 100, fontSize: "0.8rem",
            fontWeight: 500, color: "var(--muted)", marginBottom: 36,
            opacity: 0, animation: "fadeUp 0.8s 0.1s var(--ease) forwards",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite" }} />
          AI-Powered Recipe Generation
        </div>

        {/* Title */}
        <h1
          className="hero-title"
          style={{ opacity: 0, animation: "fadeUp 0.9s 0.25s var(--ease) forwards" }}
        >
          What can you<br />
          <span className="hero-gradient">cook today?</span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subtitle"
          style={{
            margin: "0 auto 48px", opacity: 0,
            animation: "fadeUp 0.9s 0.4s var(--ease) forwards",
          }}
        >
          Tell us what&apos;s in your kitchen and let AI create the perfect recipe — personalized, nutritious, and delicious.
        </p>

        {/* Input Card */}
        <div style={{ opacity: 0, animation: "fadeUp 0.9s 0.55s var(--ease) forwards" }}>
          <div className="glass-strong input-card" style={{ margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
              <div className="feature-icon" style={{ width: 48, height: 48, marginBottom: 0 }}>🧑‍🍳</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Your Ingredients</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted-2)" }}>Type or paste what you have available</div>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="input-textarea"
              placeholder={"eggs\npotatoes\ncheese\ntomato\nonions..."}
              value={ingredients.join("\n")}
              onChange={(e) => handleText(e.target.value)}
              aria-label="Enter your ingredients"
            />

            {/* Tags */}
            {ingredients.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                {ingredients.map((ing, i) => (
                  <span key={`${ing}-${i}`} className="tag">
                    {ing}
                    <button onClick={() => removeTag(i)} aria-label={`Remove ${ing}`}>×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Meal pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
              {MEALS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMealType(m.value)}
                  className={`meal-pill ${mealType === m.value ? "active" : ""}`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            {/* Generate */}
            <button
              onClick={generate}
              disabled={ingredients.length === 0 || isGenerating}
              className="btn-primary"
              style={{ width: "100%", marginTop: 28, padding: "20px", fontSize: "1.1rem", borderRadius: 20 }}
            >
              <span style={{ display: "inline-block", animation: "spin 3s linear infinite" }}>✨</span>
              Generate Recipe
            </button>

            {/* Error */}
            {error && (
              <p style={{ marginTop: 12, fontSize: "0.875rem", color: "#f87171", textAlign: "center", animation: "fadeUp 0.4s var(--ease)" }}>
                {error}
              </p>
            )}
          </div>

          {/* Quick combos */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <p style={{ fontSize: "0.7rem", color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
              Try these combos
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              {COMBOS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setIngredients(c.items)}
                  className="quick-chip"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
