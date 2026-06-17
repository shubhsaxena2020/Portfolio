"use client";

/**
 * Signal-dot + velocity trail (doc 00/01).
 *
 * Canvas, fixed, z-9999, pointer-events:none — never intercepts clicks.
 * - Ring buffer of ~22 points; particle radius 2–5px scaled by velocity.
 * - Color mixes --signal → --muted along the tail; opacity 1→0 over ~450ms.
 * - 7px solid --signal lead dot at the live pointer.
 * - Mounts ONLY on (pointer:fine) devices and when motion is allowed.
 * - Reduced-motion or touch: render nothing, restore system cursor.
 */
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const SIGNAL = "#3d5afe";
const MUTED = "#6b7178";
const TRAIL_LEN = 22;
const LIFETIME = 450; // ms

type Point = { x: number; y: number; t: number; v: number };

export default function Cursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Only enable on fine pointers when motion is allowed.
  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, [reduced]);

  // Toggle the body flag that hides the system cursor.
  useEffect(() => {
    if (enabled) {
      document.body.setAttribute("data-cursor", "on");
      return () => document.body.removeAttribute("data-cursor");
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const points: Point[] = [];
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let hasMoved = false;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      const v = dist / dt; // px per ms
      points.push({ x: e.clientX, y: e.clientY, t: now, v });
      if (points.length > TRAIL_LEN) points.shift();
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      hasMoved = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trail: oldest → newest, fading out over LIFETIME.
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const age = now - p.t;
        if (age > LIFETIME) continue;
        const life = 1 - age / LIFETIME;
        const speed = Math.min(p.v / 1.5, 1); // normalize velocity
        const radius = 2 + speed * 3; // 2–5px
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * life, 0, Math.PI * 2);
        // brighter/--signal at high velocity, --muted when slow
        ctx.fillStyle = speed > 0.5 ? SIGNAL : MUTED;
        ctx.globalAlpha = life * 0.8;
        ctx.fill();
      }

      // Lead dot at the live pointer.
      if (hasMoved) {
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = SIGNAL;
        ctx.globalAlpha = 1;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
