import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-16 px-5 border-t border-border mt-16">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] max-md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-[1.4rem] font-extrabold tracking-[-0.04em] mb-3">
            Chef<span className="text-accent">AI</span>
          </h3>
          <p className="text-sm text-muted leading-relaxed max-w-[280px]">
            AI-powered recipe generation for the modern home chef. Turn any ingredients into extraordinary meals.
          </p>
        </div>
        {[
          {
            title: "Product",
            links: [
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Meal Planner", href: "/meal-planner" },
              { label: "Cook Mode", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Press", href: "#" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Cookies", href: "#" },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-2 mb-5">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-border flex max-md:flex-col justify-between items-center text-xs text-muted-2 gap-2">
        <span>© 2026 ChefAI. All rights reserved.</span>
        <span>Made with 🤍 and AI</span>
      </div>
    </footer>
  );
}
