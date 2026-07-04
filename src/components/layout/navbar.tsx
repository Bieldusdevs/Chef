"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/store/settings-store";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleSettings, geminiKey } = useSettingsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "How it works", "Pricing", "Testimonials"];
  const hasKey = hydrated && geminiKey.length > 10;

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          Chef<span>AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="nav-link">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Settings / API Key button */}
          <button
            onClick={toggleSettings}
            className="btn-ghost"
            style={{
              padding: "8px 18px",
              gap: 6,
              borderColor: hasKey ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.25)",
              color: hasKey ? "var(--accent)" : "#fbbf24",
            }}
            title={hasKey ? "API Key configured" : "Add API Key"}
          >
            {hasKey ? "🟢" : "🔑"}
            <span style={{ fontSize: "0.8rem" }}>{hasKey ? "Key Active" : "Add Key"}</span>
          </button>

          <Link href="/sign-in" className="btn-ghost" style={{ padding: "10px 22px" }}>
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.875rem" }}>
            Get Started
          </Link>
        </div>

        <button
          className="flex md:hidden flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ width: 22, height: 1.5, background: "var(--fg)", display: "block" }} />
          <span style={{ width: 22, height: 1.5, background: "var(--fg)", display: "block" }} />
          <span style={{ width: 22, height: 1.5, background: "var(--fg)", display: "block" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          {links.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMobileOpen(false)} style={{ fontSize: "2rem", fontWeight: 700, color: "var(--fg)" }}>
              {item}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); toggleSettings(); }}
            className="btn-ghost"
            style={{ borderColor: hasKey ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.25)", color: hasKey ? "var(--accent)" : "#fbbf24" }}
          >
            {hasKey ? "🟢 Key Active" : "🔑 Add API Key"}
          </button>
          <Link href="/sign-up" className="btn-primary" onClick={() => setMobileOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </>
  );
}
