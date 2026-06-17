/**
 * Single source of truth for the Work section.
 *
 * RULE (doc 02): every field here is a REAL project fact. No invented
 * results, clients, or metrics. To add SparkClean on Day 4, append the
 * commented record at the bottom once the demo is live.
 */

export type ProjectLink = {
  href: string;
  label: string;
};

export type Project = {
  /** Sequential build id, e.g. "build_01". Rendered in the mono header. */
  id: string;
  year: string;
  title: string;
  category: string;
  /** One-line outcome — no invented numbers (doc 02). */
  result: string;
  tech: string[];
  link: ProjectLink;
  /** Screenshot path under /public. May not exist yet → graceful fallback. */
  image: string;
  /** Wordmark shown on the designed brand tile when no screenshot exists. */
  wordmark: string;
  /**
   * Flip to true once the real screenshot at `image` is added to public/work.
   * While false, the Work section renders a designed brand tile instead of a
   * broken image, so nothing ever looks unfinished.
   */
  hasImage?: boolean;
};

export const projects: Project[] = [
  {
    id: "build_01",
    year: "2026",
    title: "Breathify",
    category: "E-Commerce",
    result:
      "A conversion-focused Shopify store for a posture-corrector brand — custom design, mobile-tuned.",
    tech: ["Shopify", "Liquid", "Custom CSS"],
    link: { href: "https://getbreathify.store", label: "View live →" },
    image: "/work/breathify.png", // TODO: add screenshot — public/work/breathify.png, then set hasImage:true
    wordmark: "Breathify",
  },
  {
    id: "build_02",
    year: "2026",
    title: "Cortex",
    category: "Desktop App",
    result:
      "A privacy-first, local-first knowledge tool — embeddings, full-text search, and an auto-linking memory graph. 264 passing tests.",
    tech: ["Electron", "React", "TypeScript", "SQLite"],
    link: {
      href: "https://github.com/shubhsaxena2020/cortex",
      label: "View code →",
    },
    image: "/work/cortex.png", // TODO: add screenshot — public/work/cortex.png, then set hasImage:true
    wordmark: "Cortex",
  },
  {
    id: "build_03",
    year: "2026",
    title: "Furniture 3D Viewer",
    category: "3D / Computer Vision",
    result:
      "Turns ordinary product photos into textured 3D models in the browser — PBR materials, multi-view texture transfer.",
    tech: ["Python", "FastAPI", "Three.js", "OpenCV"],
    link: {
      href: "https://github.com/shubhsaxena2020/furniture-3d-viewer",
      label: "View code →",
    },
    image: "/work/furniture.png", // TODO: optional screenshot — public/work/furniture.png, then set hasImage:true
    wordmark: "Furniture3D",
  },

  // ── SparkClean — ADD DAY 4, once the demo is deployed (doc 02). ──
  // {
  //   id: "build_04",
  //   year: "2026",
  //   title: "SparkClean",
  //   category: "Business Website (demo)",
  //   result:
  //     "Demo build: a premium cleaning-company site with booking, pricing tiers, and trust-first design.",
  //   tech: ["Next.js", "Tailwind", "Framer Motion"],
  //   link: { href: "TODO_VERCEL_DEMO_URL", label: "View demo →" },
  //   image: "/work/sparkclean.png",
  //   wordmark: "SparkClean",
  //   hasImage: true,
  // },
];
