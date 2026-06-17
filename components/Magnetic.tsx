"use client";

/**
 * Magnetic hover: the child translates toward the cursor (max ~6px) and
 * springs back on leave. Used on hero + service CTAs (doc 06 C/D3).
 * Disabled on touch and reduced-motion → renders a plain inline-block.
 */
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

const MAX = 6; // px

export default function Magnetic({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const enabled = !reduced && !coarse;

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-MAX, Math.min(MAX, dx * 0.4)));
    y.set(Math.max(-MAX, Math.min(MAX, dy * 0.4)));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (!enabled) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
