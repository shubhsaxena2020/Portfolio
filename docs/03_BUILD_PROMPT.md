# 03_BUILD_PROMPT.md — Paste Into Claude Code

> HOW TO USE: Put the four docs (00_DESIGN_DIRECTION, 01_ARCHITECTURE,
> 02_CONTENT, and this file) in the project folder. Open Claude Code in that
> folder. Paste EVERYTHING between the === lines. Don't edit it.

===

You are building a production portfolio site. Three spec files sit in this
folder: `00_DESIGN_DIRECTION.md`, `01_ARCHITECTURE.md`, `02_CONTENT.md`.

STEP 0 — Read all three docs fully before writing any code. They are the
contract. 00 is the design thesis (it wins any conflict), 01 is the technical
spec and component contracts, 02 is the exact copy and the ONLY facts you may
use. Do not invent stats, clients, testimonials, or results — 02 is the
source of truth and several fields are real project facts.

PROJECT: Personal portfolio for Shubh Saxena, a 17-year-old AI-directed web
developer. Deploys to shubhbuilds.com on Vercel. The thesis (per doc 00):
Shubh is an *operator who directs AI to ship real products* — the site's
look is a calm, tasteful "build console / control surface," NOT a generic
agency splash. Avoid the three AI-default looks called out in doc 00.

NON-NEGOTIABLE TECHNICAL CONSTRAINTS (per doc 01, verified June 2026):
- Next.js ^16.2 (App Router). Do NOT use Next 14 — it is End-of-Life.
- React ^19, Node ≥20, TypeScript ^5 (strict).
- Tailwind CSS ^4 (CSS-first: `@import "tailwindcss";` + `@theme{}` in
  globals.css; no JS config file unless you have a reason).
- GSAP ^3 (+ ScrollTrigger, client-only dynamic import).
- Framer Motion ^12 for card tilt + hover springs.
- next/font/google for Space Grotesk (display), Inter (body),
  JetBrains Mono (mono). No layout shift.
- No component libraries. No Three.js on the portfolio.

BUILD THE FILE TREE exactly as specified in doc 01 ("File structure"):
app/{layout,page,globals.css}, components/{Loader,Cursor,Nav,Hero,About,
Services,Work,Contact,GridBg}.tsx, lib/{projects.ts,reduced-motion.ts},
plus package.json, tsconfig.json, next.config.ts, postcss.config.mjs.

IMPLEMENT EACH COMPONENT to its contract in doc 01 ("Component contracts").
Key things that must be right:
- Tokens: put the exact palette + fonts + --radius/--maxw/--ease from doc 01
  into globals.css as the single source of truth. Derive every color/type
  choice from tokens — no stray hex values.
- SIGNATURE (the memorable moment): the hero "build" assemble + the Loader
  build-counter, exactly as doc 00 SIGNATURE and doc 01 Hero/Loader describe.
- Cursor: signal-dot + velocity trail, pointer:fine only, never blocks clicks.
- Copy: pull every word from doc 02. Use the mono face for all eyebrows,
  labels, status lines, and specs — never for body prose.
- Work section: render the THREE real projects from doc 02 (Breathify,
  Cortex, Furniture 3D Viewer) from a typed lib/projects.ts. Leave a clean
  slot to append a 4th (SparkClean) later.
- Mark every fill-later value as a clearly-named constant with a `// TODO`
  comment: FORMSPREE_ENDPOINT, contact email, Discord link, image paths.
  Use tasteful placeholders (e.g. initials block for missing profile.jpg) so
  the site builds and looks intentional even before assets are added.

QUALITY FLOOR (build it in, don't announce it):
- usePrefersReducedMotion() hook gates ALL motion: if reduced, render final
  states, mount no GSAP timeline, mount no Cursor trail. Implement this for
  real, not as a stub.
- Responsive to 360px. Mobile nav = hamburger slide-down. Headlines clamp.
- Skip-to-content link. focus-visible rings in --signal on all interactive
  elements. Semantic landmarks, single h1, ordered headings.
- Form has real labels + inline validation + aria-live status.
- Images get explicit dimensions; hero-area assets use priority.

AFTER BUILDING — run a self-check and FIX before reporting:
1. `npm install` then `npm run build` — it must compile with zero errors and
   zero type errors. If it fails, fix and rebuild until clean.
2. `npm run dev` and confirm the page renders (note anything you couldn't
   verify headlessly).
3. Re-read doc 00's "What to consciously AVOID" list and confirm you did none
   of them; if you did, revise.

THEN REPORT BACK with, in this order:
1. Exact commands to install + run dev + run build.
2. The full list of `// TODO` constants I must fill, with file + line.
3. The DNS records I'll set at Namecheap to point shubhbuilds.com at Vercel.
4. Git commands to init, commit, and push to
   github.com/shubhsaxena2020/portfolio.
5. Anything you had to decide yourself or couldn't verify.

Do NOT ask me questions mid-build. Make reasonable decisions, note them at
the end. Build the whole thing in one pass, then verify, then report.

===
