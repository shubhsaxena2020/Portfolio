"use client";

/**
 * Real projects rendered as "build records" (doc 01/02/06).
 * Data from typed lib/projects.ts. Each record: mono `build_NN · <year>` ·
 * category pill · title · result · tech chips · link.
 *
 * Visuals (doc 06 E1): a designed brand tile (gradient + wordmark in the
 * site's language) stands in until a real screenshot exists — never a grey
 * "pending" box. If a project sets hasImage:true, its public/work/* image is
 * shown via next/image instead.
 *
 * Motion (doc 06 E2): alternating slide-in reveal · subtle image parallax ·
 * tech-chip stagger after the card lands · hover image zoom + signal corner
 * brackets. Reduced-motion → final state, no timelines.
 */
import { useEffect, useRef } from "react";
import Image from "next/image";
import { projects, type Project } from "@/lib/projects";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

function BrandTile({ project }: { project: Project }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#020204,#0d0e15)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 10%, color-mix(in srgb, var(--color-signal) 25%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(100% 80% at 85% 90%, color-mix(in srgb, var(--color-signal-2) 18%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="grid-bg absolute inset-0 opacity-15"
      />
      <span className="relative font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
        {project.wordmark}
        <span className="text-signal">.</span>
      </span>
    </div>
  );
}

function ProjectCard({ project, tiltEnabled }: { project: Project; tiltEnabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const y = useMotionValue(0);

  const springRX = useSpring(rx, { stiffness: 220, damping: 18 });
  const springRY = useSpring(ry, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  const rotateX = useTransform(springRX, (v) => `${v}deg`);
  const rotateY = useTransform(springRY, (v) => `${v}deg`);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (tiltEnabled) {
      ry.set(px * 10);
      rx.set(-py * 10);
    }
    y.set(-4);

    ref.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    ref.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        y: springY,
        transformPerspective: 1000,
      }}
      className="group relative aspect-[16/10] overflow-hidden rounded-[14px] border border-[var(--color-border-subtle)] bg-surface card-sheen cursor-pointer"
    >
      {tiltEnabled && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-signal) 12%, transparent), transparent 60%)",
            }}
          />
        </div>
      )}

      <div data-parallax className="absolute inset-0 will-change-transform">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          {project.hasImage ? (
            <Image
              src={project.image}
              alt={`${project.title} — ${project.category}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <BrandTile project={project} />
          )}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-5 h-5 w-5 border-l-2 border-t-2 border-signal opacity-0 transition-all duration-300 ease-out group-hover:left-3 group-hover:top-3 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-5 h-5 w-5 border-b-2 border-r-2 border-signal opacity-0 transition-all duration-300 ease-out group-hover:bottom-3 group-hover:right-3 group-hover:opacity-100"
      />
    </motion.div>
  );
}

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const tiltEnabled = !reduced && !coarse;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let killed = false;
    let ctx: gsap.Context | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const reveals = Array.from(
          root.querySelectorAll<HTMLElement>("[data-reveal]")
        );
        const rows = Array.from(
          root.querySelectorAll<HTMLElement>("[data-row]")
        );

        if (reveals.length > 0) {
          gsap.set(reveals, { opacity: 0, y: 28 });
          gsap.to(reveals, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
              once: true,
            },
          });
        }

        rows.forEach((row, i) => {
          const chips = row.querySelectorAll<HTMLElement>("[data-chip]");
          const parallax = row.querySelector<HTMLElement>("[data-parallax]");

          gsap.set(chips, { opacity: 0, y: 8 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          });
          tl.fromTo(
            row,
            {
              opacity: 0,
              x: i % 2 === 0 ? -60 : 60,
              rotationX: 18,
              rotationY: i % 2 === 0 ? -12 : 12,
              transformPerspective: 1000,
              transformOrigin: i % 2 === 0 ? "left center" : "right center",
            },
            {
              opacity: 1,
              x: 0,
              rotationX: 0,
              rotationY: 0,
              duration: 0.8,
              ease: "power4.out",
            }
          );
          tl.to(
            chips,
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power4.out" },
            "-=0.2"
          );

          if (parallax) {
            gsap.set(parallax, { scale: 1.1 });
            gsap.fromTo(
              parallax,
              { y: -14 },
              {
                y: 14,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });
      }, root);
    })();

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="work" className="py-24 sm:py-32 ambient-glow-section">
      <div className="container">
        <p data-reveal className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          SELECTED BUILDS
        </p>
        <h2
          data-reveal
          className="font-display mt-4 font-bold leading-[1.1] tracking-tight gradient-text"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Real products. Shipped.
        </h2>

        <div className="mt-14 flex flex-col gap-20">
          {projects.map((p, i) => (
            <article
              key={p.id}
              data-row
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 text-paper ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ProjectCard project={p} tiltEnabled={tiltEnabled} />

              {/* Record details */}
              <div>
                <p className="font-mono text-xs text-muted">
                  {p.id} · {p.year}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full border border-[var(--color-border-subtle)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-3xl font-bold text-paper">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-muted">{p.result}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      data-chip
                      className="rounded-md bg-[color-mix(in_srgb,var(--color-signal)_8%,var(--color-surface))] border border-[var(--color-border-subtle)] px-2.5 py-1 font-mono text-[11px]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <a
                  href={p.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animated-underline mt-7 inline-block font-mono text-sm text-signal transition-opacity hover:opacity-70"
                >
                  {p.link.label}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
