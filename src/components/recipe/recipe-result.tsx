"use client";

import { useRecipeStore } from "@/store/recipe-store";
import { useTimer } from "@/hooks/use-timer";
import type { RecipeIngredient, RecipeStep } from "@/types";

export function RecipeResult() {
  const { currentRecipe: recipe, completedSteps, checkedIngredients, toggleStepCompleted, toggleIngredientChecked, remaining } = useRecipeStore();
  const timer = useTimer();

  if (!recipe) return null;

  const ingredients = recipe.ingredients as RecipeIngredient[];
  const steps = recipe.steps as RecipeStep[];
  const tips = recipe.tips as string[];
  const substitutions = recipe.substitutions as string[];
  const emojiMap: Record<string, string> = { BREAKFAST: "☀️", LUNCH: "🍽️", DINNER: "🌙", DESSERT: "🍰", SNACK: "🥨" };

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", animation: "fadeUp 0.8s var(--ease)" }} id="recipe-result">
      {remaining !== null && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span className="glass" style={{ fontSize: "0.78rem", color: "var(--muted-2)", padding: "6px 18px", borderRadius: 100, display: "inline-block" }}>
            {remaining} recipes remaining today
          </span>
        </div>
      )}

      {/* Hero image */}
      <div className="glass" style={{ width: "100%", height: 380, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", marginBottom: 32, borderRadius: "var(--radius-xl)" }}>
        {emojiMap[recipe.mealType] || "🍽️"}
      </div>

      {/* Meta pills */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {[
          { icon: "⏱️", label: "Time", value: `${recipe.totalTime} min` },
          { icon: "📊", label: "Difficulty", value: recipe.difficulty },
          { icon: "🔥", label: "Calories", value: `${recipe.calories || "—"} kcal` },
          { icon: "🍽️", label: "Servings", value: String(recipe.servings) },
        ].map((m) => (
          <div key={m.label} className="glass recipe-meta-pill">
            <span style={{ fontSize: "1.2rem" }}>{m.icon}</span>
            <div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.label}</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
        {recipe.name}
      </h1>
      <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: 36, maxWidth: 700 }}>
        {recipe.description}
      </p>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 48 }}>
        {/* Ingredients */}
        <div style={{ position: "sticky", top: 100, alignSelf: "start" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>🧾 Ingredients</h3>
          <ul style={{ listStyle: "none" }}>
            {ingredients.map((ing, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: "0.9rem", opacity: checkedIngredients.has(i) ? 0.35 : 1, textDecoration: checkedIngredients.has(i) ? "line-through" : "none", transition: "all 0.2s" }}>
                <button onClick={() => toggleIngredientChecked(i)} className={`check-btn ${checkedIngredients.has(i) ? "checked" : ""}`}>✓</button>
                <span>{ing.quantity} {ing.unit} {ing.name}{ing.notes ? ` (${ing.notes})` : ""}</span>
              </li>
            ))}
          </ul>

          {/* Timer */}
          <div className="glass" style={{ marginTop: 32, padding: 28, textAlign: "center", borderRadius: "var(--radius)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Timer</div>
            <div className="timer-display" style={{ margin: "12px 0" }}>{timer.display}</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button className="btn-ghost" style={{ padding: "8px 16px" }} onClick={() => timer.addTime(-60)}>−1m</button>
              <button className={timer.isRunning ? "btn-primary" : "btn-ghost"} style={{ padding: "8px 18px", fontSize: "0.825rem" }} onClick={timer.toggle}>
                {timer.isRunning ? "Pause" : "Start"}
              </button>
              <button className="btn-ghost" style={{ padding: "8px 16px" }} onClick={() => timer.addTime(60)}>+1m</button>
              <button className="btn-ghost" style={{ padding: "8px 16px" }} onClick={timer.reset}>Reset</button>
            </div>
          </div>

          {/* Cook Mode */}
          <button
            className="btn-ghost"
            style={{ width: "100%", marginTop: 16, padding: 16, borderRadius: 16, borderColor: "var(--accent)", color: "var(--accent)" }}
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen?.();
            }}
          >
            👨‍🍳 Cook Mode
          </button>
        </div>

        {/* Steps */}
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>📝 Instructions</h3>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`glass step-card ${completedSteps.has(i) ? "done" : ""}`}
              style={{ marginBottom: 14, animation: `fadeUp 0.6s ${0.08 * i}s var(--ease) both` }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: completedSteps.has(i) ? "var(--accent)" : "var(--accent-dim)", color: completedSteps.has(i) ? "#000" : "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, flexShrink: 0, transition: "all 0.3s" }}>
                {step.stepNumber || i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.9rem", lineHeight: 1.75, color: completedSteps.has(i) ? "var(--muted-2)" : "var(--muted)" }}>
                  {step.instruction}
                </div>
                {step.duration && <div style={{ marginTop: 6, fontSize: "0.78rem", color: "var(--accent)" }}>⏱️ {step.duration}</div>}
                {step.tip && <div style={{ marginTop: 6, fontSize: "0.78rem", color: "var(--muted-2)", fontStyle: "italic" }}>💡 {step.tip}</div>}
              </div>
              <button
                onClick={() => toggleStepCompleted(i)}
                style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${completedSteps.has(i) ? "var(--accent)" : "var(--border)"}`, background: completedSteps.has(i) ? "var(--accent)" : "transparent", color: completedSteps.has(i) ? "#000" : "var(--muted-2)", fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", cursor: "pointer" }}
              >
                ✓
              </button>
            </div>
          ))}

          {/* Tips */}
          <div style={{ marginTop: 24, padding: 28, background: "var(--accent-dim)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: "var(--radius)" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>💡 Chef&apos;s Tips</h4>
            <ul style={{ listStyle: "none", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 2 }}>
              {tips.map((tip, i) => <li key={i}>→ {tip}</li>)}
            </ul>
          </div>

          {/* Substitutions */}
          <div style={{ marginTop: 14, padding: 28, background: "rgba(147,51,234,0.04)", border: "1px solid rgba(147,51,234,0.12)", borderRadius: "var(--radius)" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>🔄 Substitutions</h4>
            <ul style={{ listStyle: "none", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 2 }}>
              {substitutions.map((s, i) => <li key={i}>→ {s}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Nutrition */}
      <div className="glass" style={{ marginTop: 56, padding: 36, borderRadius: "var(--radius-lg)" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          📊 Nutrition <span style={{ fontWeight: 400, color: "var(--muted-2)", fontSize: "0.85rem" }}>(per serving)</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
          {[
            { v: recipe.calories || "—", l: "Calories" },
            { v: recipe.protein ? `${recipe.protein}g` : "—", l: "Protein" },
            { v: recipe.carbs ? `${recipe.carbs}g` : "—", l: "Carbs" },
            { v: recipe.fat ? `${recipe.fat}g` : "—", l: "Fat" },
          ].map((n) => (
            <div key={n.l} className="glass" style={{ textAlign: "center", padding: 20, borderRadius: 16 }}>
              <div className="nutrition-value">{n.v}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>{n.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn-ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>🔄 Generate Another</button>
        <button className="btn-ghost" onClick={() => navigator.share?.({ title: recipe.name, text: recipe.description })}>↗ Share</button>
        <button className="btn-ghost" onClick={() => window.print()}>🖨 Print</button>
      </div>
    </section>
  );
}
