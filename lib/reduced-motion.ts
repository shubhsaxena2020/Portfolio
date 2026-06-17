"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * Gates ALL motion in the app: when this returns true, components render
 * their final state, mount no GSAP timeline, and mount no cursor trail.
 *
 * Starts `true` so that on the server / first paint we assume reduced motion
 * (the safe, no-animation default) and only opt into motion once we've
 * confirmed the user allows it on the client.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
