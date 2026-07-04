"use client";

import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "py-3 px-6 backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.08)]"
            : "py-5 px-6"
        }`}
      >
        <Link
          href="/"
          className="text-[1.4rem] font-extrabold tracking-[-0.04em] flex items-center gap-[0.15em]"
        >
          Chef<span className="text-accent">AI</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing", "Testimonials"].map(
            (item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-accent after:transition-all hover:after:w-full"
                >
                  {item}
                </a>
              </li>
            )
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="px-5 py-2 rounded-full text-sm font-semibold text-muted hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 rounded-full text-sm font-semibold bg-accent text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-full text-sm font-semibold border border-border text-muted hover:text-foreground hover:border-border-hover transition-all"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col gap-[5px] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-[22px] h-[1.5px] bg-foreground block transition-all" />
          <span className="w-[22px] h-[1.5px] bg-foreground block transition-all" />
          <span className="w-[22px] h-[1.5px] bg-foreground block transition-all" />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-background z-[9998] flex flex-col items-center justify-center gap-8 md:hidden">
          {["Features", "How it works", "Pricing", "Testimonials"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-2xl font-bold"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            )
          )}
          {!isSignedIn ? (
            <Link
              href="/sign-up"
              className="mt-4 px-8 py-3 rounded-full text-base font-bold bg-accent text-black"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="mt-4 px-8 py-3 rounded-full text-base font-bold bg-accent text-black"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </>
  );
}
