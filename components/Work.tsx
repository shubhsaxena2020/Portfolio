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

function BrandTile({ project }: { project: Project }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--color-ink),var(--color-ink-2))]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 10%, color-mix(in srgb, var(--color-signal) 38%, transparent), transparent 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="grid-bg absolute inset-0 opacity-20"
      />
      <span className="relative font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
        {project.wordmark}
        <span className="text-signal-2">.</span>
      </span>
    </div>
  );
}

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);

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
        const rows = Array.from(
          root.querySelectorAll<HTMLElement>("[data-row]")
        );

        rows.forEach((row, i) => {
          const chips = row.querySelectorAll<HTMLElement>("[data-chip]");
          const parallax = row.querySelector<HTMLElement>("[data-parallax]");

          // Alternating slide-in + chip stagger after the card lands.
          gsap.set(chips, { opacity: 0, y: 8 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          });
          tl.fromTo(
            row,
            { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
          );
          tl.to(
            chips,
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power3.out" },
            "-=0.2"
          );

          // Subtle parallax: image layer drifts opposite scroll within frame.
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
    <section ref={rootRef} id="work" className="py-24 sm:py-32">
      <div className="container">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          SELECTED BUILDS
        </p>
        <h2
          className="font-display mt-4 font-bold leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Real products. Shipped.
        </h2>

        <div className="mt-14 flex flex-col gap-20">
          {projects.map((p, i) => (
            <article
              key={p.id}
              data-row
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Visual frame: brand tile (or real image) + hover zoom + brackets */}
              <div className="group relative aspect-[16/10] overflow-hidden rounded-[14px] border border-grid">
                <div data-parallax className="absolute inset-0 will-change-transform">
                  <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                    {p.hasImage ? (
                      <Image
                        src={p.image}
                        alt={`${p.title} — ${p.category}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <BrandTile project={p} />
                    )}
                  </div>
                </div>

                {/* Signal corner brackets draw in on hover. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>

              {/* Record details */}
              <div>
                <p className="font-mono text-xs text-muted">
                  {p.id} · {p.year}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full border border-grid px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-3xl font-bold">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-muted">{p.result}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      data-chip
                      className="rounded-md bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)] px-2.5 py-1 font-mono text-[11px] text-ink"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <a
                  href={p.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-block font-mono text-sm text-signal transition-opacity hover:opacity-70"
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
