# 02_CONTENT.md — Exact Copy & True Facts Only

> RULE: Everything here is real. Claude Code must use ONLY these facts and
> numbers. No invented clients, testimonials, or vanity metrics. If a field
> is marked [CONFIRM], Shubh fills it before deploy.

## Identity
- Name: Shubh Saxena
- Age: 17
- Location: India (UTC+5:30 / IST)
- Handle: @shubh_builds (Instagram) · shubhsaxena2020 (GitHub)
- Role label: "Operator" / "AI-directed web developer"

## Hero
- Eyebrow (mono):  `OPERATOR · INDIA · UTC+5:30`
- Status line:     `> initializing shubh.build …` then `> ready`
- Headline:        "I direct AI to ship real products."
                   (highlight "real products" in --signal)
- Subline:         "17. Self-taught. Three shipped builds and counting."
- Buttons:         "See the work"  /  "Start a build"

## About
- Eyebrow (mono): `WHO`
- Heading: "Seventeen. Already shipping."
- Para 1: "I'm Shubh — a developer from India who treats AI as a build crew,
  not a toy. Instead of typing every line, I architect what needs to exist
  and direct AI tools to build it, fast. The output is the same thing any
  studio ships: real, working products."
- Para 2: "I've launched an e-commerce store, built a local-first desktop
  app, and engineered a 3D furniture viewer from photos. Now I take that same
  pipeline and point it at your website."

### Stats — TRUE ONLY (count-up on reveal)
- `3`   — Products shipped        (Breathify, Cortex, Furniture 3D Viewer)
- `7`   — Day average delivery    (target; honest framing as "avg")
- `24h` — Reply time              (real commitment)
> Do NOT add client counts, revenue, or follower numbers. None exist yet.

## Services — three named tiers (no 01/02/03)

### Standard
- Tier label (mono): `STANDARD`
- Title: "Standard"
- Promise: "Clean, fast, responsive. Online in a week."
- Features: "Up to 5 pages" · "Mobile-first" · "Contact form" ·
  "Basic SEO" · "7-day delivery"
- Price: "From $200"

### Pro  (FEATURED — `MOST PICKED`)
- Tier label (mono): `PRO`
- Title: "Pro"
- Promise: "Animated and interactive. Built to convert."
- Features: "Everything in Standard" · "Scroll animations" ·
  "Hover interactions" · "Performance-tuned" · "14-day delivery"
- Price: "From $500"

### Elite
- Tier label (mono): `ELITE`
- Title: "Elite"
- Promise: "3D, immersive, unforgettable. For brands that refuse ordinary."
- Features: "Everything in Pro" · "3D / WebGL elements" · "Custom cursor FX" ·
  "Cinematic scroll" · "21-day delivery"
- Price: "From $1,000"

## Work — REAL projects (rendered as build records)

### build_01 · 2026 — Breathify
- Category: E-Commerce
- Result line: "A conversion-focused Shopify store for a posture-corrector
  brand — custom design, mobile-tuned."
- Tech: Shopify · Custom CSS · AI-assisted
- Link: https://getbreathify.store  (label "View live →")
- Screenshot: public/work/breathify.png  [CONFIRM screenshot]

### build_02 · 2026 — Cortex
- Category: Desktop App
- Result line: "A privacy-first, local-first knowledge tool — embeddings,
  full-text search, and an auto-linking memory graph. 264 passing tests."
- Tech: Electron · React · TypeScript · SQLite
- Link: https://github.com/shubhsaxena2020/cortex  (label "View code →")
- Screenshot: public/work/cortex.png  [CONFIRM screenshot]

### build_03 · 2026 — Furniture 3D Viewer
- Category: 3D / Computer Vision
- Result line: "Turns ordinary product photos into textured 3D models in the
  browser — PBR materials, multi-view texture transfer."
- Tech: Python · FastAPI · Three.js · OpenCV
- Link: https://github.com/shubhsaxena2020/furniture-3d-viewer (label "View code →")
- Screenshot: public/work/furniture.png  [CONFIRM screenshot]

### build_04 · 2026 — SparkClean  [ADDED DAY 4, after demo is built]
- Category: Business Website (demo)
- Result line: "Demo build: a premium cleaning-company site with booking,
  pricing tiers, and trust-first design."
- Tech: Next.js · Tailwind · Framer Motion
- Link: [Vercel demo URL]  (label "View demo →")
- Screenshot: public/work/sparkclean.png

> Note: showing Cortex + Furniture viewer (real engineering) to a room of
> senior software engineers is far stronger proof than three fake business
> sites. Lead with the real work; SparkClean is the "I also do client sites"
> proof, added once built.

## Contact
- Heading: "Start a build."
- Subline (mono): "Open for freelance. Reply within 24h · IST."
- Fields: Name · Email · Message · "Send request"
- Success: "Request received. I'll reply within 24h."
- Error:   "Didn't send — email me at [CONFIRM email]."
- Links: Instagram @shubh_builds · GitHub shubhsaxena2020 · Discord [CONFIRM]
- Footer: "© 2026 Shubh Saxena · directed, not typed."

## Placeholders to fill before deploy
- [CONFIRM] Formspree endpoint  (FORMSPREE_ENDPOINT in Contact.tsx)
- [CONFIRM] contact email (for the error fallback)
- [CONFIRM] Discord link/handle
- [CONFIRM] profile.jpg (Gemini-edited solo headshot)
- [CONFIRM] work screenshots: breathify.png, cortex.png, furniture.png
