# 08_POLISH_V2.md — Bug Fixes + Real Motion (T2) Pass

> Tool-agnostic: works for Claude Code OR Antigravity. Read 00_DESIGN_DIRECTION
> and 06_POLISH first for context. This pass does two things:
>   PART 1 — fix real bugs (blocking, do first).
>   PART 2 — the MOTION the site is missing (this is the T2 work; it's now
>            wanted and approved). Goal: the page should feel alive, not
>            "text pasted on a wall."
> Philosophy still holds: motion must feel smooth and intentional, never
> busy or toy-like. Smoothness is the premium signal.

============================================================
PART 1 — BUG FIXES (do first, all blocking)
============================================================

### BUG 1 — Profile photo not showing
- File exists at `public/profile.jpeg` (note .jpeg). Code looks for
  `profile.jpg`. Either rename in code OR (better) make the reference match
  `profile.jpeg`.
- In About.tsx, render the photo with next/image inside the existing panel:
  object-cover, fill the panel, keep the "profile · operator" caption strip.
  Keep the "SB" initials only as an onError fallback.
- Treat as portrait (~4:5).

### BUG 2 — Instagram link wrong
- Replace the placeholder with the REAL URL:
  https://www.instagram.com/shubh_builds_/
  (open in new tab, rel="noopener noreferrer").

### BUG 3 — Discord link reloads page
- It's currently `href="#"` (dead). Discord username is `ghostmanhanu` — a
  username is NOT a URL, so do NOT make it a link. Instead render the Discord
  entry as a "copy username" control: shows `ghostmanhanu`, and on click
  copies "ghostmanhanu" to the clipboard and briefly shows "copied!" inline.
  Keep it styled consistently with the Instagram/GitHub rows.

### BUG 4 — Pro card "MOST PICKED" badge clipped
- The badge is absolutely positioned above the card's top edge and gets cut
  off by the card's `overflow:hidden` (or the negative top offset exceeds the
  padding). Fix so the full badge is visible: either move the badge fully
  inside the card top padding, or add top margin/padding to the Services grid
  row so the badge has room, and ensure the card/clip container does not crop
  it. Verify on desktop AND at 360px.

### BUG 5 — Contact form legibility
- The form is on a dark ink-2 panel; inputs are dark-on-dark (hard to use).
  EITHER switch the form card to white (--surface) with dark text (keep the
  section background dark), OR keep dark but make inputs clearly lighter
  (--ink-2 fields → visible border + light text + visible placeholder).
  Recommendation: white form card. Maximize legibility on the conversion
  surface.

============================================================
PART 2 — MOTION (the missing soul)
============================================================

## M1 — Cursor: flowing particle trail (NOT a following ring)
Shubh wants a flowing "dust/smoke" trail, not the lerped hollow ring.
Rebuild Cursor.tsx as a canvas particle system:
- On pointer move, emit 2–4 small particles at the pointer position.
- Each particle: tiny (1–3px), color from a small palette of --signal /
  --signal-2 / white, with low alpha; given a small random velocity plus
  inheriting a fraction of the pointer's velocity (so fast swipes throw a
  longer streak — the "flow").
- Particles drift, decelerate, and fade out over ~500–700ms, then are
  recycled (object pool, cap ~120 particles for perf).
- Optional faint additive glow (globalCompositeOperation = 'lighter') for a
  soft dust look — test perf, drop if it costs frames.
- A subtle lead indicator (a small soft dot) at the exact pointer is fine,
  but the STAR is the flowing trail behind motion.
- requestAnimationFrame; pointer:fine only; fully disabled on touch +
  prefers-reduced-motion. pointer-events:none; never blocks clicks.
- This replaces the current ring cursor entirely.

## M2 — Hero headline: animated + hover-reactive (the centerpiece)
Right now the headline is static text. Make it feel alive:
- KEEP the load assemble (lines rise + un-blur on first load).
- ADD per-word hover interaction: wrap each WORD (ideally each LETTER for the
  two highlighted words "real-world products") in a span. On pointer move
  over the headline, words/letters near the cursor react — e.g. subtle
  push/parallax away from the cursor (translate a few px based on distance),
  plus a slight scale or weight shift, easing back when the cursor leaves.
  Think "magnetic text" / displacement, smooth and restrained (max ~6–10px).
- Use Framer Motion (useMotionValue + transform per letter) or a light rAF
  loop. Keep it 60fps; if per-letter is too heavy, do per-word.
- reduced-motion: static final text, no hover reaction.
- This is the ONE bold moment — make it genuinely good, keep the rest calmer.

## M3 — Section reveals everywhere (kill the "pasted on wall" feel)
Every section's heading + body + items should ENTER on scroll, not just be
there. Apply consistently (GSAP ScrollTrigger or Framer whileInView):
- Headings: clip-reveal or rise+fade (y 28→0, 0.6s).
- Paragraphs: fade+rise, slight stagger by line/block.
- Lists/chips/stats: stagger children (0.06–0.1s).
- Stats (248h / 7 / 24h): count-up when they enter view (keep).
- One easing everywhere: cubic-bezier(0.22, 1, 0.36, 1).
- play once; trigger ~80% in view. reduced-motion → final state.

## M4 — Services: fix + elevate
- Fix BUG 4 first.
- Scroll-in: three cards stagger up; Pro lands last with a 1→1.04→1 settle.
- Hover: ±6° tilt + a radial --signal glow that tracks the cursor across the
  card; lift y -6px; CTA magnetic.
- Section title "Three ways to ship." — heading clip-reveal on enter.

## M5 — Work: more life
- Cards reveal alternating left/right (eased slide + fade).
- Brand tile image: parallax a few px against scroll within its frame.
- Tech chips: stagger in after the card lands.
- Hover: tile image scale ~1.03 + signal corner-brackets draw in.
- (Tiles already look good — this adds motion, keep tiles.)

## M6 — Contact: fill + animate
- Keep the "what happens next" 01/02/03 list; reveal each row in stagger.
- Form fields rise+fade in stagger on enter.
- Submit button: magnetic + on-success state animates (checkmark / "received").

## M7 — Color: actually apply the new palette
The new tokens were added but the page still reads beige/soft. Verify the
components actually USE the tokens (not leftover hard-coded values):
- background --paper #ECEAE3 (cooler), text --ink #0A0A0B, accent --signal
  #2B4BFF (hotter). Dark sections --ink with --ink-2 panels + faint scanline.
- Grep for stray old hex values and replace with token vars.
- The difference should be visible: crisper, cooler, higher-contrast, hotter
  blue — not the soft beige of v1.

============================================================
PART 3 — T2 FLAIR (optional, build ONLY after Parts 1+2 are smooth)
============================================================
Add these ONE AT A TIME; keep each only if it adds class, not noise.
- T2-a Hero 3D object: one slow-rotating low-poly wireframe behind the
  headline, parallax to cursor, low opacity. @react-three/fiber@9 +
  @react-three/drei@10, dynamic import { ssr:false }. Cut if Lighthouse <90.
- T2-b "Three ways to ship" glyph: a small line-art paper-plane in --signal
  that drifts toward the cursor within the title zone, eases back on scroll.
  (On-theme: ship→shipping.) Cut if gimmicky.
- T2-c Closing band after Contact: big line "Still scrolling? Let's just
  build something." + signal CTA. Subtle 1-glyph micro-motion on idle/exit-
  intent. NO literal sad-face cartoon.
- (Panda mascot from 06 E3 stays optional/last; test on one network friend
  before keeping.)

============================================================
ABOUT COPY — rewrite for clarity (a stranger must "get it" in 5 seconds)
============================================================
Replace the About paragraphs with this clearer version:

> Para 1: "I'm Shubh Saxena, an 18-year-old web developer from India. I build
> fast, modern, good-looking websites for businesses and brands — from the
> first idea all the way to a finished site that's live and working."
>
> Para 2: "I've built an online store, a desktop app, and a 3D product viewer,
> so I'm comfortable with everything from simple sites to complex, interactive
> ones. Whatever you need built, I treat it like my own work — because my name
> is on it."

(Adjust age to Shubh's real age. Keep it plain and concrete — no jargon, no
"operator," no "pipeline." A non-technical client should instantly understand
what Shubh does and that he's good at it.)

============================================================
VERIFY before reporting (fix anything failing)
============================================================
- npm run build clean, 0 type errors.
- npm run dev 200; visual pass notes.
- Cursor is a flowing particle trail, smooth, never blocks clicks.
- Hero headline reacts to hover and is smooth (60fps).
- Every section animates on scroll-in.
- Pro badge fully visible (desktop + 360px).
- Photo renders. Instagram + Discord links go to the REAL targets in new tabs.
- New palette visibly applied.
- reduced-motion: everything final-state, no cursor/timelines/R3F.
- 360px: no overflow, nav collapses, headline clamps.

REPORT: per-file diff, anything skipped + why, perf note (Lighthouse if
possible), and the git add/commit/push commands. Commit message:
"polish v2: bugfixes + motion (cursor, hero hover, section reveals, color)".

Do not ask questions mid-pass. Make reasonable calls, note them at the end.
