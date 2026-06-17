"use client";

/**
 * Three NAMED tiers — never numbered 01/02/03 (doc 00 avoid-list).
 * Pro is visually featured (--signal hairline + glow + `MOST PICKED`).
 * Framer Motion tilt ±8°, perspective 1000px, spring back on leave.
 * Tilt disabled on touch + reduced-motion (renders static).
 */
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

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
      "Up to 5 pages",
      "Mobile-first",
      "Contact form",
      "Basic SEO",
      "7-day delivery",
    ],
    price: "From $200",
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
    price: "From $500",
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
    price: "From $1,000",
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
    ry.set(px * 16); // ±8°
    rx.set(-py * 16);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={
        tiltEnabled
          ? { rotateX, rotateY, transformPerspective: 1000 }
          : undefined
      }
      className={`relative flex flex-col rounded-[14px] border bg-surface p-7 ${
        tier.featured
          ? "border-signal shadow-[0_0_40px_-12px_var(--color-signal)]"
          : "border-grid"
      }`}
    >
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

      <div className="mt-7 flex items-center justify-between border-t border-grid pt-6">
        <span className="font-display text-lg font-bold">{tier.price}</span>
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
      </div>
    </motion.div>
  );
}

export default function Services() {
  const reduced = usePrefersReducedMotion();
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const tiltEnabled = !reduced && !coarse;

  return (
    <section id="services" className="py-24 sm:py-32">
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

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.label} tier={tier} tiltEnabled={tiltEnabled} />
          ))}
        </div>
      </div>
    </section>
  );
}
