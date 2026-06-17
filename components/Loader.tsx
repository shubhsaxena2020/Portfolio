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
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

/** Signals Hero that the intro is over (or never ran) so it can assemble. */
function signalLoaderDone() {
  (window as unknown as { __loaderDone?: boolean }).__loaderDone = true;
  window.dispatchEvent(new Event("loader:done"));
}

export default function Loader() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [done, setDone] = useState(false);

  // Decide whether to show the loader at all (client-only, after RM check).
  useEffect(() => {
    if (reduced) {
      setDone(true);
      signalLoaderDone();
      return;
    }
    if (sessionStorage.getItem("seen-loader")) {
      setDone(true);
      signalLoaderDone();
      return;
    }
    sessionStorage.setItem("seen-loader", "1");
    setMounted(true);
  }, [reduced]);

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
        transform: slideUp ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.7s var(--ease)",
      }}
    >
      <p className="font-mono text-xs tracking-widest text-muted">
        building shubh.build
      </p>
      <p
        className="font-display mt-4 tabular-nums"
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
