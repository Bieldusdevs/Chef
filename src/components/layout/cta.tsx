"use client";

export function CTA() {
  return (
    <section style={{ textAlign: "center", padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div className="cta-glow" />
      <h2 className="section-title" style={{ position: "relative", marginBottom: 16 }}>
        Ready to cook<br />something amazing?
      </h2>
      <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: 36, position: "relative" }}>
        Join thousands of home chefs using AI to transform their kitchens.
      </p>
      <button
        className="btn-primary"
        style={{ position: "relative", padding: "20px 44px", fontSize: "1.1rem" }}
        onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
      >
        ✨ Start Cooking Now
      </button>
    </section>
  );
}
