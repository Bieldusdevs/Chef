"use client";

import { useEffect, useRef } from "react";

export function Pricing() {
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
    <section className="section" id="pricing" ref={ref}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal>
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Start free, upgrade<br />when you&apos;re ready</h2>
          <p className="section-desc">No credit card required. Upgrade anytime for unlimited access.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginTop: 72, maxWidth: 820 }}>
          {/* Free */}
          <div data-reveal className="glass pricing-card" style={{ position: "relative" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Free</h3>
            <div className="pricing-price">€0 <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--muted-2)" }}>/ month</span></div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4, marginBottom: 32 }}>
              Perfect for casual cooks exploring AI recipes.
            </p>
            <ul style={{ listStyle: "none", marginBottom: 32 }}>
              {["5 recipes per day", "Basic nutrition info", "Save up to 20 recipes", "Cook Mode"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="btn-ghost" style={{ width: "100%", padding: 16, borderRadius: 16 }}>Get Started Free</button>
          </div>

          {/* Premium */}
          <div data-reveal className="glass pricing-card featured" style={{ position: "relative", transitionDelay: "100ms" }}>
            <span style={{ display: "inline-flex", padding: "5px 14px", background: "var(--accent)", color: "#000", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              Most Popular
            </span>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Premium</h3>
            <div className="pricing-price">€9 <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--muted-2)" }}>/ month</span></div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: 4, marginBottom: 32 }}>
              For serious home chefs who want the full experience.
            </p>
            <ul style={{ listStyle: "none", marginBottom: 32 }}>
              {["Unlimited recipes", "Image recognition", "Weekly meal planner", "Shopping lists & PDF", "Complete macro tracking", "Fitness, vegan & GF", "Priority AI"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="btn-primary" style={{ width: "100%", borderRadius: 16 }}>Start 14-Day Free Trial</button>
          </div>
        </div>
      </div>
    </section>
  );
}
