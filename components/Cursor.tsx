"use client";

/**
 * Smooth two-part cursor (doc 06 B3). Replaces v1's laggy particle dots.
 * - Lead dot: 6px solid --signal, follows the pointer 1:1.
 * - Ring: ~26px hollow ring trailing with eased lerp (~0.15/frame); scales up
 *   slightly with velocity; on hover over interactive elements it scales down
 *   and fills (magnetic feel).
 * - requestAnimationFrame; mounts ONLY on (pointer:fine); killed on
 *   reduced-motion. Never intercepts clicks (pointer-events:none).
 */
import { useEffect, useRef, useState } from "react";

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [data-magnetic]';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Enable only on fine pointers with motion allowed; react to changes.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.setAttribute("data-cursor", "on");

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px;
    let ry = py;
    let vx = 0;
    let vy = 0;
    let lastX = px;
    let lastY = py;
    let hovering = false;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      vx = px - lastX;
      vy = py - lastY;
      lastX = px;
      lastY = py;
      hovering = !!(e.target as Element)?.closest?.(INTERACTIVE);
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget) onLeave();
    });

    let raf = 0;
    const render = () => {
      // Ring eases toward the pointer (lerp 0.15).
      rx += (px - rx) * 0.15;
      ry += (py - ry) * 0.15;

      const speed = Math.min(Math.hypot(vx, vy) / 18, 1); // 0..1
      // velocity grows the ring; hover shrinks + fills it.
      const ringScale = hovering ? 0.55 : 1 + speed * 0.4;
      vx *= 0.85;
      vy *= 0.85;

      dot.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.backgroundColor = hovering
        ? "color-mix(in srgb, var(--color-signal) 18%, transparent)"
        : "transparent";
      ring.style.borderColor = hovering
        ? "var(--color-signal)"
        : "color-mix(in srgb, var(--color-signal) 55%, transparent)";

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.body.removeAttribute("data-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[26px] w-[26px] rounded-full border opacity-0"
        style={{ transition: "opacity 0.25s var(--ease)" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-signal opacity-0"
        style={{ transition: "opacity 0.25s var(--ease)" }}
      />
    </>
  );
}
