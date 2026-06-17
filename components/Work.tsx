"use client";

/**
 * Real projects rendered as "build records" (doc 01/02).
 * Data comes from the typed lib/projects.ts (single source). Each record:
 *   mono `build_NN · <year>` · category pill · title · result · tech chips ·
 *   link button. Screenshots may not exist yet → intentional placeholder
 *   panel (TODO: swap to next/image once public/work/*.png are added).
 * Alternating slide-in reveal; reduced-motion → final state.
 */
import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-row]"));
    let killed = false;
    let ctx: gsap.Context | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        rows.forEach((row, i) => {
          gsap.set(row, { opacity: 0, x: i % 2 === 0 ? -40 : 40 });
          gsap.to(row, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          });
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
              {/* Visual placeholder (TODO: replace with next/image p.image) */}
              <div className="overflow-hidden rounded-[14px] border border-grid bg-surface">
                <div className="flex aspect-[16/10] items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_4%,var(--color-surface))]">
                  <span className="font-mono text-xs uppercase tracking-widest text-grid">
                    {p.id} · screenshot pending
                  </span>
                </div>
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
