"use client";

/**
 * SIGNATURE pt.1 — a build "completing" before content shows (doc 00/01).
 *
 * Fixed --ink overlay. Mono line `building shubh.build` + a 0→100 counter
 * (~2.0s) in Space Grotesk; at 100 a mono `✓ deployed` flashes --signal,
 * then the overlay slides up and unmounts.
 *
 * - Runs once per tab session (sessionStorage `seen-loader`).
 * - Reduced-motion: render nothing; content is visible immediately.
 */
import { useEffect, useState } from "react";

/** Signals Hero that the intro is over (or never ran) so it can assemble. */
function signalLoaderDone() {
  (window as unknown as { __loaderDone?: boolean }).__loaderDone = true;
  window.dispatchEvent(new Event("loader:done"));
}

export default function Loader() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [done, setDone] = useState(false);

  // Decide whether to show the loader at all. Read reduced-motion directly
  // (synchronously) here so reduced users never see it start, and so the
  // decision doesn't wait on the async hook. Renders null until decided.
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || sessionStorage.getItem("seen-loader")) {
      setDone(true);
      signalLoaderDone();
      return;
    }
    sessionStorage.setItem("seen-loader", "1");
    setMounted(true);
  }, []);

  // Drive the 0→100 counter, then the deploy flash + slide-up.
  useEffect(() => {
    if (!mounted) return;

    const duration = 2000;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out so the number decelerates into 100
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDeployed(true);
        window.setTimeout(() => {
          setSlideUp(true);
          signalLoaderDone();
        }, 420);
        window.setTimeout(() => setDone(true), 420 + 720);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  if (done || !mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-ink text-paper"
      style={{
        transform: slideUp
          ? "translateY(-100%) scale(0.9) rotateX(-10deg)"
          : "translateY(0) scale(1) rotateX(0deg)",
        opacity: slideUp ? 0 : 1,
        transition: "transform 0.8s var(--ease), opacity 0.8s var(--ease)",
        transformOrigin: "center top",
        perspective: "1000px",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(79,109,245,0.08) 0%, transparent 60%)",
      }}
    >
      <p className="font-mono text-xs tracking-widest text-muted">
        building shubh.build
      </p>
      <p
        className="font-display mt-4 tabular-nums gradient-text"
        style={{ fontSize: "clamp(3rem, 14vw, 6rem)", fontWeight: 700 }}
      >
        {count}
      </p>
      <p
        className="font-mono mt-4 text-sm"
        style={{
          color: deployed ? "var(--color-signal)" : "transparent",
          transition: "color 0.2s var(--ease)",
        }}
      >
        ✓ deployed
      </p>
    </div>
  );
}
