"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * Gates ALL motion: when true, components render their final state, mount no
 * GSAP timeline, and mount no cursor.
 *
 * IMPORTANT (the v1 hero bug): this defaults to FALSE — motion ON. On the
 * server and the first client render it returns false (so SSR and hydration
 * agree → no mismatch), then an effect reads the real media query and flips
 * to true only if the user explicitly prefers reduced motion. Defaulting to
 * `true` was what kept the hero/loader/cursor from ever animating.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
