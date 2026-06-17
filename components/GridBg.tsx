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

    const N = 1500;
    const shapeGalaxy: { x: number; y: number; z: number }[] = [];
    const shapeCluster: { x: number; y: number; z: number }[] = [];
    const shapeGlobe: { x: number; y: number; z: number }[] = [];
    const shapeGrid: { x: number; y: number; z: number }[] = [];
    const shapeNebula: { x: number; y: number; z: number }[] = [];

    // 1. Pre-calculate Spiral Galaxy (Double Arm with dense core)
    for (let i = 0; i < N; i++) {
      if (i < 200) {
        // Core sphere
        const r = Math.pow(Math.random(), 1.5) * 40;
        const lat = Math.random() * Math.PI;
        const lon = Math.random() * Math.PI * 2;
        shapeGalaxy.push({
          x: r * Math.sin(lat) * Math.cos(lon),
          y: r * Math.sin(lat) * Math.sin(lon),
          z: r * Math.cos(lat),
        });
      } else {
        const arm = i % 2;
        const theta = (i / N) * Math.PI * 8;
        const r = Math.pow(Math.random(), 1.5) * 260 + 5;
        shapeGalaxy.push({
          x: Math.cos(theta + arm * Math.PI) * r + (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * (180 / (r + 10)) * 10,
          z: Math.sin(theta + arm * Math.PI) * r + (Math.random() - 0.5) * 15,
        });
      }
    }

    // 2. Pre-calculate Star Cluster (Constellation clump)
    for (let i = 0; i < N; i++) {
      const rClust = Math.pow(Math.random(), 0.75) * 210;
      const lat = Math.random() * Math.PI;
      const lon = Math.random() * Math.PI * 2;
      shapeCluster.push({
        x: rClust * Math.sin(lat) * Math.cos(lon),
        y: rClust * Math.sin(lat) * Math.sin(lon),
        z: rClust * Math.cos(lat),
      });
    }

    // 3. Pre-calculate Globe (Longitude/Latitude lattice sphere)
    const lonCount = 50;
    const latCount = 30;
    for (let i = 0; i < N; i++) {
      const rGlobe = 175;
      const latIdx = Math.floor(i / lonCount) % latCount;
      const lonIdx = i % lonCount;
      const phiGlobe = (latIdx / latCount) * Math.PI;
      const thetaGlobe = (lonIdx / lonCount) * Math.PI * 2;
      shapeGlobe.push({
        x: rGlobe * Math.sin(phiGlobe) * Math.cos(thetaGlobe),
        y: rGlobe * Math.sin(phiGlobe) * Math.sin(thetaGlobe),
        z: rGlobe * Math.cos(phiGlobe),
      });
    }

    // 4. Pre-calculate Curved Horizon Mesh
    const cols = 50;
    for (let i = 0; i < N; i++) {
      const colIdx = i % cols;
      const rowIdx = Math.floor(i / cols);
      const gridX = ((colIdx / cols) - 0.5) * 720;
      const gridZ = (rowIdx / 30) * 500 - 250;
      shapeGrid.push({
        x: gridX,
        y: Math.sin(gridX * 0.008) * 35 + Math.cos(gridZ * 0.008) * 40 - 70,
        z: gridZ,
      });
    }

    // 5. Pre-calculate Nebula Drift Field
    for (let i = 0; i < N; i++) {
      shapeNebula.push({
        x: (Math.random() - 0.5) * 850,
        y: (Math.random() - 0.5) * 650,
        z: (Math.random() - 0.5) * 850,
      });
    }

    // Connect random stars for constellation lines
    const constellationLines: [number, number][] = [];
    for (let i = 0; i < 400; i++) {
      const p1 = Math.floor(Math.random() * N);
      const p2 = Math.floor(Math.random() * N);
      const dist = Math.hypot(
        shapeCluster[p1].x - shapeCluster[p2].x,
        shapeCluster[p1].y - shapeCluster[p2].y
      );
      if (dist < 75) {
        constellationLines.push([p1, p2]);
      }
    }

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouse.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = window.scrollY / docHeight;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially to capture initial position
    handleScroll();

    let rafId = 0;
    const FOCAL_LENGTH = 360;

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // Liquid damping for scroll and camera inertia
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const time = timestamp * 0.0004;
      const yaw = time * 0.2 + mouse.x * 0.35;
      const pitch = 0.25 + mouse.y * 0.2;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const centerX = width / 2;
      const centerY = height * 0.48;

      const projected: { x: number; y: number; visible: boolean; opacity: number }[] = [];
      const progress = currentScrollProgress;

      let shape1, shape2, localP;
      if (progress < 0.25) {
        shape1 = shapeGalaxy;
        shape2 = shapeCluster;
        localP = progress / 0.25;
      } else if (progress < 0.5) {
        shape1 = shapeCluster;
        shape2 = shapeGlobe;
        localP = (progress - 0.25) / 0.25;
      } else if (progress < 0.75) {
        shape1 = shapeGlobe;
        shape2 = shapeGrid;
        localP = (progress - 0.5) / 0.25;
      } else {
        shape1 = shapeGrid;
        shape2 = shapeNebula;
        localP = Math.min(1.0, (progress - 0.75) / 0.25);
      }

      const smoothP = localP * localP * (3 - 2 * localP);

      for (let i = 0; i < N; i++) {
        const p1 = shape1[i];
        const p2 = shape2[i];
        const x3d = p1.x * (1 - smoothP) + p2.x * smoothP;
        const y3d = p1.y * (1 - smoothP) + p2.y * smoothP;
        const z3d = p1.z * (1 - smoothP) + p2.z * smoothP;

        const rx = x3d * cosY - z3d * sinY;
        const rz1 = x3d * sinY + z3d * cosY;

        const ry = y3d * cosP - rz1 * sinP;
        const rz2 = y3d * sinP + rz1 * cosP;

        const finalZ = rz2 + 450;

        if (finalZ > 10) {
          const scale = FOCAL_LENGTH / finalZ;
          const sx = centerX + rx * scale;
          const sy = centerY - ry * scale;
          const opacity = Math.min(1.0, Math.max(0.0, 1.0 - finalZ / 800)) * 0.5;

          projected.push({
            x: sx,
            y: sy,
            visible: sx >= -50 && sx <= width + 50 && sy >= -50 && sy <= height + 50,
            opacity,
          });
        } else {
          projected.push({ x: -9999, y: -9999, visible: false, opacity: 0 });
        }
      }

      ctx.lineWidth = 0.5;

      // Draw Globe Connections
      if (progress >= 0.22 && progress < 0.78) {
        let globeWeight = 0;
        if (progress >= 0.22 && progress < 0.5) {
          globeWeight = smoothP;
        } else {
          globeWeight = 1.0 - smoothP;
        }

        ctx.strokeStyle = `rgba(212, 175, 55, ${globeWeight * 0.16})`;

        for (let i = 0; i < N; i++) {
          const p1 = projected[i];
          if (!p1 || !p1.visible) continue;

          const nextLon = (i % lonCount === lonCount - 1) ? i - lonCount + 1 : i + 1;
          const p2 = projected[nextLon];
          if (p2 && p2.visible) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          const nextLat = i + lonCount;
          if (nextLat < N) {
            const p3 = projected[nextLat];
            if (p3 && p3.visible) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Constellation Connections
      if (progress < 0.48) {
        let clusterWeight = 0;
        if (progress < 0.25) {
          clusterWeight = smoothP;
        } else {
          clusterWeight = 1.0 - smoothP;
        }

        ctx.strokeStyle = `rgba(212, 175, 55, ${clusterWeight * 0.14})`;
        for (let i = 0; i < constellationLines.length; i++) {
          const [idx1, idx2] = constellationLines[i];
          const p1 = projected[idx1];
          const p2 = projected[idx2];
          if (p1 && p1.visible && p2 && p2.visible) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Horizon Grid Connections
      if (progress >= 0.48) {
        let gridWeight = 0;
        if (progress >= 0.48 && progress < 0.75) {
          gridWeight = smoothP;
        } else {
          gridWeight = 1.0 - smoothP;
        }

        ctx.strokeStyle = `rgba(20, 184, 166, ${gridWeight * 0.16})`;
        for (let i = 0; i < N; i++) {
          const col = i % cols;
          const p1 = projected[i];
          if (!p1 || !p1.visible) continue;

          if (col < cols - 1) {
            const p2 = projected[i + 1];
            if (p2 && p2.visible) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          const p3 = projected[i + cols];
          if (p3 && p3.visible && i + cols < N) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
          }
        }
      }

      // Draw Stars (Particles)
      for (let i = 0; i < N; i++) {
        const p = projected[i];
        if (!p || !p.visible) continue;

        const isTeal = i % 3 === 0;
        const color = isTeal ? "20, 184, 166" : "212, 175, 55";
        
        ctx.beginPath();
        const size = (i < 200 && progress < 0.25) ? 1.8 : 0.95;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
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
      window.removeEventListener("scroll", handleScroll);
    };
  }, [motionEnabled]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full opacity-70" />
    </div>
  );
}
