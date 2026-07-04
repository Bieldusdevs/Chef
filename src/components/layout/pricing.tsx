"use client";

import { useEffect, useRef } from "react";

export function Pricing() {
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
    <section id="pricing" className="py-32 px-5" ref={ref}>
      <div className="max-w-[1200px] mx-auto">
        <div data-reveal className="opacity-0 translate-y-8 transition-all duration-800">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 flex items-center gap-2">
            <span className="w-5 h-[1px] bg-accent" />Pricing
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1] mb-4">
            Start free, upgrade<br />when you&apos;re ready
          </h2>
          <p className="text-lg text-muted max-w-[550px] leading-relaxed">
            No credit card required. Upgrade anytime for unlimited access to premium features.
          </p>
        </div>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 mt-16 max-w-[800px]">
          {/* Free */}
          <div data-reveal className="opacity-0 translate-y-8 transition-all duration-800 bg-card border border-border rounded-3xl p-10 hover:-translate-y-1 hover:shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-5xl font-extrabold tracking-[-0.04em] mb-1">
              €0 <span className="text-base font-normal text-muted-2">/ month</span>
            </div>
            <p className="text-sm text-muted mb-8">Perfect for casual cooks exploring AI recipes.</p>
            <ul className="mb-8 space-y-2">
              {["5 recipes per day", "Basic nutrition info", "Save up to 20 recipes", "Cook Mode"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-accent font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3.5 rounded-2xl text-sm font-semibold border border-border text-foreground hover:border-accent hover:bg-accent-dim transition-all">
              Get Started Free
            </button>
          </div>

          {/* Premium */}
          <div
            data-reveal
            className="opacity-0 translate-y-8 transition-all duration-800 bg-accent-dim border border-accent rounded-3xl p-10 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_64px_rgba(0,0,0,0.5)]"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-accent-2" />
            <span className="inline-flex px-3 py-1 bg-accent text-black rounded-full text-[0.7rem] font-bold uppercase tracking-[0.08em] mb-4">
              Most Popular
            </span>
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <div className="text-5xl font-extrabold tracking-[-0.04em] mb-1">
              €9 <span className="text-base font-normal text-muted-2">/ month</span>
            </div>
            <p className="text-sm text-muted mb-8">For serious home chefs who want the full experience.</p>
            <ul className="mb-8 space-y-2">
              {[
                "Unlimited recipes",
                "Image recognition",
                "Weekly meal planner",
                "Shopping lists & PDF export",
                "Complete macro tracking",
                "Fitness, vegan & GF recipes",
                "Priority AI processing",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-accent font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3.5 rounded-2xl text-sm font-semibold bg-accent text-black border border-accent hover:shadow-[0_0_60px_rgba(74,222,128,0.15)] hover:-translate-y-0.5 transition-all">
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
