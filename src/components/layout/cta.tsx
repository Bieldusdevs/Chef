"use client";

export function CTA() {
  return (
    <section className="text-center py-24 px-5 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.15), transparent 70%)",
        }}
      />
      <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.04em] mb-4 relative">
        Ready to cook<br />something amazing?
      </h2>
      <p className="text-lg text-muted mb-8 relative">
        Join thousands of home chefs using AI to transform their kitchens.
      </p>
      <button
        onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
        className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-black rounded-full text-base font-bold hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(74,222,128,0.15)] transition-all relative"
      >
        ✨ Start Cooking Now
      </button>
    </section>
  );
}
