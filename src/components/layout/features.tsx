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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    ref.current?.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-32 px-5" ref={ref}>
      <div className="max-w-[1200px] mx-auto">
        <div data-reveal className="opacity-0 translate-y-10 transition-all duration-800">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 flex items-center gap-2">
            <span className="w-5 h-[1px] bg-accent" />Features
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1] mb-4">
            Everything you need<br />to cook smarter
          </h2>
          <p className="text-lg text-muted max-w-[550px] leading-relaxed">
            Powered by advanced AI, ChefAI transforms your available ingredients into restaurant-quality recipes in seconds.
          </p>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 mt-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              className="opacity-0 translate-y-10 transition-all duration-800 bg-card border border-border rounded-3xl p-10 relative overflow-hidden group hover:border-border-hover hover:bg-card-hover hover:-translate-y-1 hover:shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="w-12 h-12 rounded-[10px] bg-accent-dim flex items-center justify-center text-2xl mb-6">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-[-0.02em]">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
