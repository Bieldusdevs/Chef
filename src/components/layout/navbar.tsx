"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "How it works", "Pricing", "Testimonials"];

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          Chef<span>AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="nav-link"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in" className="btn-ghost" style={{ padding: "10px 22px" }}>
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="btn-primary"
            style={{ padding: "10px 24px", fontSize: "0.875rem" }}
          >
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
        <div
          style={{
            position: "fixed", inset: 0, background: "var(--bg)", zIndex: 9998,
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 32,
          }}
        >
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: "2rem", fontWeight: 700, color: "var(--fg)" }}
            >
              {item}
            </a>
          ))}
          <Link
            href="/sign-up"
            className="btn-primary"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </>
  );
}
