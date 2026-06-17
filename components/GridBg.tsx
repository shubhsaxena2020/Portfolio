"use client";

import { useEffect, useRef, useState } from "react";

export default function GridBg({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    setMotionEnabled(!reduced && finePointer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);

    const COLS = 26;
    const ROWS = 20;
    const MIN_Z = 180;
    const MAX_Z = 900;
    const DEPTH = MAX_Z - MIN_Z;
    const WIDTH_FACTOR = 750;
    const FOCAL_LENGTH = 350;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouse.targetY = (e.clientY / window.innerHeight) - 0.5;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let camYaw = 0;
    let camPitch = 0.15;
    let camHeight = 150;
    
    let time = 0;
    let rafId = 0;

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;
      time = timestamp * 0.001;

      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const currentYaw = camYaw + mouse.x * 0.25;
      const currentPitch = camPitch + mouse.y * 0.15;
      const currentHeight = camHeight + Math.sin(time * 0.4) * 10;
      
      const cosYaw = Math.cos(currentYaw);
      const sinYaw = Math.sin(currentYaw);
      const cosPitch = Math.cos(currentPitch);
      const sinPitch = Math.sin(currentPitch);

      const centerX = width / 2;
      const centerY = height * 0.55;

      const screenPoints: { x: number; y: number; z: number }[][] = [];

      const influenceZ = MIN_Z + (mouse.y + 0.5) * DEPTH;
      const influenceX = mouse.x * WIDTH_FACTOR * (influenceZ / FOCAL_LENGTH);
      const maxInfluenceDist = 200;

      for (let r = 0; r <= ROWS; r++) {
        screenPoints[r] = [];
        const z3d = MIN_Z + (r / ROWS) * DEPTH;

        for (let c = 0; c <= COLS; c++) {
          const x3d = ((c / COLS) - 0.5) * WIDTH_FACTOR;
          let y3d = 0;

          if (motionEnabled) {
            const distFromCenter = Math.hypot(x3d, z3d - (MIN_Z + DEPTH/2));
            y3d = Math.sin(distFromCenter * 0.006 - time * 1.5) * 15;
            y3d += Math.cos(x3d * 0.01 + time * 1.0) * 8;

            if (mouse.active) {
              const dx = x3d - influenceX;
              const dz = z3d - influenceZ;
              const dist3d = Math.hypot(dx, dz);
              if (dist3d < maxInfluenceDist) {
                const strength = (1 - dist3d / maxInfluenceDist);
                y3d -= strength * strength * 45;
              }
            }
          }

          const dx = x3d;
          const dy = y3d - currentHeight;
          const dz = z3d;

          const rx1 = dx * cosYaw - dz * sinYaw;
          const rz1 = dx * sinYaw + dz * cosYaw;

          const ry2 = dy * cosPitch - rz1 * sinPitch;
          const rz2 = dy * sinPitch + rz1 * cosPitch;

          if (rz2 > 10) {
            const scale = FOCAL_LENGTH / rz2;
            const sx = centerX + rx1 * scale;
            const sy = centerY - ry2 * scale;
            screenPoints[r][c] = { x: sx, y: sy, z: rz2 };
          } else {
            screenPoints[r][c] = { x: -9999, y: -9999, z: rz2 };
          }
        }
      }

      ctx.lineWidth = 0.75;

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const p1 = screenPoints[r][c];
          if (p1.x < -1000 || p1.x > width + 1000) continue;

          const zPercent = (p1.z - MIN_Z) / DEPTH;
          const opacity = Math.max(0, 1 - zPercent) * 0.28;

          let rVal = 79, gVal = 109, bVal = 245; 

          if (c < COLS) {
            const p2 = screenPoints[r][c + 1];
            if (p2 && p2.x !== -9999) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${opacity})`;
              ctx.stroke();
            }
          }

          if (r < ROWS) {
            const p2 = screenPoints[r + 1][c];
            if (p2 && p2.x !== -9999) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${opacity})`;
              ctx.stroke();
            }
          }

          if (r % 2 === 0 && c % 2 === 0 && opacity > 0.08) {
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${opacity * 1.8})`;
            ctx.fill();
          }
        }
      }

      if (motionEnabled) {
        rafId = requestAnimationFrame(render);
      }
    };

    if (motionEnabled) {
      rafId = requestAnimationFrame(render);
    } else {
      render(0);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [motionEnabled]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-60"
      />
    </div>
  );
}
