"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  { num: "1", title: "List ingredients", desc: "Type, paste, or photograph what you have available in your kitchen." },
  { num: "2", title: "Choose meal type", desc: "Select breakfast, lunch, dinner, dessert or snack to guide the AI." },
  { num: "3", title: "Cook & enjoy", desc: "Follow step-by-step instructions with timers and chef's tips." },
];

export function HowItWorks() {
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
    <section id="how-it-works" className="py-32 px-5 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-[1200px] mx-auto text-center">
        <div data-reveal className="opacity-0 translate-y-8 transition-all duration-800">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 flex items-center gap-2 justify-center">
            <span className="w-5 h-[1px] bg-accent" />How it works
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1] mb-2 mx-auto">
            Three simple steps<br />to a perfect meal
          </h2>
          <p className="text-lg text-muted mx-auto">
            From fridge to fork in under a minute. No planning needed.
          </p>
        </div>

        <div className="flex max-md:flex-col gap-8 mt-16 relative">
          <div className="absolute top-[35px] left-[35px] right-[35px] h-[1px] bg-gradient-to-r from-accent via-border to-accent opacity-30 max-md:hidden" />
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              data-reveal
              className="flex-1 text-center relative opacity-0 translate-y-8 transition-all duration-800"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-[70px] h-[70px] rounded-full bg-card border border-border flex items-center justify-center text-2xl font-extrabold text-accent mx-auto mb-6 relative z-[1] transition-all duration-300 hover:bg-accent hover:text-black hover:border-accent hover:shadow-[0_0_60px_rgba(74,222,128,0.15)] hover:scale-110">
                {step.num}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
