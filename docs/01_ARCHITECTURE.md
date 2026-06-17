# 01_ARCHITECTURE.md — Technical Spec

> Derives from 00_DESIGN_DIRECTION.md. Versions verified current as of
> June 2026. Do not downgrade to Next 14 — it is End-of-Life.

## Stack (pinned to current stable, June 2026)

| Layer        | Choice                    | Version target | Note |
|--------------|---------------------------|----------------|------|
| Framework    | Next.js (App Router)      | ^16.2          | 14 is EOL; 16.x is stable, Turbopack default |
| Runtime      | React / React DOM         | ^19            | required by Next 16 |
| Node         | Node.js                   | ≥ 20 LTS       | Next 16 minimum |
| Language     | TypeScript                | ^5             | strict mode on |
| Styling      | Tailwind CSS              | ^4             | CSS-first config (@theme), no JS config needed |
| Scroll anim  | GSAP + ScrollTrigger      | ^3             | client-only dynamic import |
| Micro anim   | Framer Motion (motion)    | ^12            | card tilt, hover springs |
| Fonts        | next/font/google          | built-in       | Space Grotesk, Inter, JetBrains Mono |
| Forms        | Formspree (POST endpoint) | n/a            | no backend needed |
| Deploy       | Vercel                    | n/a            | GitHub auto-deploy |
| Repo         | github.com/shubhsaxena2020/portfolio | — | public |
| Domain       | shubhbuilds.com           | Namecheap      | — |

> Tailwind v4 note: configuration is CSS-first via `@import "tailwindcss";`
> and an `@theme { }` block in globals.css. There is no tailwind.config.js by
> default. If Claude Code prefers v3 conventions, that's acceptable as long as
> it's internally consistent and builds clean — but prefer v4.

## Design tokens (single source of truth → put in globals.css @theme)

```
--color-ink:     #0B0D10
--color-paper:   #F2F0EB
--color-surface: #FFFFFF
--color-signal:  #3D5AFE
--color-grid:    #D8D6CF
--color-muted:   #6B7178

--font-display: "Space Grotesk"
--font-body:    "Inter"
--font-mono:    "JetBrains Mono"

--radius: 14px
--maxw:   1200px   /* content container */
--ease:   cubic-bezier(0.22, 1, 0.36, 1)   /* the one easing we reuse */
```

## File structure

```
portfolio/
├── app/
│   ├── layout.tsx        # fonts, metadata, <Cursor/>, <Loader/>, skip-link
│   ├── page.tsx          # composes sections in order
│   └── globals.css       # @import tailwindcss; @theme tokens; base styles
├── components/
│   ├── Loader.tsx        # build-counter intro (SIGNATURE part 1)
│   ├── Cursor.tsx        # signal-dot + velocity trail (canvas)
│   ├── Nav.tsx           # status-bar style top nav
│   ├── Hero.tsx          # build-log assemble (SIGNATURE part 2)
│   ├── About.tsx         # operator bio + true stats
│   ├── Services.tsx      # three named tiers, tilt cards
│   ├── Work.tsx          # real projects as "build records"
│   ├── Contact.tsx       # console-style contact + Formspree
│   └── GridBg.tsx        # faint canvas grid overlay (decorative, aria-hidden)
├── lib/
│   ├── projects.ts       # typed project data (single source)
│   └── reduced-motion.ts # hook: usePrefersReducedMotion()
├── public/
│   ├── profile.jpg       # Gemini-edited solo headshot
│   ├── og.png            # social share card (1200×630)
│   └── work/             # project screenshots
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## Component contracts

Each component below lists: purpose · client/server · key props/data ·
animation · reduced-motion behavior · mobile behavior.

### Loader.tsx
- Purpose: SIGNATURE pt.1 — a build "completing" before content shows.
- Client. Renders a fixed --ink overlay (z 9998).
- Content: mono line `building shubh.build` + a 0→100 counter (2.0s) in
  Space Grotesk; at 100 a mono `✓ deployed` flashes --signal, then overlay
  slides up (translateY -100%, 0.7s, --ease).
- Runs once per tab session (sessionStorage flag `seen-loader`).
- Reduced-motion: skip entirely, render nothing, content visible immediately.
- Mobile: identical, counter font-size clamps down.

### Cursor.tsx
- Purpose: signal-dot + velocity trail. Client. Canvas, fixed, z 9999,
  pointer-events:none.
- Trail: ring buffer of ~22 points; particle radius 2–5px scaled by pointer
  velocity; color mixes --signal→--muted along the tail; opacity 1→0 over
  ~450ms; rendered with requestAnimationFrame.
- Lead dot: 7px solid --signal at live pointer position.
- Only mounts on (pointer:fine) devices. Unmounts/no-ops on touch.
- Reduced-motion: do not mount.
- Must never intercept clicks.

### Nav.tsx
- Purpose: top status bar. Client (scroll listener).
- Left: `SB` monogram (Space Grotesk, --signal).
- Center (desktop only): About · Services · Work · Contact (mono, small).
- Right: live status pill — `● available` (signal dot) + `IST` (mono);
  and a "Start a build" button (filled --signal) that scrolls to Contact.
- Initial: transparent over hero. After scrollY>72: --surface bg, hairline
  bottom border (--grid), backdrop-blur. Transition 0.25s.
- Mobile: monogram + status pill + hamburger → slide-down panel with links.

### Hero.tsx  (SIGNATURE pt.2)
- Purpose: the memorable moment. Client (GSAP timeline, runs after Loader).
- Layout: full viewport min-height; content left-aligned in --maxw container,
  vertically centered; GridBg behind (faint).
- Eyebrow (mono, --muted): `OPERATOR · INDIA · UTC+5:30`
- Status line (mono): types `> initializing shubh.build …` → `> ready`
  (`ready` turns --signal). ~1.2s.
- Headline (Space Grotesk, clamp(2.6rem, 6vw, 5.5rem), tight leading):
  line 1: "I direct AI to"
  line 2: "ship real products." ← "real products" in --signal
  Each line assembles: a --muted mono ghost appears then snaps to the real
  glyphs (use a brief blur/opacity swap, not a typewriter on the headline).
  Lines stagger 0.12s.
- A 1px --signal rule sweeps left→right under the headline (scaleX 0→1) to
  finish the "build."
- Subline (Inter, --muted): "17. Self-taught. Three shipped builds and
  counting."
- Buttons: "See the work" (filled --signal → scroll Work) · "Start a build"
  (outline → scroll Contact).
- Bottom: mono `scroll ↓` hint, gentle 6px bob.
- Reduced-motion: render the FINAL state of all the above, no timeline.
- Mobile: headline clamps; buttons stack full-width.

### About.tsx
- Purpose: operator bio + TRUE numbers. Client (ScrollTrigger reveals).
- Layout: left = profile.jpg in a --surface panel with hairline border and a
  mono caption strip beneath it (`profile · operator`); right = text.
- Eyebrow (mono): `WHO`
- Heading (Space Grotesk): "Seventeen. Already shipping."
- Body (Inter, 2 short paras): see 02_CONTENT.md for exact copy.
- Stat strip (mono labels, Space Grotesk numbers, count up on reveal). Use
  ONLY true stats from 02_CONTENT.md. No invented numbers.
- Reveal: opacity/y on scroll, stagger 0.12s. Reduced-motion: show final.

### Services.tsx
- Purpose: three named tiers (NOT numbered). Client (Framer tilt).
- Header: eyebrow `WHAT I BUILD` (mono) + heading "Three ways to ship."
- Three cards: Standard / Pro / Elite (content in 02_CONTENT.md). Pro is
  visually featured (--signal hairline border + faint glow + `MOST PICKED`
  mono tag). Each card: tier name (mono), title (display), one-line promise,
  feature list (mono ticks), price ("From $X"), CTA → Contact.
- Tilt: Framer useMotionValue mapped to rotateX/rotateY ±8°, perspective
  1000px, spring back on leave. Disable tilt on touch + reduced-motion.

### Work.tsx
- Purpose: real projects rendered as "build records." Client (ScrollTrigger).
- Data from lib/projects.ts (typed). Each record:
  mono header line `build_NN · <year>` · category pill · title (display) ·
  one-line result · tech chips (mono) · link button.
- Projects (REAL): Breathify (live link), Cortex (GitHub link),
  Furniture 3D Viewer (GitHub link). SparkClean demo appended Day 4 once
  built. See 02_CONTENT.md — do not invent results.
- Reveal: alternating slide-in. Reduced-motion: show final.

### Contact.tsx
- Purpose: console-style contact. Client.
- Dark section (--ink bg, --paper text).
- Heading (display): "Start a build."
- Subline (mono): "Open for freelance. Reply within 24h · IST."
- Form on a --surface card: Name, Email, Message, submit "Send request".
  POST to Formspree endpoint (placeholder constant FORMSPREE_ENDPOINT at top
  of file — clearly marked TODO). Inline success: "Request received. I'll
  reply within 24h." Inline error: "Didn't send — email me directly at
  <email>." Real validation, disabled state while sending.
- Links row (mono): Instagram @shubh_builds · GitHub shubhsaxena2020 ·
  Discord. Footer: "© 2026 Shubh Saxena · directed, not typed."

### GridBg.tsx
- Decorative faint grid (lines in --grid at low opacity), aria-hidden,
  pointer-events none. Used behind Hero (and optionally About). Pure CSS
  background or a single SVG. No animation.

## Animation system (one easing, one language)

```
--ease = cubic-bezier(0.22, 1, 0.36, 1) everywhere.
Scroll reveal: from {opacity:0; translateY:32px} → to {…0}, 0.7s, stagger .12s,
  trigger at 80% viewport, play once.
Hero timeline: status type (1.2s) → headline lines (stagger .12s) →
  signal rule sweep (0.5s) → subline+buttons fade (0.4s).
Hover: buttons scale 1.03 + brightness; cards tilt ±8° spring.
ALL of the above is gated behind usePrefersReducedMotion() → if true, render
final states, mount no GSAP timeline, mount no Cursor.
```

## Performance rules
- Images WebP/AVIF, ≤200KB, explicit width/height, priority only on hero-area.
- GSAP imported client-side only (dynamic) to keep it out of the server bundle.
- next/font for all three families (no FOUT/CLS).
- No UI/component libraries. No Three.js on the portfolio.
- Target Lighthouse ≥ 90 across the board.

## Accessibility floor
- Skip-to-content link first in DOM.
- Focus-visible rings in --signal on every interactive element.
- Headings semantic and ordered (one h1 in Hero).
- Form inputs have real <label>s; errors announced (aria-live polite).
- Color contrast AA on both paper and ink sections.

## Deploy pipeline
```
Claude Code builds locally → npm run dev verify → git push →
Vercel auto-build → add shubhbuilds.com in Vercel → set Namecheap DNS
(CNAME/A per Vercel) → SSL auto → live.
```
