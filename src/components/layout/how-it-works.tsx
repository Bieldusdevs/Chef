"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  { n: "1", t: "List ingredients", d: "Type, paste, or photograph what you have available in your kitchen." },
  { n: "2", t: "Choose meal type", d: "Select breakfast, lunch, dinner, dessert or snack to guide the AI." },
  { n: "3", t: "Cook & enjoy", d: "Follow step-by-step instructions with timers and chef's tips." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="how-it-works" style={{ background: "var(--bg-2)" }} ref={ref}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div data-reveal>
          <div className="section-label" style={{ justifyContent: "center" }}>How it works</div>
          <h2 className="section-title" style={{ margin: "0 auto 8px" }}>
            Three simple steps<br />to a perfect meal
          </h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            From fridge to fork in under a minute. No planning needed.
          </p>
        </div>

        <div style={{ display: "flex", gap: 32, marginTop: 72, flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              style={{ flex: "1 1 260px", maxWidth: 340, textAlign: "center", transitionDelay: `${i * 120}ms` }}
            >
              <div className="glass step-num">{s.n}</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>{s.t}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
