import Link from "next/link";

const COLS = [
  { title: "Product", links: [{ l: "Features", h: "#features" }, { l: "Pricing", h: "#pricing" }, { l: "Meal Planner", h: "#" }, { l: "Cook Mode", h: "#" }] },
  { title: "Company", links: [{ l: "About", h: "#" }, { l: "Blog", h: "#" }, { l: "Careers", h: "#" }, { l: "Press", h: "#" }] },
  { title: "Legal", links: [{ l: "Privacy", h: "#" }, { l: "Terms", h: "#" }, { l: "Cookies", h: "#" }] },
];

export function Footer() {
  return (
    <footer style={{ padding: "72px 24px 24px", borderTop: "1px solid var(--border)", marginTop: 72 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
        <div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 12 }}>
            Chef<span style={{ color: "var(--accent)" }}>AI</span>
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 280 }}>
            AI-powered recipe generation for the modern home chef. Turn any ingredients into extraordinary meals.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-2)", marginBottom: 20 }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: "none" }}>
              {col.links.map((link) => (
                <li key={link.l} style={{ marginBottom: 10 }}>
                  <Link href={link.h} className="footer-link">{link.l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: "48px auto 0", paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--muted-2)", flexWrap: "wrap", gap: 8 }}>
        <span>© 2026 ChefAI. All rights reserved.</span>
        <span>Made with 🤍 and AI</span>
      </div>
    </footer>
  );
}
