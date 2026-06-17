"use client";

import { useEffect, useRef, useState } from "react";

interface Star {
  x: number; // galactic x
  y: number; // galactic y (disc height)
  z: number; // galactic z
  radius: number; // distance from galactic center
  angle: number; // current orbital angle
  orbitalSpeed: number; // speed of rotation (differential)
  color: string; // rgb color string
  size: number;
  opacity: number;
  phase: number; // twinkle phase
}

interface GasCloud {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  opacity: number;
}

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

    // Initialize 3D Spiral Galaxy
    const N = 2400; // total stars
    const stars: Star[] = [];
    const gasClouds: GasCloud[] = [];

    // 1. Generate core and arm stars
    for (let i = 0; i < N; i++) {
      const isCore = i < 600;
      
      let r = 0;
      let theta = 0;
      let x = 0;
      let y = 0;
      let z = 0;
      let color = "248, 249, 250"; // default white
      let size = 0.6 + Math.random() * 0.9;
      let opacity = 0.35 + Math.random() * 0.55;

      if (isCore) {
        // High density spherical core
        r = Math.pow(Math.random(), 1.5) * 45;
        const lat = Math.random() * Math.PI;
        const lon = Math.random() * Math.PI * 2;
        x = r * Math.sin(lat) * Math.cos(lon);
        y = r * Math.sin(lat) * Math.sin(lon) * 0.7; // slightly flattened
        z = r * Math.cos(lat);
        theta = Math.atan2(z, x);

        // Core colors: warm golds and bright white
        const colorRand = Math.random();
        if (colorRand < 0.6) {
          color = "255, 235, 180"; // soft gold
        } else if (colorRand < 0.9) {
          color = "248, 249, 250"; // white
        } else {
          color = "212, 175, 55"; // deep gold
        }
        size = 0.8 + Math.random() * 1.1;
      } else {
        // Two-armed spiral galaxy
        const arm = i % 2 === 0 ? 0 : Math.PI;
        // Distribute radius out to 360px
        r = Math.pow(Math.random(), 1.3) * 315 + 40;
        
        // Logarithmic spiral math: angle = r * constant + arm offset
        theta = r * 0.0125 + arm;
        
        // Add random scatter (dispersion) to give spiral arms thickness
        const scatterRadius = (350 - r) * 0.09 + 8;
        const dispX = (Math.random() - 0.5) * scatterRadius * 1.5;
        const dispY = (Math.random() - 0.5) * 10; // disc height thickness
        const dispZ = (Math.random() - 0.5) * scatterRadius * 1.5;

        x = Math.cos(theta) * r + dispX;
        y = dispY;
        z = Math.sin(theta) * r + dispZ;

        // Recalculate true polar coordinates for rotation
        r = Math.hypot(x, z);
        theta = Math.atan2(z, x);

        // Arm colors: mix of luxury gold and slate indigo
        const colorRand = Math.random();
        if (colorRand < 0.45) {
          color = "197, 168, 92"; // luxury gold
        } else if (colorRand < 0.85) {
          color = "107, 131, 149"; // slate blue-grey
        } else {
          color = "126, 155, 180"; // cosmic blue
        }
      }

      // Keplerian-like differential rotation: inner core speeds rotate faster
      // Speed = Constant / sqrt(radius)
      const orbitalSpeed = 0.00015 + 0.0035 / (r + 15);

      stars.push({
        x,
        y,
        z,
        radius: r,
        angle: theta,
        orbitalSpeed,
        color,
        size,
        opacity,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Generate Volumetric Gas Clouds (for dust lanes & glowing volumetric spaces)
    // Add one main core gas cloud
    gasClouds.push({ x: 0, y: 0, z: 0, size: 130, color: "197, 168, 92", opacity: 0.09 });
    
    // Add clouds along the spiral arms
    for (let armIdx = 0; armIdx < 2; armIdx++) {
      const arm = armIdx * Math.PI;
      for (let j = 1; j <= 4; j++) {
        const r = j * 70 + 20;
        const theta = r * 0.0125 + arm;
        gasClouds.push({
          x: Math.cos(theta) * r,
          y: (Math.random() - 0.5) * 6,
          z: Math.sin(theta) * r,
          size: 70 + Math.random() * 50,
          color: j % 2 === 0 ? "107, 131, 149" : "197, 168, 92", // alternate slate and gold
          opacity: 0.04 + Math.random() * 0.03,
        });
      }
    }

    // Interactive mouse tracking
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

    // Scroll mapping
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrollSpeed = 0;
    let currentScrollSpeed = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollSpeed = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = window.scrollY / docHeight;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let rafId = 0;
    const FOCAL_LENGTH = 340;

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Clear with very slight transparency to leave a minute trace trail on motion
      ctx.fillStyle = "rgba(2, 2, 4, 1)";
      ctx.fillRect(0, 0, width, height);

      // Damp scroll and mouse values
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      currentScrollSpeed += (scrollSpeed - currentScrollSpeed) * 0.15;
      scrollSpeed *= 0.85;

      const time = timestamp * 0.0004;
      const progress = currentScrollProgress;

      // 1. Camera Flight Trajectory based on Scroll
      // - Hero (progress 0): full view, galaxy tilted
      // - About (progress 0.25): zoom in closer to arm
      // - Services (progress 0.5): camera rolls and dives
      // - Work (progress 0.75): zooms deeply into the glowing core
      // - Contact (progress 1.0): pulls back to show total galaxy
      let camDistance = 440;
      let camYOffset = 0;
      let basePitch = 0.75; // tilted galaxy plane (rad)
      let baseRoll = 0;

      if (progress < 0.25) {
        const t = progress / 0.25;
        camDistance = 440 - t * 100; // zoom in
        camYOffset = t * -30;
        basePitch = 0.75 - t * 0.2; // tilt down
      } else if (progress < 0.5) {
        const t = (progress - 0.25) / 0.25;
        camDistance = 340 - t * 50;
        camYOffset = -30 + t * -40;
        basePitch = 0.55 - t * 0.15;
        baseRoll = t * 0.3; // camera roll angle
      } else if (progress < 0.75) {
        const t = (progress - 0.5) / 0.25;
        camDistance = 290 - t * 110; // zoom deeply into core
        camYOffset = -70 + t * 90;
        basePitch = 0.4 - t * 0.3; // looking head-on into core disc
        baseRoll = 0.3 - t * 0.3;
      } else {
        const t = (progress - 0.75) / 0.25;
        camDistance = 180 + t * 290; // pull back far
        camYOffset = 20 - t * 20;
        basePitch = 0.1 + t * 0.75; // tilt back up to view full disc
      }

      // Add mouse sway to rotation angles (3D parallax)
      const yaw = time * 0.15 + mouse.x * 0.45;
      const pitch = basePitch + mouse.y * 0.25;
      const roll = baseRoll;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);

      const centerX = width / 2;
      const centerY = height * 0.5;

      // Dynamic zoom-out focal length on rapid scroll
      const dynamicFocalLength = FOCAL_LENGTH - Math.min(80, currentScrollSpeed * 0.95);
      const stretch = currentScrollSpeed * 0.4; // stretch factor for trails

      // 2. Volumetric Gas rendering (rendered behind stars)
      gasClouds.forEach((cloud) => {
        // Differential rotation of gas cloud
        const cloudDist = Math.hypot(cloud.x, cloud.z);
        const cloudOmega = 0.00015 + 0.0035 / (cloudDist + 15);
        const currentAngle = Math.atan2(cloud.z, cloud.x) + timestamp * cloudOmega;
        
        const cx3d = Math.cos(currentAngle) * cloudDist;
        const cy3d = cloud.y;
        const cz3d = Math.sin(currentAngle) * cloudDist;

        // Apply 3D camera rotation
        const rx = cx3d * cosY - cz3d * sinY;
        const rz1 = cx3d * sinY + cz3d * cosY;
        const ry = cy3d * cosP - rz1 * sinP + camYOffset;
        const rz2 = cy3d * sinP + rz1 * cosP;

        const finalZ = rz2 + camDistance;

        if (finalZ > 10) {
          const scale = dynamicFocalLength / finalZ;
          const sx = centerX + rx * scale;
          const sy = centerY - ry * scale;
          const cloudSize = cloud.size * scale;

          if (sx + cloudSize > 0 && sx - cloudSize < width && sy + cloudSize > 0 && sy - cloudSize < height) {
            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, cloudSize);
            grad.addColorStop(0, `rgba(${cloud.color}, ${cloud.opacity * (1.0 - finalZ / 1000)})`);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.beginPath();
            ctx.arc(sx, sy, cloudSize, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        }
      });

      // 3. Draw Stars
      for (let i = 0; i < N; i++) {
        const s = stars[i];

        // Differential Orbit rotation tick
        s.angle += s.orbitalSpeed * (1.0 + currentScrollSpeed * 0.015);
        s.x = Math.cos(s.angle) * s.radius;
        s.z = Math.sin(s.angle) * s.radius;

        // Rotate point in 3D galactic plane
        const rx = s.x * cosY - s.z * sinY;
        const rz1 = s.x * sinY + s.z * cosY;
        const ry = s.y * cosP - rz1 * sinP + camYOffset;
        const rz2 = s.y * sinP + rz1 * cosP;

        const finalZ = rz2 + camDistance;

        if (finalZ > 10) {
          const scale = dynamicFocalLength / finalZ;
          let sx = centerX + rx * scale;
          let sy = centerY - ry * scale;

          // Localized mouse sway distortion
          const mousePixelX = (mouse.x + 0.5) * width;
          const mousePixelY = (mouse.y + 0.5) * height;
          const dx = sx - mousePixelX;
          const dy = sy - mousePixelY;
          const distToMouse = Math.hypot(dx, dy);

          if (distToMouse < 130) {
            const force = (1.0 - distToMouse / 130) * 16;
            const angle = Math.atan2(dy, dx);
            sx += Math.cos(angle) * force;
            sy += Math.sin(angle) * force;
          }

          // Screen visibility bounds check
          if (sx >= -10 && sx <= width + 10 && sy >= -10 && sy <= height + 10) {
            const depthOpacity = Math.min(1.0, Math.max(0.0, 1.0 - finalZ / 950));
            const twinkle = 0.55 + 0.45 * Math.sin(time * 3 + s.phase);

            const finalSize = s.size * scale * 0.35;

            if (stretch > 1.2) {
              // Streak stars along motion vector when warp speed is active
              const angleOfTravel = s.angle + Math.PI / 2; // tangent to circle orbit
              const vx = Math.cos(angleOfTravel) * stretch * scale * 0.01;
              const vy = Math.sin(angleOfTravel) * stretch * scale * 0.01;

              ctx.beginPath();
              ctx.moveTo(sx - vx, sy - vy);
              ctx.lineTo(sx + vx, sy + vy);
              ctx.strokeStyle = `rgba(${s.color}, ${s.opacity * twinkle * depthOpacity * 0.8})`;
              ctx.lineWidth = finalSize;
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.arc(sx, sy, finalSize, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${s.color}, ${s.opacity * twinkle * depthOpacity})`;
              ctx.fill();
            }
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
      window.removeEventListener("scroll", handleScroll);
    };
  }, [motionEnabled]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full opacity-[0.82]" />
    </div>
  );
}
