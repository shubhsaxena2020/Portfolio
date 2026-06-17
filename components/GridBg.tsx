"use client";

import { useEffect, useRef, useState } from "react";

interface StarFieldStar {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  opacity: number;
  phase: number;
}

interface FlareParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Moon {
  radius: number;
  orbitRadius: number;
  angle: number;
  speed: number;
  color: string;
}

interface Planet {
  name: string;
  radius: number; // planet sphere size
  orbitRadius: number;
  angle: number;
  orbitSpeed: number;
  orbitInclination: number; // inclination angle
  color: string;
  shadowColor: string;
  hasRings: boolean;
  ringsInnerRadius?: number;
  ringsOuterRadius?: number;
  moons: Moon[];
}

interface RenderItem {
  type: "sun" | "planet" | "planet-shadow" | "rings" | "moon" | "flare" | "orbit-track";
  z: number; // calculated depth
  renderFn: () => void;
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

    // 1. Distant Background Stars
    const starCount = 800;
    const backgroundStars: StarFieldStar[] = [];
    for (let i = 0; i < starCount; i++) {
      // Distribute stars on a sphere
      const r = 800 + Math.random() * 400;
      const lat = Math.acos(2 * Math.random() - 1); // uniform distribution
      const lon = Math.random() * Math.PI * 2;
      backgroundStars.push({
        x: r * Math.sin(lat) * Math.cos(lon),
        y: r * Math.sin(lat) * Math.sin(lon) * 0.7,
        z: r * Math.cos(lat),
        color: i % 2 === 0 ? "197, 168, 92" : "107, 131, 149", // gold and slate blue
        size: 0.6 + Math.random() * 0.95,
        opacity: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Sun Plasma Flare Particles
    const flareCount = 60;
    const flares: FlareParticle[] = [];
    for (let i = 0; i < flareCount; i++) {
      const maxLife = 50 + Math.random() * 60;
      flares.push({
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 10,
        speed: 0.35 + Math.random() * 0.45,
        size: 6 + Math.random() * 14,
        opacity: 0,
        maxOpacity: 0.18 + Math.random() * 0.14,
        life: Math.random() * maxLife,
        maxLife,
        color: Math.random() < 0.6 ? "197, 168, 92" : "248, 249, 250", // gold & starlight white
      });
    }

    // 3. Orbits & Orbiting Planets
    const planets: Planet[] = [
      {
        name: "Aurelia",
        radius: 12,
        orbitRadius: 130,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.007,
        orbitInclination: 0.1,
        color: "#c5a85c", // luxury gold
        shadowColor: "#1a1202",
        hasRings: false,
        moons: [
          { radius: 2.2, orbitRadius: 20, angle: Math.random() * Math.PI * 2, speed: 0.035, color: "#f8f9fa" }
        ]
      },
      {
        name: "Oceanus",
        radius: 24,
        orbitRadius: 220,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.004,
        orbitInclination: -0.06,
        color: "#7e9bb4", // slate-blue
        shadowColor: "#050f1a",
        hasRings: true,
        ringsInnerRadius: 32,
        ringsOuterRadius: 55,
        moons: []
      },
      {
        name: "Zephyrus",
        radius: 16,
        orbitRadius: 310,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.0025,
        orbitInclination: 0.12,
        color: "#5eb8b5", // teal-cyan
        shadowColor: "#021716",
        hasRings: false,
        moons: [
          { radius: 2.5, orbitRadius: 24, angle: Math.random() * Math.PI * 2, speed: 0.02, color: "#8e9aa8" },
          { radius: 1.8, orbitRadius: 32, angle: Math.random() * Math.PI * 2, speed: -0.015, color: "#6b8395" }
        ]
      },
      {
        name: "Celestia",
        radius: 10,
        orbitRadius: 390,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.0012,
        orbitInclination: -0.04,
        color: "#f8f9fa", // white/ice
        shadowColor: "#12151c",
        hasRings: false,
        moons: []
      }
    ];

    // Mouse sway tracking
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

    // Scroll progress mapping
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
    const BASE_FOCAL_LENGTH = 330;

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Clean background
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);

      // Damp scroll, mouse and velocity values
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      currentScrollSpeed += (scrollSpeed - currentScrollSpeed) * 0.15;
      scrollSpeed *= 0.85;

      const time = timestamp * 0.0004;
      const progress = currentScrollProgress;

      // 1. Dynamic Camera Scroll Navigation:
      // - Hero (progress 0): full overview of planets orbiting
      // - About (progress 0.25): zooms in near the inner golden planet
      // - Services (progress 0.5): camera rolls close underneath the slate rings
      // - Work (progress 0.75): zooms directly into the burning core of the Sun
      // - Contact (progress 1.0): pulls back to high cosmic overview
      let camDistance = 460;
      let camYOffset = 0;
      let basePitch = 0.85; // tilted orbital planes (rad)
      let baseRoll = 0;

      if (progress < 0.25) {
        const t = progress / 0.25;
        camDistance = 460 - t * 130; // zoom in
        camYOffset = t * -40;
        basePitch = 0.85 - t * 0.25; // tilt down
      } else if (progress < 0.5) {
        const t = (progress - 0.25) / 0.25;
        camDistance = 330 - t * 60;
        camYOffset = -40 + t * -60;
        basePitch = 0.60 - t * 0.2;
        baseRoll = t * 0.45; // camera roll inclination
      } else if (progress < 0.75) {
        const t = (progress - 0.5) / 0.25;
        camDistance = 270 - t * 140; // dive directly into solar core
        camYOffset = -100 + t * 100;
        basePitch = 0.40 - t * 0.35;
        baseRoll = 0.45 - t * 0.45;
      } else {
        const t = (progress - 0.75) / 0.25;
        camDistance = 130 + t * 370; // pull back far
        camYOffset = t * 20;
        basePitch = 0.05 + t * 0.9; // tilt back up
      }

      // Add mouse sway to rotation angles (3D parallax)
      // Constantly slowly rotates around Y-axis (time * 0.06)
      const yaw = time * 0.06 + mouse.x * 0.45;
      const pitch = basePitch + mouse.y * 0.28;
      const roll = baseRoll;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);

      const centerX = width / 2;
      const centerY = height * 0.5;

      // Camera zoom out factor based on active scroll velocity
      const dynamicFocalLength = BASE_FOCAL_LENGTH - Math.min(80, currentScrollSpeed * 0.9);
      const stretch = currentScrollSpeed * 0.4; // stretch factor for trails

      // Helper function for 3D projections
      const project3D = (x: number, y: number, z: number) => {
        // 1. Rotate around Y-axis (Yaw)
        const rx1 = x * cosY - z * sinY;
        const rz1 = x * sinY + z * cosY;
        // 2. Rotate around X-axis (Pitch)
        const ry2 = y * cosP - rz1 * sinP + camYOffset;
        const rz2 = y * sinP + rz1 * cosP;
        // 3. Rotate around Z-axis (Roll)
        const rx3 = rx1 * cosR - ry2 * sinR;
        const ry3 = rx1 * sinR + ry2 * cosR;

        const finalZ = rz2 + camDistance;
        return {
          x: centerX + rx3 * (dynamicFocalLength / finalZ),
          y: centerY - ry3 * (dynamicFocalLength / finalZ),
          z: finalZ,
          scale: dynamicFocalLength / finalZ,
          visible: finalZ > 10,
        };
      };

      // 4. Draw Distant Twinkling Stars (Fades out behind the solar system)
      backgroundStars.forEach((star) => {
        const proj = project3D(star.x, star.y, star.z);
        if (proj.visible && proj.x >= 0 && proj.x <= width && proj.y >= 0 && proj.y <= height) {
          const depthOpacity = Math.min(1.0, Math.max(0.0, 1.0 - proj.z / 1500));
          const twinkle = 0.45 + 0.55 * Math.sin(time * 3 + star.phase);
          const finalSize = star.size * proj.scale;

          if (stretch > 1.2) {
            // Stars stretch vertically during active scrolling
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y - stretch * 0.4);
            ctx.lineTo(proj.x, proj.y + stretch * 0.4);
            ctx.strokeStyle = `rgba(${star.color}, ${star.opacity * twinkle * depthOpacity * 0.75})`;
            ctx.lineWidth = finalSize;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color}, ${star.opacity * twinkle * depthOpacity})`;
            ctx.fill();
          }
        }
      });

      // 5. Gather renderable items for depth-buffer sorting
      const renderQueue: RenderItem[] = [];

      // A. Add Sun (Core radius: 45px in world coordinates)
      const sunProj = project3D(0, 0, 0);
      if (sunProj.visible) {
        renderQueue.push({
          type: "sun",
          z: sunProj.z,
          renderFn: () => {
            const size = 52 * sunProj.scale;
            const grad = ctx.createRadialGradient(sunProj.x, sunProj.y, 0, sunProj.x, sunProj.y, size * 1.5);
            grad.addColorStop(0, "rgba(255, 250, 240, 1)"); // burning white hot center
            grad.addColorStop(0.2, "rgba(255, 220, 120, 0.95)"); // gold inner corona
            grad.addColorStop(0.55, "rgba(197, 168, 92, 0.55)"); // gold outer glow
            grad.addColorStop(1.0, "rgba(197, 168, 92, 0)");

            ctx.beginPath();
            ctx.arc(sunProj.x, sunProj.y, size * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        });
      }

      // B. Add Sun Corona Flares
      flares.forEach((flare, idx) => {
        // Update life
        flare.life += flare.speed * (1.0 + currentScrollSpeed * 0.02);
        if (flare.life >= flare.maxLife) {
          flare.life = 0;
          flare.angle = Math.random() * Math.PI * 2;
          flare.radius = 40 + Math.random() * 10;
          flare.size = 6 + Math.random() * 14;
          flare.maxOpacity = 0.18 + Math.random() * 0.14;
        }

        // Pulse opacity based on life phase
        const lifeP = flare.life / flare.maxLife;
        flare.opacity = Math.sin(lifeP * Math.PI) * flare.maxOpacity;
        
        // Push radius outwards
        const currentR = flare.radius + lifeP * 55;

        // Galactic coordinates of flare particle
        const fx = Math.cos(flare.angle) * currentR;
        const fz = Math.sin(flare.angle) * currentR;
        const fy = Math.sin(time * 5 + idx) * 8; // slight 3D wiggle

        const fProj = project3D(fx, fy, fz);
        if (fProj.visible) {
          renderQueue.push({
            type: "flare",
            z: fProj.z,
            renderFn: () => {
              const flareSize = flare.size * fProj.scale;
              const grad = ctx.createRadialGradient(fProj.x, fProj.y, 0, fProj.x, fProj.y, flareSize);
              grad.addColorStop(0, `rgba(${flare.color}, ${flare.opacity * 0.9})`);
              grad.addColorStop(0.5, `rgba(${flare.color}, ${flare.opacity * 0.3})`);
              grad.addColorStop(1, "rgba(0, 0, 0, 0)");

              ctx.beginPath();
              ctx.arc(fProj.x, fProj.y, flareSize, 0, Math.PI * 2);
              ctx.fillStyle = grad;
              ctx.fill();
            }
          });
        }
      });

      // C. Process Planets, Moons, Rings, and Orbit tracks
      planets.forEach((p) => {
        // 1. Orbital velocity update
        p.angle += p.orbitSpeed * (1.0 + currentScrollSpeed * 0.015);

        // Planet 3D position in solar coordinates (tilted orbital plane)
        const px = Math.cos(p.angle) * p.orbitRadius;
        const pz = Math.sin(p.angle) * p.orbitRadius;
        const py = Math.sin(p.angle + p.orbitInclination) * p.orbitRadius * p.orbitInclination;

        // Add Planet Orbit Track (visual elliptical path)
        renderQueue.push({
          type: "orbit-track",
          z: camDistance + p.orbitRadius, // rendered as backing element
          renderFn: () => {
            ctx.beginPath();
            // Draw orbit path by projecting points along orbit circle
            for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.08) {
              const ox = Math.cos(a) * p.orbitRadius;
              const oz = Math.sin(a) * p.orbitRadius;
              const oy = Math.sin(a + p.orbitInclination) * p.orbitRadius * p.orbitInclination;
              const oProj = project3D(ox, oy, oz);
              if (oProj.visible) {
                if (a === 0) ctx.moveTo(oProj.x, oProj.y);
                else ctx.lineTo(oProj.x, oProj.y);
              }
            }
            ctx.strokeStyle = `rgba(107, 131, 149, 0.085)`; // very faint slate orbit line
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        });

        // 2. Project Planet
        const pProj = project3D(px, py, pz);
        if (pProj.visible) {
          // A. Push the actual Planet Sphere render
          renderQueue.push({
            type: "planet",
            z: pProj.z,
            renderFn: () => {
              const pSize = p.radius * pProj.scale;

              // Base solid sphere
              ctx.beginPath();
              ctx.arc(pProj.x, pProj.y, pSize, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.fill();

              // Shading Mask: calculate light angle from center (0,0,0) to planet
              const lightAngle = p.angle + Math.PI; // shadow faces opposite of orbit angle
              
              // Shadow overlay gradient
              const shadowGrad = ctx.createLinearGradient(
                pProj.x + Math.cos(lightAngle - Math.PI) * pSize * 0.45,
                pProj.y + Math.sin(lightAngle - Math.PI) * pSize * 0.45,
                pProj.x + Math.cos(lightAngle) * pSize * 0.9,
                pProj.y + Math.sin(lightAngle) * pSize * 0.9
              );
              shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)"); // light side
              shadowGrad.addColorStop(0.55, "rgba(0, 0, 0, 0.45)"); // terminator line
              shadowGrad.addColorStop(1.0, "rgba(2, 2, 4, 0.97)"); // dark side
              
              ctx.beginPath();
              ctx.arc(pProj.x, pProj.y, pSize + 0.1, 0, Math.PI * 2);
              ctx.fillStyle = shadowGrad;
              ctx.fill();

              // Subtle atmosphere glow on the light-facing limb
              const glowAngle = p.angle;
              const atmosphereGrad = ctx.createRadialGradient(
                pProj.x - Math.cos(glowAngle) * pSize * 0.25,
                pProj.y - Math.sin(glowAngle) * pSize * 0.25,
                pSize * 0.8,
                pProj.x,
                pProj.y,
                pSize * 1.15
              );
              atmosphereGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
              atmosphereGrad.addColorStop(0.85, `rgba(${p.name === "Zephyrus" ? "94,184,181" : "197,168,92"}, 0.15)`); // subtle cyan or gold rim
              atmosphereGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

              ctx.beginPath();
              ctx.arc(pProj.x, pProj.y, pSize * 1.16, 0, Math.PI * 2);
              ctx.fillStyle = atmosphereGrad;
              ctx.fill();
            }
          });

          // B. Push planetary rings if applicable (Oceanus)
          if (p.hasRings && p.ringsInnerRadius && p.ringsOuterRadius) {
            renderQueue.push({
              type: "rings",
              z: pProj.z + 1.2, // slightly layered depth to clip correctly behind/in front
              renderFn: () => {
                const innerR = p.ringsInnerRadius! * pProj.scale;
                const outerR = p.ringsOuterRadius! * pProj.scale;
                
                // Draw 3D flattened elliptical rings aligned with orbit inclination
                ctx.save();
                ctx.translate(pProj.x, pProj.y);
                ctx.rotate(p.orbitInclination - 0.25); // tilt rings axis slightly
                
                // Scale Y-axis to squash circle into flat 3D elliptical perspective
                ctx.scale(1.0, 0.22); 

                // Outer boundary
                ctx.beginPath();
                ctx.arc(0, 0, outerR, 0, Math.PI * 2);
                // Inner boundary
                ctx.arc(0, 0, innerR, Math.PI * 2, 0, true);
                ctx.closePath();

                const ringGrad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
                ringGrad.addColorStop(0, "rgba(107, 131, 149, 0.45)"); // inner slate ring
                ringGrad.addColorStop(0.4, "rgba(126, 155, 180, 0.35)");
                ringGrad.addColorStop(0.7, "rgba(197, 168, 92, 0.15)"); // golden outer bands
                ringGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)"); // fades out

                ctx.fillStyle = ringGrad;
                ctx.fill();
                ctx.restore();
              }
            });
          }

          // C. Process and Push Moons
          p.moons.forEach((m) => {
            // Update moon orbital angle
            m.angle += m.speed * (1.0 + currentScrollSpeed * 0.015);
            
            // 3D coordinates relative to planet
            // Orbiting in skewed tilt local plane
            const mx = Math.cos(m.angle) * m.orbitRadius;
            const mz = Math.sin(m.angle) * m.orbitRadius;
            const my = Math.sin(m.angle * 0.6) * m.orbitRadius * 0.25;

            // Absolute world coordinates
            const moonWorldX = px + mx;
            const moonWorldY = py + my;
            const moonWorldZ = pz + mz;

            const mProj = project3D(moonWorldX, moonWorldY, moonWorldZ);
            if (mProj.visible) {
              renderQueue.push({
                type: "moon",
                z: mProj.z,
                renderFn: () => {
                  const mSize = m.radius * mProj.scale;
                  ctx.beginPath();
                  ctx.arc(mProj.x, mProj.y, mSize, 0, Math.PI * 2);
                  ctx.fillStyle = m.color;
                  ctx.fill();

                  // Simple dark shadow mask facing away from Sun
                  const shadowAngle = Math.atan2(moonWorldZ, moonWorldX) + Math.PI;
                  const moonShadowGrad = ctx.createLinearGradient(
                    mProj.x - Math.cos(shadowAngle) * mSize * 0.5,
                    mProj.y - Math.sin(shadowAngle) * mSize * 0.5,
                    mProj.x + Math.cos(shadowAngle) * mSize * 0.8,
                    mProj.y + Math.sin(shadowAngle) * mSize * 0.8
                  );
                  moonShadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
                  moonShadowGrad.addColorStop(1.0, "rgba(2, 2, 4, 0.85)");
                  ctx.beginPath();
                  ctx.arc(mProj.x, mProj.y, mSize + 0.1, 0, Math.PI * 2);
                  ctx.fillStyle = moonShadowGrad;
                  ctx.fill();
                }
              });
            }
          });
        }
      });

      // 6. Depth Sort Render Queue (Z-buffer)
      // Sort from back to front (largest Z to smallest Z, since Z is camera distance)
      renderQueue.sort((a, b) => b.z - a.z);

      // 7. Execute sorted draw calls
      renderQueue.forEach((item) => {
        item.renderFn();
      });

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
      <canvas ref={canvasRef} className="block h-full w-full opacity-[0.85]" />
    </div>
  );
}
