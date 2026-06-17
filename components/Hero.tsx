"use client";

/**
 * SIGNATURE pt.2 — the memorable "build assemble" (doc 00/01).
 *
 * On load (after the Loader), a GSAP timeline:
 *   1. types `> initializing shubh.build …` → `> ready` (ready turns --signal)
 *   2. headline lines snap in (blur→sharp, muted→ink), stagger 0.12s
 *   3. a 1px --signal rule sweeps left→right (scaleX 0→1) = "done"
 *   4. subline + buttons fade up
 *
 * The DEFAULT (SSR / reduced-motion) render IS the final state — visible
 * text, `> ready`, full rule. Motion only ever hides-then-reveals, so
 * reduced-motion users (read synchronously, pre-paint) get the final state
 * with no timeline. GSAP is dynamically imported so it stays out of SSR.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import GridBg from "@/components/GridBg";
import Magnetic from "@/components/Magnetic";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const status = statusRef.current;
    if (!root || !status) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // leave final state on screen, run nothing

    const eyebrow = root.querySelector<HTMLElement>("[data-eyebrow]");
    const lines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-line]")
    );
    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const rule = root.querySelector<HTMLElement>("[data-rule]");

    const INIT = "> initializing shubh.build …";

    // Pre-paint: hide everything the timeline will reveal, reset the status.
    if (eyebrow) {
      eyebrow.style.opacity = "0";
      eyebrow.style.transform = "translateY(8px)";
    }
    lines.forEach((l) => {
      l.style.opacity = "0";
      l.style.filter = "blur(8px)";
      l.style.transform = "translateY(24px)";
      l.style.color = "var(--color-muted)";
    });
    reveals.forEach((r) => {
      r.style.opacity = "0";
      r.style.transform = "translateY(16px)";
    });
    if (rule) rule.style.transform = "scaleX(0)";
    status.textContent = "";

    let started = false;
    let killed = false;
    let tl: gsap.core.Timeline | undefined;

    const run = async () => {
      if (started || killed) return;
      started = true;
      const { gsap } = await import("gsap");
      if (killed) return;

      const proxy = { n: 0 };
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. eyebrow fades in
      if (eyebrow) {
        tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.3 });
      }

      // 2. type the status line, then snap to "> ready"
      tl.to(proxy, {
        n: INIT.length,
        duration: 0.7,
        ease: "none",
        onUpdate: () => {
          status.textContent = INIT.slice(0, Math.round(proxy.n));
        },
      });
      tl.add(() => {
        status.innerHTML =
          '&gt; <span style="color:var(--color-signal)">ready</span>';
      }, "+=0.15");

      // 3. headline lines assemble: rise + un-blur, stagger
      tl.to(
        lines,
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          color: "", // back to inherited (ink, or the inline signal spans)
          duration: 0.6,
          stagger: 0.12,
        },
        "+=0.05"
      );

      // 4. signal rule sweeps to finish the build
      if (rule) {
        tl.to(rule, { scaleX: 1, duration: 0.5 }, "-=0.15");
      }

      // 5. subline + buttons fade up
      tl.to(
        reveals,
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      );
    };

    // Start once the Loader is done (or immediately if it already is / was skipped).
    const onDone = () => run();
    if ((window as unknown as { __loaderDone?: boolean }).__loaderDone) {
      run();
    } else {
      window.addEventListener("loader:done", onDone, { once: true });
    }
    const fallback = window.setTimeout(run, 3500); // safety net

    return () => {
      killed = true;
      window.clearTimeout(fallback);
      window.removeEventListener("loader:done", onDone);
      tl?.kill();
    };
  }, []);

  // Headline magnetic hover displacement (M2)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const headline = root.querySelector<HTMLElement>("h1");
    if (!headline) return;

    const elements = Array.from(
      headline.querySelectorAll<HTMLElement>(".hover-word, .hover-char")
    );

    const onPointerMove = (e: PointerEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      const radius = 100; // reaction radius

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          const factor = (radius - dist) / radius; // 1 at center, 0 at boundary
          const angle = Math.atan2(dy, dx);
          // Push away up to 8px, scale up to 1.06
          const pushX = -Math.cos(angle) * 8 * factor;
          const pushY = -Math.sin(angle) * 8 * factor;
          const scale = 1 + 0.06 * factor;
          el.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) scale(${scale})`;
        } else {
          el.style.transform = "";
        }
      });
    };

    const onPointerLeave = () => {
      elements.forEach((el) => {
        el.style.transform = "";
      });
    };

    headline.addEventListener("pointermove", onPointerMove);
    headline.addEventListener("pointerleave", onPointerLeave);

    return () => {
      headline.removeEventListener("pointermove", onPointerMove);
      headline.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <GridBg className="hero-grid-mask" />

      <div className="container relative">
        {/* Eyebrow */}
        <p
          data-eyebrow
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted"
        >
          OPERATOR · INDIA · UTC+5:30
        </p>

        {/* Status line */}
        <p className="mt-5 font-mono text-sm text-muted" aria-live="off">
          <span ref={statusRef}>
            &gt; <span className="text-signal">ready</span>
          </span>
        </p>

        {/* Headline with spans for word/letter animation */}
        <h1
          className="font-display mt-5 font-bold leading-[1.04] tracking-tight text-ink"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
        >
          <span data-line className="block">
            {"I turn ambitious ideas into".split(" ").map((word, idx) => (
              <span
                key={idx}
                className="hover-word inline-block mr-[0.28em] last:mr-0 transition-transform duration-200 ease-out will-change-transform"
              >
                {word}
              </span>
            ))}
          </span>
          <span data-line className="block">
            {"real-world products.".split("").map((char, idx) => (
              <span
                key={idx}
                className={`hover-char inline-block text-signal transition-transform duration-200 ease-out will-change-transform ${
                  char === " " ? "w-[0.28em]" : ""
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Signal rule (the "done" sweep) */}
        <span
          data-rule
          aria-hidden="true"
          className="mt-7 block h-px w-40 origin-left bg-signal sm:w-56"
        />

        {/* Subline */}
        <p
          data-reveal
          className="mt-7 max-w-xl text-base text-muted sm:text-lg"
        >
          Design, build, ship. Websites and products that earn their keep.
        </p>

        {/* Buttons */}
        <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <button
              onClick={() => scrollToId("work")}
              className="rounded-[10px] bg-signal px-6 py-3 font-mono text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.03]"
            >
              See the work
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollToId("contact")}
              className="rounded-[10px] border border-ink px-6 py-3 font-mono text-sm font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
            >
              Start a build
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Scroll hint with a gentle CSS bob (reduced-motion kills it). */}
      <span
        aria-hidden="true"
        className="hero-scroll-hint absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-muted"
      >
        scroll ↓
      </span>
    </section>
  );
}
