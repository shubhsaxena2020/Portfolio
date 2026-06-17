"use client";

/**
 * Three NAMED tiers — never numbered 01/02/03 (doc 00 avoid-list).
 * Pro is visually featured (--signal hairline + glow + `MOST PICKED`).
 *
 * Motion (doc 06 D3), split so GSAP and Framer never fight over transform:
 *  - OUTER wrapper: GSAP scroll-in (rise + fade, stagger). Pro arrives last
 *    and "locks" with a 1→1.04→1 scale overshoot.
 *  - INNER card: Framer tilt (±6°, perspective 1000px) + a soft --signal glow
 *    that tracks the cursor. Tilt/glow disabled on touch + reduced-motion.
 *  - CTAs: magnetic hover.
 */
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import Magnetic from "@/components/Magnetic";

type Tier = {
  label: string;
  title: string;
  promise: string;
  features: string[];
  price: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    label: "STANDARD",
    title: "Standard",
    promise: "Clean, fast, responsive. Online in a week.",
    features: [
      "Complete website build",
      "Mobile-first",
      "Contact form",
      "Basic SEO",
      "7-day delivery",
    ],
    price: "From $100",
  },
  {
    label: "PRO",
    title: "Pro",
    promise: "Animated and interactive. Built to convert.",
    features: [
      "Everything in Standard",
      "Scroll animations",
      "Hover interactions",
      "Performance-tuned",
      "14-day delivery",
    ],
    price: "From $300",
    featured: true,
  },
  {
    label: "ELITE",
    title: "Elite",
    promise: "3D, immersive, unforgettable. For brands that refuse ordinary.",
    features: [
      "Everything in Pro",
      "3D / WebGL elements",
      "Custom cursor FX",
      "Cinematic scroll",
      "21-day delivery",
    ],
    price: "From $700",
  },
];

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function TierCard({ tier, tiltEnabled }: { tier: Tier; tiltEnabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRX = useSpring(rx, { stiffness: 220, damping: 18 });
  const springRY = useSpring(ry, { stiffness: 220, damping: 18 });
  const rotateX = useTransform(springRX, (v) => `${v}deg`);
  const rotateY = useTransform(springRY, (v) => `${v}deg`);

  const onMove = (e: React.MouseEvent) => {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 12); // ±6°
    rx.set(-py * 12);
    // cursor-tracking glow position
    ref.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    ref.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    // OUTER wrapper — GSAP owns this transform (scroll-in + Pro overshoot).
    <div data-card data-featured={tier.featured ? "1" : undefined}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={
          tiltEnabled
            ? { rotateX, rotateY, transformPerspective: 1000 }
            : undefined
        }
        className={`group relative flex h-full flex-col overflow-hidden rounded-[14px] border bg-surface p-7 ${
          tier.featured
            ? "border-signal shadow-[0_0_40px_-12px_var(--color-signal)]"
            : "border-grid"
        }`}
      >
        {/* cursor-tracking glow */}
        {tiltEnabled && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-signal) 16%, transparent), transparent 60%)",
            }}
          />
        )}

        {tier.featured && (
          <span className="absolute -top-3 left-7 rounded-full bg-signal px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-white">
            Most picked
          </span>
        )}

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {tier.label}
        </p>
        <h3 className="font-display mt-3 text-2xl font-bold">{tier.title}</h3>
        <p className="mt-2 text-sm text-muted">{tier.promise}</p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {tier.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 font-mono text-xs text-ink"
            >
              <span className="mt-px text-signal" aria-hidden="true">
                ✓
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-grid pt-6">
          <span className="font-display text-lg font-bold">{tier.price}</span>
          <Magnetic>
            <button
              onClick={scrollToContact}
              className={`rounded-[10px] px-4 py-2 font-mono text-xs font-medium transition-transform duration-200 hover:scale-[1.03] ${
                tier.featured
                  ? "bg-signal text-white"
                  : "border border-ink text-ink"
              }`}
            >
              Start →
            </button>
          </Magnetic>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const tiltEnabled = !reduced && !coarse;

  // Scroll-in: side cards stagger, Pro arrives last and locks with overshoot.
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
        const cards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-card]")
        );
        const others = cards.filter((c) => !c.dataset.featured);
        const pro = cards.find((c) => c.dataset.featured);

        gsap.set(cards, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
        });
        tl.to(others, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        });
        if (pro) {
          tl.to(
            pro,
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
            ">-0.05"
          );
          tl.to(
            pro,
            {
              keyframes: { scale: [1, 1.04, 1] },
              duration: 0.45,
              ease: "power2.inOut",
            },
            ">-0.1"
          );
        }
      }, root);
    })();

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="services" className="py-24 sm:py-32">
      <div className="container">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          WHAT I BUILD
        </p>
        <h2
          className="font-display mt-4 font-bold leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Three ways to ship.
        </h2>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.label} tier={tier} tiltEnabled={tiltEnabled} />
          ))}
        </div>
      </div>
    </section>
  );
}
