"use client";

import { useEffect, useRef } from "react";

const DATA = [
  { stars: "★★★★★", text: "ChefAI completely changed how I cook. I used to waste so much food — now every ingredient gets used in something delicious.", name: "Sofia Mendes", role: "Home Cook, Lisbon", init: "SM" },
  { stars: "★★★★★", text: "The meal planner is incredible. I save 3+ hours per week on planning and grocery shopping. The recipes are genuinely creative.", name: "James Kim", role: "Fitness Coach, London", init: "JK" },
  { stars: "★★★★★", text: "Cook Mode is a game changer. Step-by-step with timers, keeping my screen on — it's like having a sous chef in my pocket.", name: "Ana Rodrigues", role: "Food Blogger, Porto", init: "AR" },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="testimonials" style={{ background: "var(--bg-2)" }} ref={ref}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div data-reveal>
          <div className="section-label" style={{ justifyContent: "center" }}>Testimonials</div>
          <h2 className="section-title">Loved by home chefs<br />around the world</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 72 }}>
          {DATA.map((t, i) => (
            <div key={t.name} data-reveal className="glass testimonial-card" style={{ textAlign: "left", transitionDelay: `${i * 100}ms` }}>
              <div style={{ color: "var(--accent)", fontSize: "0.9rem", marginBottom: 16, letterSpacing: 2 }}>{t.stars}</div>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: 24 }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>
                  {t.init}
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted-2)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
