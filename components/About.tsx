"use client";

/**
 * Operator bio + TRUE stats only (doc 01/02).
 * - Left: profile panel (--surface, hairline border) + mono caption strip.
 *   profile.jpeg matches public/profile.jpeg.
 * - Right: eyebrow `WHO`, heading, two paragraphs (exact copy from doc 02).
 * - Stat strip: count-up on reveal, ONLY the three real numbers.
 * - GSAP ScrollTrigger reveal; reduced-motion → final state, no timeline.
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Stat = {
  /** numeric target for the count-up */
  target: number;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { target: 248, suffix: "h", label: "Last build" },
  { target: 7, label: "Day turnaround" },
  { target: 24, suffix: "h", label: "Reply time" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const nums = Array.from(
      root.querySelectorAll<HTMLElement>("[data-count]")
    );

    let killed = false;
    let ctx: gsap.Context | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.set(reveals, { opacity: 0, y: 28 });

        gsap.to(reveals, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power4.out", // closely matches cubic-bezier(0.22, 1, 0.36, 1)
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });

        // Count-up: each number animates 0 → target when the strip reveals.
        nums.forEach((el) => {
          const target = Number(el.dataset.count || "0");
          const suffix = el.dataset.suffix || "";
          const proxy = { n: 0 };
          gsap.to(proxy, {
            n: target,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(proxy.n)}${suffix}`;
            },
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
    <section ref={rootRef} id="about" className="py-24 sm:py-32">
      <div className="container grid items-start gap-12 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
        {/* Profile panel */}
        <div data-reveal>
          <div className="overflow-hidden rounded-[14px] border border-grid bg-surface">
            <div className="relative aspect-[4/5] bg-[color-mix(in_srgb,var(--color-ink)_4%,var(--color-surface))]">
              {!imageError ? (
                <Image
                  src="/profile.jpeg"
                  alt="Shubh Saxena"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-7xl font-bold text-grid">
                    SB
                  </span>
                </div>
              )}
            </div>
            <div className="border-t border-grid px-4 py-3 font-mono text-xs text-muted">
              profile · operator
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <p
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.25em] text-muted"
          >
            WHO
          </p>
          <h2
            data-reveal
            className="font-display mt-4 font-bold leading-[1.1] tracking-tight text-ink"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Young, but already shipping.
          </h2>

          <p data-reveal className="mt-6 max-w-2xl text-muted text-sm sm:text-base">
            I&apos;m Shubh Saxena, a 17-year-old web developer from India. I build
            fast, modern, good-looking websites for businesses and brands — from the
            first idea all the way to a finished site that&apos;s live and working.
          </p>
          <p data-reveal className="mt-4 max-w-2xl text-muted text-sm sm:text-base">
            I&apos;ve built an online store, a desktop app, and a 3D product viewer,
            so I&apos;m comfortable with everything from simple sites to complex, interactive
            ones. Whatever you need built, I treat it like my own work — because my name
            is on it.
          </p>

          {/* Stat strip */}
          <dl
            data-reveal
            className="mt-10 grid grid-cols-3 gap-6 border-t border-grid pt-8 text-ink"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dd
                  data-count={s.target}
                  data-suffix={s.suffix || ""}
                  className="font-display text-4xl font-bold tabular-nums sm:text-5xl"
                >
                  {s.target}
                  {s.suffix || ""}
                </dd>
                <dt className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
