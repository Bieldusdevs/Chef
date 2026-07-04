"use client";

import { useEffect, useRef } from "react";

const FEATURES = [
  { icon: "🧠", title: "AI Recipe Engine", desc: "Advanced language models analyze your ingredients and generate unique, chef-quality recipes tailored to your taste." },
  { icon: "📸", title: "Image Recognition", desc: "Snap a photo of your fridge or pantry and our AI automatically identifies every ingredient available." },
  { icon: "🥗", title: "Dietary Adaptation", desc: "Whether vegan, keto, gluten-free or allergen-safe — every recipe adapts to your nutritional needs." },
  { icon: "📊", title: "Nutrition Tracking", desc: "Complete macronutrient breakdown with calories, protein, carbs and fats for every generated recipe." },
  { icon: "📅", title: "Meal Planner", desc: "AI-powered weekly meal plans with automatic shopping lists, balanced nutrition and zero food waste." },
  { icon: "👨‍🍳", title: "Cook Mode", desc: "Hands-free cooking with step-by-step guidance, built-in timers and screen-always-on technology." },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    ref.current?.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="features" ref={ref}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal>
          <div className="section-label">Features</div>
          <h2 className="section-title">
            Everything you need<br />to cook smarter
          </h2>
          <p className="section-desc">
            Powered by advanced AI, ChefAI transforms your available ingredients into restaurant-quality recipes in seconds.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
            marginTop: 72,
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              className="glass feature-card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
