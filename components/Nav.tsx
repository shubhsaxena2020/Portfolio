"use client";

/**
 * Top status bar (doc 01).
 * - Left: `Shubh Saxena.` wordmark (display, --signal dot).
 * - Center (desktop): About · Services · Work · Contact (mono, small).
 * - Right: live status pill `● available · IST` + "Start a build" CTA.
 * - Dark glass nav on scroll: --ink-2 bg, backdrop-blur, luminous border.
 *   Mobile: wordmark + pill + hamburger → slide-down panel.
 */
import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-300"
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--color-ink-2) 85%, transparent)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "transparent"}`,
        backdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
      }}
    >
      <nav className="container flex h-16 items-center justify-between" aria-label="Primary">
        <button
          onClick={() => go("hero")}
          className="font-display text-base font-bold tracking-tight text-paper sm:text-lg"
          aria-label="Shubh Saxena — back to top"
        >
          {/* Full wordmark — fits comfortably from 360px up. */}
          Shubh Saxena<span className="text-signal">.</span>
        </button>

        {/* Center links — desktop only */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-paper"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 font-mono text-xs text-muted sm:flex">
            <span
              className="inline-block h-2 w-2 rounded-full bg-signal"
              style={{ boxShadow: "0 0 8px var(--color-signal)" }}
              aria-hidden="true"
            />
            available
            <span className="text-grid">·</span>
            <span>IST</span>
          </span>

          <button
            onClick={() => go("contact")}
            className="hidden rounded-[10px] bg-signal px-4 py-2 font-mono text-xs font-medium text-white transition-transform duration-200 hover:scale-[1.03] sm:inline-block"
          >
            Start a build
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-4 w-5">
              <span
                className="absolute left-0 block h-0.5 w-5 bg-paper transition-transform duration-200"
                style={{ top: open ? "7px" : "2px", transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 top-[7px] block h-0.5 w-5 bg-paper transition-opacity duration-200"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute left-0 block h-0.5 w-5 bg-paper transition-transform duration-200"
                style={{ top: open ? "7px" : "12px", transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile slide-down panel */}
      <div
        id="mobile-menu"
        className="overflow-hidden border-t md:hidden"
        style={{
          maxHeight: open ? "320px" : "0px",
          borderColor: open ? "rgba(255,255,255,0.06)" : "transparent",
          backgroundColor: "color-mix(in srgb, var(--color-ink-2) 95%, transparent)",
          backdropFilter: "blur(16px)",
          transition: "max-height 0.3s var(--ease)",
        }}
      >
        <ul className="container flex flex-col gap-1 py-3">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="w-full py-2 text-left font-mono text-sm uppercase tracking-wider text-paper"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => go("contact")}
              className="mt-2 w-full rounded-[10px] bg-signal px-4 py-3 text-center font-mono text-sm font-medium text-white"
            >
              Start a build
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
