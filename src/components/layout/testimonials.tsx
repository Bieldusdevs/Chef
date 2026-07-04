"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    stars: "★★★★★",
    text: "ChefAI completely changed how I cook. I used to waste so much food — now every ingredient gets used in something delicious.",
    name: "Sofia Mendes",
    role: "Home Cook, Lisbon",
    initials: "SM",
  },
  {
    stars: "★★★★★",
    text: "The meal planner is incredible. I save 3+ hours per week on planning and grocery shopping. The recipes are genuinely creative.",
    name: "James Kim",
    role: "Fitness Coach, London",
    initials: "JK",
  },
  {
    stars: "★★★★★",
    text: "Cook Mode is a game changer. Step-by-step with timers, keeping my screen on — it's like having a sous chef in my pocket.",
    name: "Ana Rodrigues",
    role: "Food Blogger, Porto",
    initials: "AR",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="py-32 px-5 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-[1200px] mx-auto text-center">
        <div data-reveal className="opacity-0 translate-y-8 transition-all duration-800">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 flex items-center gap-2 justify-center">
            <span className="w-5 h-[1px] bg-accent" />Testimonials
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1]">
            Loved by home chefs<br />around the world
          </h2>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 mt-16">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              data-reveal
              className="opacity-0 translate-y-8 transition-all duration-800 p-8 bg-card border border-border rounded-3xl text-left hover:border-border-hover hover:-translate-y-1"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-accent text-sm mb-4 tracking-[2px]">{t.stars}</div>
              <p className="text-sm text-muted leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center text-sm font-bold text-accent">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-[0.7rem] text-muted-2">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
