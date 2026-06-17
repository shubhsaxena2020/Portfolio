"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  colorRgb: string;
  size: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    visible: false,
  });

  // Enable only on fine pointers with motion allowed.
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.body.setAttribute("data-cursor", "on");

    // Handle canvas sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particle pool (120 particles max)
    const MAX_PARTICLES = 120;
    const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      colorRgb: "43, 75, 255",
      size: 0,
      life: 0,
      maxLife: 0,
      active: false,
    }));

    const colors = [
      "43, 75, 255",   // var(--color-signal)
      "108, 139, 255",  // var(--color-signal-2)
      "255, 255, 255",  // white
    ];

    const emitParticles = (x: number, y: number, vx: number, vy: number) => {
      const count = Math.floor(Math.random() * 3) + 2; // emit 2 to 4 particles
      let emitted = 0;

      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (!particles[i].active) {
          const p = particles[i];
          p.active = true;
          p.x = x;
          p.y = y;
          // Inherit fraction of pointer velocity + small random spread
          p.vx = (Math.random() - 0.5) * 1.2 + vx * 0.12;
          p.vy = (Math.random() - 0.5) * 1.2 + vy * 0.12;
          p.colorRgb = colors[Math.floor(Math.random() * colors.length)];
          p.size = Math.random() * 2 + 1; // 1 to 3px
          p.life = p.maxLife = Math.random() * 200 + 500; // 500 to 700ms

          emitted++;
          if (emitted >= count) break;
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const ptr = pointerRef.current;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.visible = true;

      if (ptr.lastX === 0 && ptr.lastY === 0) {
        ptr.lastX = ptr.x;
        ptr.lastY = ptr.y;
      }

      ptr.vx = ptr.x - ptr.lastX;
      ptr.vy = ptr.y - ptr.lastY;
      ptr.lastX = ptr.x;
      ptr.lastY = ptr.y;

      emitParticles(ptr.x, ptr.y, ptr.vx, ptr.vy);
    };

    const onPointerLeave = () => {
      pointerRef.current.visible = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    let lastTime = performance.now();
    let rafId = 0;

    const render = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      // Update and draw particles
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i];
        if (p.active) {
          p.x += p.vx;
          p.y += p.vy;
          // Decelerate
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.life -= deltaTime;

          if (p.life <= 0) {
            p.active = false;
          } else {
            const alpha = Math.max(0, 0.45 * (p.life / p.maxLife));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.colorRgb}, ${alpha})`;
            ctx.fill();
          }
        }
      }

      // Draw subtle lead indicator (small soft dot)
      const ptr = pointerRef.current;
      if (ptr.visible) {
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(43, 75, 255, 0.5)";
        ctx.fill();
      }

      // decay pointer velocity slowly
      ptr.vx *= 0.85;
      ptr.vy *= 0.85;

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.body.removeAttribute("data-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
    />
  );
}
